## PLAYER OBJECT ##
class Player:
    def __init__(self, player_id):
        self._name = None
        self._player_id = player_id
        self._team_abbreviation = None
        self._initial_team = None
        self._team_history = None
        # player_data = self._pull_player_data()
        # if not player_data:
        #     print(f"Could not find player data for {player_id}....")
        #     return
        # self._find_initial_index()
        # print(f"Pulled data for {self._name}!")
    
    def __str__(self):
        """
        Return the string representation of the class.
        """
        return f'{self.name} ({self.player_id})'

    def __repr__(self):
        """
        Return the string representation of the class.
        """
        return self.__str__()

    def _build_url(self):
        """
        Create the player's URL to pull stats from.

        The player's URL requires the first letter of the player's last name
        followed by the player ID.

        Returns
        -------
        string
            The string URL for the player's stats page.
        """
        # The first letter of the player's last name is used to sort the player
        # list and is a part of the URL.
        if not self._player_id:
            return 'no_player_page'
        first_character = self._player_id[0]
        return PLAYER_URL % (first_character, self._player_id)

    def _retrieve_html_page(self):
        """
        Download the requested player's stats page.

        Download the requested page and strip all of the comment tags before
        returning a PyQuery object which will be used to parse the data.
        Oftentimes, important data is contained in tables which are hidden in
        HTML comments and not accessible via PyQuery.

        Returns
        -------
        PyQuery object
            The requested page is returned as a queriable PyQuery object with
            the comment tags removed.
        """
        url = self._build_url()
        if url == 'no_player_page':
            return None
        try:
            url_data = pq(url)
        except (HTTPError, ParserError):
            return None
        # For NFL, a 404 page doesn't actually raise a 404 error, so it needs
        # to be manually checked.
        if 'Page Not Found (404 error)' in str(url_data):
            return None
        return pq(utils._remove_html_comment_tags(url_data))
    
    def _parse_team(self, player_info):
        """
        Parse the current team the player is playing for.

        Pull the player's current team from the player information and set the
        'team_abbreivation' attribute with the value prior to returning.

        Parameters
        ----------
        player_info : PyQuery object
            A PyQuery object containing the HTML from the player's stats page.
        """
        value = [item.text() for item in player_info('#meta div a').items()]
        if value:
            if value[0] not in nflTeamTranslator.keys():
                value = None
        setattr(self, '_team_abbreviation', value)
    
    def _parse_team_history(self, player_info):
        """
        Parse the set of all teams the player has played for.

        Pull the player's team history from the player information and set the
        'team_history' attribute with the value prior to returning.

        Parameters
        ----------
        player_info : PyQuery object
            A PyQuery object containing the HTML from the player's stats page.
        """
        # track team history via 'Snap Counts' data
        team_hist = [item.text() for item in player_info('[id="snap_counts"] td[data-stat="team"]').items()]
        for i in range(0, len(team_hist)-1):
            if team_hist[i] == '':
                team_hist[i] = team_hist[i+1]
        years_played = [item.text().replace('*', '') for item in player_info('[id="snap_counts"] th[data-stat="year_id"]').items()][1:]
        for i in range(1, len(years_played)):
            if years_played[i] == '':
                years_played[i] = years_played[i-1]
        if team_hist:
            if "LAR" in team_hist:
                team_hist = [team.replace("LAR", "RAM") for team in team_hist]
            if "STL" in team_hist:
                team_hist = [team.replace("STL", "RAM") for team in team_hist]
            if "LAC" in team_hist:
                team_hist = [team.replace("LAC", "SDG") for team in team_hist]
            if "IND" in team_hist:
                team_hist = [team.replace("IND", "CLT") for team in team_hist]
            if "OAK" in team_hist:
                team_hist = [team.replace("OAK", "RAI") for team in team_hist]
            if "LVR-OAK" in team_hist:
                team_hist = [team.replace("LVR-OAK", "RAI") for team in team_hist]
            if "LVR" in team_hist:
                team_hist = [team.replace("LVR", "RAI") for team in team_hist]
            if "TEN" in team_hist:
                team_hist = [team.replace("TEN", "OTI") for team in team_hist]
            if "ARI" in team_hist:
                team_hist = [team.replace("ARI", "CRD") for team in team_hist]
            initial_team = team_hist[0]
        else:
            initial_team = None
        team_hist_full = set([(team_hist[i], years_played[i]) for i in range(len(team_hist))])
        team_hist_dict = dict()
        for team, yr in team_hist_full:
            if 'TM' not in team and team != '':
                try:
                    team_hist_dict[team]
                except:
                    team_hist_dict[team] = []
                team_hist_dict[team].append(yr)
                team_hist_dict[team] = sorted([yr for yr in team_hist_dict[team] if all(char.isnumeric() or char == '*' for char in yr)])

        setattr(self, '_initial_team', initial_team)
        setattr(self, '_team_history', team_hist_dict)

    def _parse_player_information(self, player_info):
        """
        Parse general player information.

        Parse general player information such as height, weight, and name. The
        attribute for the requested field will be set with the value prior to
        returning.

        Parameters
        ----------
        player_info : PyQuery object
            A PyQuery object containing the HTML from the player's stats page.
        """

        for field in ['_height', '_weight', '_name']:
            short_field = str(field)[1:]
            value = player_info("h1").text()
            if short_field != 'name':
                result_list = [item.text() for item in player_info("#meta div p span").items()]
                if result_list:
                    if any(char.isalpha() for char in result_list[0]):
                        result_list = result_list[1:]
                value = result_list[field_map[short_field]]
                if " " in value:
                    print('Skipping ' + short_field + ' because illegal value \'' + value + '\' found.')
                    continue
            setattr(self, field, value)

    def _parse_position(self, player_info):
        """
        Parse the player's position.

        Pull the player's position from the player information and set the
        'position' attribute with the value prior to returning.

        Parameters
        ----------
        player_info : PyQuery object
            A PyQuery object containing the HTML from the player's stats page.
        """
        meta_text = "".join([item.text() for item in player_info("#meta div p").items()])
        if 'Position: ' in meta_text:
            pos_index = meta_text.index('Position: ')
            pos_text = meta_text[pos_index:]
            numeric_indices = []
            for ft in ['Throws:', '5', '6', '7']:
                first_num_index = pos_text.find(ft)
                if first_num_index > 0:
                    numeric_indices.append(first_num_index)
            numeric_index = min(numeric_indices)
            value = pos_text[10:numeric_index]
        else:
            value = 'Unknown'
        setattr(self, '_position', value)

    def _parse_birth_date(self, player_info):
        """
        Parse the player's birth date.

        Parse the player's birth date which is embedded in an attribute in
        their birth tag on the HTML page.

        Parameters
        ----------
        player_info : PyQuery object
            A PyQuery object containing the HTML from the player's stats page.
        """
        date = player_info('#necro-birth').attr('data-birth')
        setattr(self, '_birth_date', date)

    def _parse_career_av(self, player_info):
        """
        Parse the player's weighted career average value.

        Parameters
        ----------
        player_info : PyQuery object
            A PyQuery object containing the HTML from the player's stats page.
        """
        value = None
        career_av_field = [t for t in [item.text() for item in player_info("#meta div p").items()] if 'Weighted Career AV' in t]
        if career_av_field:
            field_and_value = career_av_field[0].split(":")
            if field_and_value:
                value = field_and_value[1]
                stop_index = value.index("(")
                value = value[1:stop_index-1]
        setattr(self, '_weighted_career_av', value)

    def _parse_fantasy_pos_rk(self, player_info):
        """
        Parse the player's fantasy position rank.

        Parameters
        ----------
        player_info : PyQuery object
            A PyQuery object containing the HTML from the player's stats page.
        """
        value = None
        fantasy_pos_rk_field = [item.text() for item in player_info('td[data-stat="fantasy_rank_pos"]').items()]
        if fantasy_pos_rk_field:
            value = fantasy_pos_rk_field[-2]
        setattr(self, '_fantasy_pos_rk', value)

    def _parse_headshot_url(self, player_info):
        """
        Parse the player's headshot photo URL.

        Parameters
        ----------
        player_info : PyQuery object
            A PyQuery object containing the HTML from the player's stats page.
        """
        value = None
        headshot_field = [item.attr['src'] for item in player_info('#meta div[class="media-item"] img').items()]
        if headshot_field:
            value = headshot_field[0]
        setattr(self, '_headshot_url', value)

    def _pull_player_data(self):
        """
        Pull and aggregate all player information.

        Pull the player's HTML stats page and parse unique properties, such as
        the player's height, weight, and name. Next, combine all stats for all
        seasons plus the player's career stats into a single object which can
        easily be iterated upon.

        Returns
        -------
        dictionary
            Returns a dictionary of the player's combined stats where each key
            is a string of the season and the value is the seaon's associated
            stats.
        """
        player_info = self._retrieve_html_page()
        if not player_info:
            return
        self._parse_player_information(player_info)
        # self._parse_position(player_info)
        # self._parse_birth_date(player_info)
        self._parse_team(player_info)
        # self._parse_team_history(player_info)
        # self._parse_career_av(player_info)
        # self._parse_fantasy_pos_rk(player_info)
        # self._parse_headshot_url(player_info)
        #setattr(self, '_season', list(all_stats.keys()))
        #return all_stats

    def _find_initial_index(self):
        """
        Find the index of the career stats.

        When the Player class is instantiated, the default stats to pull are
        the player's career stats. Upon being called, the index of the 'Career'
        element should be the index value.
        """
        index = 0
        for season in self._season or season == 'Career':
            if season == 'Career':
                self._index = index
                break
            index += 1
