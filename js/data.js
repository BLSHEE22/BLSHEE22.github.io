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
              'NE': {'name': 'New England Patriots',
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

// all weeks and matchup date/times from each
export const weekLengthInfo = [{'number': 0,
                                'start': '2025-08-01',
                                'end': '2025-08-30'},
                               {'number': 1,
                                'start': '2025-08-31',
                                'end': '2025-09-08'}, 
                               {'number': 2,
                                'start': '2025-09-09',
                                'end': '2025-09-15'}, 
                               {'number': 3,
                                'start': '2025-09-16',
                                'end': '2025-09-22'}];

// all matchups from a week slate and the contained player grudges
export const playerGrudges = { // week 1
    'Thursday, September 4th': [{
        'time': '8:20 PM',
        'awayTeam': 'DAL',
        'homeTeam': 'PHI',
        'awayGrudges': [{
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/SandMi01_2023.jpg',
            'name': 'Miles Sanders',
            'position': 'RB',
            'grudgeType': 'Primary Grudge',
            'seasons': '2019, 2020, 2021, 2022',
            'positionRk': '59'
        }],
        'homeGrudges': []
    }],
    'Friday, September 5th': [{
        'time': '8:00 PM',
        'awayTeam': 'KAN',
        'homeTeam': 'LAC',
        'awayGrudges': [{
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/ChriCo00_2024.jpg',
            'name': 'Cole Christiansen',
            'position': 'LB',
            'grudgeType': 'Primary Grudge',
            'seasons': '2020, 2021',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/FultKr00_2024.jpg',
            'name': 'Kristian Fulton',
            'position': 'CB',
            'grudgeType': 'Grudge',
            'seasons': '2024',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/TillJe00_2024.jpg',
            'name': 'Jerry Tillery',
            'position': 'DL',
            'grudgeType': 'Primary Grudge',
            'seasons': '2019, 2020, 2021, 2022',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/TranDr00_2024.jpg',
            'name': 'Drue Tranquill',
            'position': 'OLB',
            'grudgeType': 'Primary Grudge',
            'seasons': '2019, 2020, 2021, 2022',
            'positionRk': 'N/A'
        }],
        'homeGrudges': []
    }],
    'Sunday, September 7th': [{
        'time': '1:00 PM',
        'awayTeam': 'TAM',
        'homeTeam': 'ATL',
        'awayGrudges': [],
        'homeGrudges': [{
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/PiniBr00_2024.jpg',
            'name': 'Bradley Pinion',
            'position': 'P',
            'grudgeType': 'Grudge',
            'seasons': '2019, 2020, 2021',
            'positionRk': 'N/A'
        }]
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
            'headshotUrl': 'None',
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
        'homeGrudges': [{
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/LammCh00_2024.jpg',
            'name': 'Chris Lammons',
            'position': 'DB',
            'grudgeType': 'Primary Grudge',
            'seasons': '2019',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/AhmeSa01_2023.jpg',
            'name': 'Salvon Ahmed',
            'position': 'RB',
            'grudgeType': 'Primary Grudge',
            'seasons': '2020, 2021, 2022, 2023',
            'positionRk': '76'
        }]
    }, {
        'time': '1:00 PM',
        'awayTeam': 'CAR',
        'homeTeam': 'JAX',
        'awayGrudges': [{
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/WrigMa00_2024.jpg',
            'name': 'Matthew Wright',
            'position': 'K',
            'grudgeType': 'Grudge',
            'seasons': '2021',
            'positionRk': 'N/A'
        }],
        'homeGrudges': [{
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/LeexRi00_2024.jpg',
            'name': 'Ricky Lee',
            'position': 'T',
            'grudgeType': 'Primary Grudge',
            'seasons': '2023',
            'positionRk': 'N/A'
        }]
    }, {
        'time': '1:00 PM',
        'awayTeam': 'RAI',
        'homeTeam': 'NE',
        'awayGrudges': [{
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/ButlAd00_2023.jpg',
            'name': 'Adam Butler',
            'position': 'DT',
            'grudgeType': 'Primary Grudge',
            'seasons': '2017, 2018, 2019, 2020',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/DorsPh00_2023.jpg',
            'name': 'Phillip Dorsett',
            'position': 'WR',
            'grudgeType': 'Grudge',
            'seasons': '2017, 2018, 2019',
            'positionRk': '216'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/MafiAt00_2024.jpg',
            'name': 'Atonio Mafi',
            'position': 'OL',
            'grudgeType': 'Primary Grudge',
            'seasons': '2023',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/MeyeJa01_2023.jpg',
            'name': 'Jakobi Meyers',
            'position': 'WR',
            'grudgeType': 'Primary Grudge',
            'seasons': '2019, 2020, 2021, 2022',
            'positionRk': '29'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/RobeEl00_2024.jpg',
            'name': 'Elandon Roberts',
            'position': 'ILB',
            'grudgeType': 'Primary Grudge',
            'seasons': '2016, 2017, 2018, 2019',
            'positionRk': 'N/A'
        }],
        'homeGrudges': [{
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/ChaiKL00_2024.jpg',
            'name': "K'Lavon Chaisson",
            'position': 'OLB',
            'grudgeType': 'Grudge',
            'seasons': '2024',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/EppsMa00_2023.jpg',
            'name': 'Marcus Epps',
            'position': 'S',
            'grudgeType': 'Grudge',
            'seasons': '2023, 2024',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/FothCo00_2023.jpg',
            'name': 'Cole Fotheringham',
            'position': 'Unknown',
            'grudgeType': 'Primary Grudge',
            'seasons': '2023',
            'positionRk': '108'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/HollMa00_2023.jpg',
            'name': 'Mack Hollins',
            'position': 'WR',
            'grudgeType': 'Grudge',
            'seasons': '2022',
            'positionRk': '76'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/HoopAu00_2024.jpg',
            'name': 'Austin Hooper',
            'position': 'TE',
            'grudgeType': 'Grudge',
            'seasons': '2023',
            'positionRk': '24'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/PekoKy00_2024.jpg',
            'name': 'Kyle Peko',
            'position': 'DT',
            'grudgeType': 'Grudge',
            'seasons': '2022',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/SpilRo00_2023.jpg',
            'name': 'Robert Spillane',
            'position': 'OLB',
            'grudgeType': 'Grudge',
            'seasons': '2023, 2024',
            'positionRk': 'N/A'
        }]
    }, {
        'time': '1:00 PM',
        'awayTeam': 'CRD',
        'homeTeam': 'NOR',
        'awayGrudges': [{
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/GillBl00_2024.jpg',
            'name': 'Blake Gillikin',
            'position': 'P',
            'grudgeType': 'Primary Grudge',
            'seasons': '2021, 2022',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'None',
            'name': 'PJ Mustipher',
            'position': 'Unknown',
            'grudgeType': 'Primary Grudge',
            'seasons': '2023',
            'positionRk': 'N/A'
        }],
        'homeGrudges': []
    }, {
        'time': '1:00 PM',
        'awayTeam': 'PIT',
        'homeTeam': 'NYJ',
        'awayGrudges': [{
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/ClarCh00_2022.jpg',
            'name': 'Chuck Clark',
            'position': 'FS',
            'grudgeType': 'Grudge',
            'seasons': '2024',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/EchoBr00_2023.jpg',
            'name': 'Brandin Echols',
            'position': 'CB',
            'grudgeType': 'Primary Grudge',
            'seasons': '2021, 2022, 2023, 2024',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/RodgAa00_2023.jpg',
            'name': 'Aaron Rodgers',
            'position': 'QB',
            'grudgeType': 'Grudge',
            'seasons': '2023, 2024',
            'positionRk': '15'
        }],
        'homeGrudges': [{
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/FielJu00_2024.jpg',
            'name': 'Justin Fields',
            'position': 'QB',
            'grudgeType': 'Grudge',
            'seasons': '2024',
            'positionRk': '31'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/OkorCh00_2024.jpg',
            'name': 'Chukwuma Okorafor',
            'position': 'T',
            'grudgeType': 'Primary Grudge',
            'seasons': '2018, 2019, 2020, 2021, 2022, 2023',
            'positionRk': 'N/A'
        }]
    }, {
        'time': '1:00 PM',
        'awayTeam': 'NYG',
        'homeTeam': 'WAS',
        'awayGrudges': [],
        'homeGrudges': [{
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/CageLa01_2024.jpg',
            'name': 'Lawrence Cager',
            'position': 'WR',
            'grudgeType': 'Grudge',
            'seasons': '2022, 2023',
            'positionRk': '77'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/HamiAn01_2024.jpg',
            'name': 'Antonio Hamilton',
            'position': 'CB',
            'grudgeType': 'Grudge',
            'seasons': '2018, 2019',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/HartBo00_2022.jpg',
            'name': 'Bobby Hart',
            'position': 'G',
            'grudgeType': 'Primary Grudge',
            'seasons': '2015, 2016, 2017',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/OttxTy00_2024.jpg',
            'name': 'Tyler Ott',
            'position': 'LS',
            'grudgeType': 'Primary Grudge',
            'seasons': '2015',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/PhilTy00_2023.jpg',
            'name': 'Tyre Phillips',
            'position': 'OL',
            'grudgeType': 'Grudge',
            'seasons': '2022, 2023, 2024',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/JackTy01_2024.jpg',
            'name': 'Tyree Jackson',
            'position': 'TE',
            'grudgeType': 'Grudge',
            'seasons': '2023',
            'positionRk': '122'
        }]
    }, {
        'time': '4:05 PM',
        'awayTeam': 'TEN',
        'homeTeam': 'DEN',
        'awayGrudges': [{
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/AlleBr00_2024.jpg',
            'name': 'Brandon Allen',
            'position': 'QB',
            'grudgeType': 'Primary Grudge',
            'seasons': '2019',
            'positionRk': '64'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/BartCo00_2023.jpg',
            'name': 'Cody Barton',
            'position': 'OLB',
            'grudgeType': 'Grudge',
            'seasons': '2024',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/CushLl00_2024.jpg',
            'name': 'Lloyd Cushenberry III',
            'position': 'OL',
            'grudgeType': 'Primary Grudge',
            'seasons': '2020, 2021, 2022, 2023',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/JoneDr00_2023.jpg',
            'name': "Dre'Mont Jones",
            'position': 'DL',
            'grudgeType': 'Primary Grudge',
            'seasons': '2019, 2020, 2021, 2022',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/SiemTr00_2023.jpg',
            'name': 'Trevor Siemian',
            'position': 'QB',
            'grudgeType': 'Primary Grudge',
            'seasons': '2015, 2016, 2017',
            'positionRk': '49'
        }],
        'homeGrudges': []
    }, {
        'time': '4:05 PM',
        'awayTeam': 'SFO',
        'homeTeam': 'SEA',
        'awayGrudges': [{
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/BrowTr03_2024.jpg',
            'name': 'Tre Brown',
            'position': 'DB',
            'grudgeType': 'Primary Grudge',
            'seasons': '2021, 2022, 2023, 2024',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/GipsTr00_2024.jpg',
            'name': 'Trevis Gipson',
            'position': 'DL',
            'grudgeType': 'Grudge',
            'seasons': '2024',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/TurnMa00_2024.jpg',
            'name': 'Malik Turner',
            'position': 'WR',
            'grudgeType': 'Primary Grudge',
            'seasons': '2018, 2019',
            'positionRk': '242'
        }],
        'homeGrudges': [{
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/DarnSa00_2024.jpg',
            'name': 'Sam Darnold',
            'position': 'QB',
            'grudgeType': 'Grudge',
            'seasons': '2023',
            'positionRk': '9'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/JeanSh00_2024.jpg',
            'name': 'Shemar Jean-Charles',
            'position': 'CB',
            'grudgeType': 'Grudge',
            'seasons': '2023',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/SaubEr00_2024.jpg',
            'name': 'Eric Saubert',
            'position': 'TE',
            'grudgeType': 'Grudge',
            'seasons': '2023, 2024',
            'positionRk': '63'
        }]
    }, {
        'time': '4:25 PM',
        'awayTeam': 'DET',
        'homeTeam': 'GNB',
        'awayGrudges': [{
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/TaylMa01_2024.jpg',
            'name': 'Malik Taylor',
            'position': 'WR',
            'grudgeType': 'Primary Grudge',
            'seasons': '2020, 2021',
            'positionRk': '196'
        }],
        'homeGrudges': [{
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/BallCo00_2024.jpg',
            'name': 'Corey Ballentine',
            'position': 'CB',
            'grudgeType': 'Grudge',
            'seasons': '2020, 2021',
            'positionRk': 'N/A'
        }]
    }, {
        'time': '4:25 PM',
        'awayTeam': 'HTX',
        'homeTeam': 'RAM',
        'awayGrudges': [{
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/ThomZa04_2024.jpg',
            'name': 'Zachary Thomas',
            'position': 'OL',
            'grudgeType': 'Primary Grudge',
            'seasons': '2022, 2023',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/YeasRu00_2024.jpg',
            'name': 'Russ Yeast',
            'position': 'DB',
            'grudgeType': 'Primary Grudge',
            'seasons': '2022, 2023, 2024',
            'positionRk': 'N/A'
        }],
        'homeGrudges': []
    }, {
        'time': '8:20 PM',
        'awayTeam': 'RAV',
        'homeTeam': 'BUF',
        'awayGrudges': [],
        'homeGrudges': []
    }],
    'Monday, September 8th': [{
        'time': '8:15 PM',
        'awayTeam': 'MIN',
        'homeTeam': 'CHI',
        'awayGrudges': [{
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/DePaAn00_2024.jpg',
            'name': 'Andrew DePaola',
            'position': 'LS',
            'grudgeType': 'Grudge',
            'seasons': '2017',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/HarrJo05_2024.jpg',
            'name': 'Jonathan Harris',
            'position': 'DE',
            'grudgeType': 'Grudge',
            'seasons': '2019',
            'positionRk': 'N/A'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/StewRe00_2025.jpg',
            'name': 'Reddy Steward',
            'position': 'CB',
            'grudgeType': 'Primary Grudge',
            'seasons': '2024',
            'positionRk': 'N/A'
        }],
        'homeGrudges': [{
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/KeenCa00_2024.jpg',
            'name': 'Case Keenum',
            'position': 'QB',
            'grudgeType': 'Grudge',
            'seasons': '2017',
            'positionRk': '64'
        }, {
            'headshotUrl': 'https://www.pro-football-reference.com/req/20230307/images/headshots/WrigNa00_2024.jpg',
            'name': 'Nahshon Wright',
            'position': 'CB',
            'grudgeType': 'Grudge',
            'seasons': '2024',
            'positionRk': 'N/A'
        }]
    }]
};
