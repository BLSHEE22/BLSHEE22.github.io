// all NFL teams and their titles
export const teams = {'DAL': {'name': 'Dallas Cowboys',
                       'logo': 'dal-2025',
                       'division': 'NFC East'},
              'PHI': {'name': 'Philadelphia Eagles',
                      'logo': 'phi-2025',
                      'division': 'NFC East'},
              'KAN': {'name': 'Kansas City Chiefs',
                      'logo': 'kan-2025',
                      'division': 'AFC West'},
              'LAC': {'name': 'Los Angeles Chargers',
                      'logo': 'sdg-2025',
                      'division': 'AFC West'},
              'TAM': {'name': 'Tampa Bay Buccaneers',
                      'logo': 'tam-2025',
                      'division': 'NFC South'},
              'ATL': {'name': 'Atlanta Falcons',
                      'logo': 'atl-2025',
                      'division': 'NFC South'},
              'CIN': {'name': 'Cincinnati Bengals',
                      'logo': 'cin-2025',
                      'division': 'AFC North'},
              'CLE': {'name': 'Cleveland Browns',
                      'logo': 'cle-2025',
                      'division': 'AFC North'},
              'MIA': {'name': 'Miami Dolphins',
                      'logo': 'mia-2025',
                      'division': 'AFC East'},
              'CLT': {'name': 'Indianapolis Colts',
                      'logo': 'clt-2025',
                      'division': 'AFC South'},
              'CAR': {'name': 'Carolina Panthers',
                      'logo': 'car-2025',
                      'division': 'NFC South'},
              'JAX': {'name': 'Jacksonville Jaguars',
                      'logo': 'jax-2025',
                      'division': 'AFC South'},
              'RAI': {'name': 'Las Vegas Raiders',
                      'logo': 'rai-2025',
                      'division': 'AFC West'},
              'NWE': {'name': 'New England Patriots',
                      'logo': 'nwe-2025',
                      'division': 'AFC East'},
              'CRD': {'name': 'Arizona Cardinals',
                      'logo': 'crd-2025',
                      'division': 'NFC West'},
              'NOR': {'name': 'New Orleans Saints',
                      'logo': 'nor-2025',
                      'division': 'NFC South'},
              'PIT': {'name': 'Pittsburgh Steelers',
                      'logo': 'pit-2025',
                      'division': 'AFC North'},
              'NYJ': {'name': 'New York Jets',
                      'logo': 'nyj-2025',
                      'division': 'AFC East'},
              'NYG': {'name': 'New York Giants',
                      'logo': 'nyg-2025',
                      'division': 'NFC East'},
              'WAS': {'name': 'Washington Commanders',
                      'logo': 'was-2025',
                      'division': 'NFC East'},
              'TEN': {'name': 'Tennessee Titans',
                      'logo': 'oti-2025',
                      'division': 'AFC South'},
              'DEN': {'name': 'Denver Broncos',
                      'logo': 'den-2025',
                      'division': 'AFC West'},
              'SFO': {'name': 'San Francisco 49ers',
                      'logo': 'sfo-2025',
                      'division': 'NFC West'},
              'SEA': {'name': 'Seattle Seahawks',
                      'logo': 'sea-2025',
                      'division': 'NFC West'},
              'DET': {'name': 'Detroit Lions',
                      'logo': 'det-2025',
                      'division': 'NFC North'},
              'GNB': {'name': 'Green Bay Packers',
                      'logo': 'gnb-2025',
                      'division': 'NFC North'},
              'HTX': {'name': 'Houston Texans',
                      'logo': 'htx-2025',
                      'division': 'AFC South'},
              'RAM': {'name': 'Los Angeles Rams',
                      'logo': 'ram-2025',
                      'division': 'NFC West'},
              'RAV': {'name': 'Baltimore Ravens',
                      'logo': 'rav-2025',
                      'division': 'AFC North'},
              'BUF': {'name': 'Buffalo Bills',
                      'logo': 'buf-2025',
                      'division': 'AFC East'},
              'MIN': {'name': 'Minnesota Vikings',
                      'logo': 'min-2025',
                      'division': 'NFC North'},
              'CHI': {'name': 'Chicago Bears',
                      'logo': 'chi-2025',
                      'division': 'NFC North'}};

