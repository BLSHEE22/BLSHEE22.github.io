## ROSTER OBJECT ##
class Roster:
    def __init__(self, team, year=None):
        self._team = team
        self._coach = None
        self._players = []

        # scrape
        self._get_all_player_information(year)

        # store in db
        if self._team and self._players:
            save_to_db(self._players)

    def _create_url(self, year):
        """
        Build the team URL.

        Build a URL given a team's abbreviation and the 4-digit year.

        Parameters
        ----------
        year : string
            The 4-digit string representing the year to pull the team's roster
            from.

        Returns
        -------
        string
            Returns a string of the team's season page for the requested team
            and year.
        """
        return ROSTER_URL % (self._team.lower(), year)

    def _pull_team_page(self, url):
        """
        Download the team page.

        Download the requested team's season page and create a PyQuery object.

        Parameters
        ----------
        url : string
            A string of the built URL for the requested team and season.

        Returns
        -------
        PyQuery object
            Returns a PyQuery object of the team's HTML page.
        """
        try:
            return pq(utils._remove_html_comment_tags(pq(url)))
        except HTTPError:
            return None
        
    def _get_player_id(self, player):
        """
        Parse the player ID.

        Given a PyQuery object representing a single player on the team roster,
        parse the player ID and return it as a string.

        Parameters
        ----------
        player : PyQuery object
            A PyQuery object representing the player information from the
            roster table.

        Returns
        -------
        string
            Returns a string of the player ID.
        """
        name_tag = player('td[data-stat="player"] a')
        name = re.sub(r'.*/players/./', '', str(name_tag))
        return re.sub(r'\.htm.*', '', name)

    def _get_player_name(self, player):
        """
        Parse the player's name.

        Given a PyQuery object representing a single player on the team roster,
        parse the player ID and return it as a string.

        Parameters
        ----------
        player : PyQuery object
            A PyQuery object representing the player information from the
            roster table.

        Returns
        -------
        string
            Returns a string of the player's name.
        """
        name_tag = player('td[data-stat="player"] a')
        return name_tag.text()

    def _parse_coach(self, page):
        """
        Parse the team's coach.

        Given a copy of the team's roster page, find and parse the team's
        coach from the team summary.

        Parameters
        ----------
        page : PyQuery object
            A PyQuery object representing the team's roster page.

        Returns
        -------
        string
            Returns a string of the coach's name.
        """
        for line in page('[data-template="Partials/Teams/Summary"]').find('p').items():
            strong = line.find('strong')
            if hasattr(strong, 'text') and strong.text().strip() == 'Coach:':
                return line.find('a').text()
    
    def _get_all_player_information(self, year):
        """
        Find all player IDs for the requested team.

        For the requested team and year (if applicable), pull the roster table
        and parse the player ID for all players on the roster and create an
        instance of the Player class for the player. All player instances are
        added to the 'players' property to get all stats for all players on a
        team.

        Parameters
        ----------
        year : string
            The 4-digit string representing the year to pull the team's roster
            from.
        """
        # main async runner
        async def get_player_information(players):
            sem = asyncio.Semaphore(3)  # max 3 requests at once (tune this value!)

            async with aiohttp.ClientSession() as session:   
                tasks = []
                for i, player in enumerate(players):     
                    # space requests by 3 seconds each             
                    tasks.append(fetch_player_info(session, player, delay=i*3))
                playersPopulated = await asyncio.gather(*tasks)
                return playersPopulated
        
        async def fetch_player_info(session, player, delay=3):
            await asyncio.sleep(delay) # wait before firing request
            player_id = self._get_player_id(player)
            print(player_id)
            player_instance = Player(player_id)
            url = player_instance._build_url()
            if url == 'no_player_page':
                return
            async with session.get(url) as resp:
                html = await resp.text()
                soup = BeautifulSoup(html, "html.parser")
                # name
                player_instance._name = soup.select_one("h1").text.strip()
                # team
                narrowedSoup = [item.get_text(strip=True) for item in soup.select('#meta div a')]
                if narrowedSoup:
                    if narrowedSoup[0] in nflTeamTranslator.keys():
                        player_instance._team_abbreviation = str(narrowedSoup[0])
                return player_instance

        if not year:
            year = utils._find_year_for_season('nfl')
        url = self._create_url(year)
        page = self._pull_team_page(url)
        if not page:
            output = ("Can't pull requested team page. Ensure the following "
                      "URL exists: %s" % url)
            raise ValueError(output)
        
        # collect player pages asynchronously
        self._players = asyncio.run(get_player_information(page('table#roster tbody tr').items()))

        # collect coach
        self._coach = self._parse_coach(page)
        

    @property
    def players(self):
        """
        Returns a ``list`` of player instances for each player on the requested
        team's roster if the ``slim`` property is False when calling the Roster
        class. If the ``slim`` property is True, returns a ``dictionary`` where
        each key is a string of the player's ID and each value is the player's
        first and last name as listed on the roster page.
        """
        return self._players

    @property
    def coach(self):
        """
        Returns a ``string`` of the coach's name, such as 'Sean Payton'.
        """
        return self._coach
    