// all matchups from a week slate and the contained player grudges
export const playerGrudges = { // test headshots
    'thursday': [{
        'time': '8:20 PM',
        'awayTeam': 'DAL',
        'homeTeam': 'PHI',
        'awayGrudges': [],
        'homeGrudges': []
    }],
    'friday': [{
        'time': '8:00 PM',
        'awayTeam': 'KAN',
        'homeTeam': 'LAC',
        'awayGrudges': [],
        'homeGrudges': []
    }],
    'sunday': [{
        'time': '1:00 PM',
        'awayTeam': 'TAM',
        'homeTeam': 'ATL',
        'awayGrudges': [],
        'homeGrudges': []
    }, {
        'time': '1:00 PM',
        'awayTeam': 'CIN',
        'homeTeam': 'CLE',
        'awayGrudges': [{
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/BrigGa00_2023.jpg',
            'name': 'Gary Brightwell',
            'position': 'RB',
            'grudgeType': 'Grudge',
            'seasons': '2024',
            'positionRk': '141'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/BryaTa00_2024.jpg',
            'name': 'Taven Bryan',
            'position': 'DT',
            'grudgeType': 'Grudge',
            'seasons': '2022',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/ThomIs01_2022.jpg',
            'name': 'Isaiah Thomas',
            'position': 'DE',
            'grudgeType': 'Primary Grudge',
            'seasons': '2022',
            'positionRk': 'N/A'
        }],
        'homeGrudges': [{
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/BrowTo01_2024.jpg',
            'name': 'Tony Brown',
            'position': 'CB',
            'grudgeType': 'Grudge',
            'seasons': '2020',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': None,
            'name': 'K.J. Henry',
            'position': 'DE',
            'grudgeType': 'Grudge',
            'seasons': '2024',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/WillTr06_2024.jpg',
            'name': 'Trayveon Williams',
            'position': 'RB',
            'grudgeType': 'Primary Grudge',
            'seasons': '2019, 2020, 2021, 2022, 2023, 2024',
            'positionRk': '155'
        }]
    }, {
        'time': '1:00 PM',
        'awayTeam': 'MIA',
        'homeTeam': 'CLT',
        'awayGrudges': [],
        'homeGrudges': []
    }, {
        'time': '1:00 PM',
        'awayTeam': 'CAR',
        'homeTeam': 'JAX',
        'awayGrudges': [],
        'homeGrudges': []
    }, {
        'time': '1:00 PM',
        'awayTeam': 'RAI',
        'homeTeam': 'NWE',
        'awayGrudges': [],
        'homeGrudges': []
    }, {
        'time': '1:00 PM',
        'awayTeam': 'CRD',
        'homeTeam': 'NOR',
        'awayGrudges': [],
        'homeGrudges': []
    }, {
        'time': '1:00 PM',
        'awayTeam': 'PIT',
        'homeTeam': 'NYJ',
        'awayGrudges': [],
        'homeGrudges': []
    }, {
        'time': '1:00 PM',
        'awayTeam': 'NYG',
        'homeTeam': 'WAS',
        'awayGrudges': [],
        'homeGrudges': []
    }, {
        'time': '4:05 PM',
        'awayTeam': 'TEN',
        'homeTeam': 'DEN',
        'awayGrudges': [],
        'homeGrudges': []
    }, {
        'time': '4:05 PM',
        'awayTeam': 'SFO',
        'homeTeam': 'SEA',
        'awayGrudges': [],
        'homeGrudges': []
    }, {
        'time': '4:25 PM',
        'awayTeam': 'DET',
        'homeTeam': 'GNB',
        'awayGrudges': [],
        'homeGrudges': []
    }, {
        'time': '4:25 PM',
        'awayTeam': 'HTX',
        'homeTeam': 'RAM',
        'awayGrudges': [],
        'homeGrudges': []
    }, {
        'time': '8:20 PM',
        'awayTeam': 'RAV',
        'homeTeam': 'BUF',
        'awayGrudges': [],
        'homeGrudges': []
    }],
    'monday': [{
        'time': '8:15 PM',
        'awayTeam': 'MIN',
        'homeTeam': 'CHI',
        'awayGrudges': [],
        'homeGrudges': []
    }]
};
