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
export const playerGrudges = { // week 1
    'thursday': [{
        'time': '8:20 PM',
        'awayTeam': 'DAL',
        'homeTeam': 'PHI',
        'awayGrudges': [{
            'urlName': 'SandMi01_2025',
            'name': 'Miles Sanders',
            'position': 'RB',
            'grudgeType': 'Primary Grudge',
            'seasons': '2019, 2020, 2021, 2022',
            'positionRk': '59'
        }],
        'homeGrudges': []
    }],
    'friday': [{
        'time': '8:00 PM',
        'awayTeam': 'KAN',
        'homeTeam': 'LAC',
        'awayGrudges': [{
            'urlName': 'ChriCo00_2025',
            'name': 'Cole Christiansen',
            'position': 'LB',
            'grudgeType': 'Primary Grudge',
            'seasons': '2020, 2021',
            'positionRk': 'N/A'
        }, {
            'urlName': 'FultKr00_2025',
            'name': 'Kristian Fulton',
            'position': 'CB',
            'grudgeType': 'Grudge',
            'seasons': '2024',
            'positionRk': 'N/A'
        }, {
            'urlName': 'TillJe00_2025',
            'name': 'Jerry Tillery',
            'position': 'DL',
            'grudgeType': 'Primary Grudge',
            'seasons': '2019, 2020, 2021, 2022',
            'positionRk': 'N/A'
        }, {
            'urlName': 'TranDr00_2025',
            'name': 'Drue Tranquill',
            'position': 'OLB',
            'grudgeType': 'Primary Grudge',
            'seasons': '2019, 2020, 2021, 2022',
            'positionRk': 'N/A'
        }],
        'homeGrudges': []
    }],
    'sunday': [{
        'time': '1:00 PM',
        'awayTeam': 'TAM',
        'homeTeam': 'ATL',
        'awayGrudges': [],
        'homeGrudges': [{
            'urlName': 'PiniBr00_2025',
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
            'urlName': 'BrigGa00_2025',
            'name': 'Gary Brightwell',
            'position': 'RB',
            'grudgeType': 'Grudge',
            'seasons': '2024',
            'positionRk': '141'
        }, {
            'urlName': 'BryaTa00_2025',
            'name': 'Taven Bryan',
            'position': 'DT',
            'grudgeType': 'Grudge',
            'seasons': '2022',
            'positionRk': 'N/A'
        }, {
            'urlName': 'ThomIs01_2025',
            'name': 'Isaiah Thomas',
            'position': 'DE',
            'grudgeType': 'Primary Grudge',
            'seasons': '2022',
            'positionRk': 'N/A'
        }],
        'homeGrudges': [{
            'urlName': 'BrowTo01_2025',
            'name': 'Tony Brown',
            'position': 'CB',
            'grudgeType': 'Grudge',
            'seasons': '2020',
            'positionRk': 'N/A'
        }, {
            'urlName': 'HenrKJ00_2025',
            'name': 'K.J. Henry',
            'position': 'DE',
            'grudgeType': 'Grudge',
            'seasons': '2024',
            'positionRk': 'N/A'
        }, {
            'urlName': 'WillTr06_2025',
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
            'urlName': 'LammCh00_2025',
            'name': 'Chris Lammons',
            'position': 'DB',
            'grudgeType': 'Primary Grudge',
            'seasons': '2019',
            'positionRk': 'N/A'
        }, {
            'urlName': 'AhmeSa01_2025',
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
            'urlName': 'WrigMa00_2025',
            'name': 'Matthew Wright',
            'position': 'K',
            'grudgeType': 'Grudge',
            'seasons': '2021',
            'positionRk': 'N/A'
        }],
        'homeGrudges': [{
            'urlName': 'LeexRi00_2025',
            'name': 'Ricky Lee',
            'position': 'T',
            'grudgeType': 'Primary Grudge',
            'seasons': '2023',
            'positionRk': 'N/A'
        }]
    }, {
        'time': '1:00 PM',
        'awayTeam': 'RAI',
        'homeTeam': 'NWE',
        'awayGrudges': [{
            'urlName': 'ButlAd00_2025',
            'name': 'Adam Butler',
            'position': 'DT',
            'grudgeType': 'Primary Grudge',
            'seasons': '2017, 2018, 2019, 2020',
            'positionRk': 'N/A'
        }, {
            'urlName': 'DorsPh00_2025',
            'name': 'Phillip Dorsett',
            'position': 'WR',
            'grudgeType': 'Grudge',
            'seasons': '2017, 2018, 2019',
            'positionRk': '216'
        }, {
            'urlName': 'MafiAt00_2025',
            'name': 'Atonio Mafi',
            'position': 'OL',
            'grudgeType': 'Primary Grudge',
            'seasons': '2023',
            'positionRk': 'N/A'
        }, {
            'urlName': 'MeyeJa01_2025',
            'name': 'Jakobi Meyers',
            'position': 'WR',
            'grudgeType': 'Primary Grudge',
            'seasons': '2019, 2020, 2021, 2022',
            'positionRk': '29'
        }, {
            'urlName': 'RobeEl00_2025',
            'name': 'Elandon Roberts',
            'position': 'ILB',
            'grudgeType': 'Primary Grudge',
            'seasons': '2016, 2017, 2018, 2019',
            'positionRk': 'N/A'
        }],
        'homeGrudges': [{
            'urlName': 'ChaiKL00_2025',
            'name': "K'Lavon Chaisson",
            'position': 'OLB',
            'grudgeType': 'Grudge',
            'seasons': '2024',
            'positionRk': 'N/A'
        }, {
            'urlName': 'EppsMa00_2025',
            'name': 'Marcus Epps',
            'position': 'S',
            'grudgeType': 'Grudge',
            'seasons': '2023, 2024',
            'positionRk': 'N/A'
        }, {
            'urlName': 'FothCo00_2025',
            'name': 'Cole Fotheringham',
            'position': 'Unknown',
            'grudgeType': 'Primary Grudge',
            'seasons': '2023',
            'positionRk': '108'
        }, {
            'urlName': 'HollMa00_2025',
            'name': 'Mack Hollins',
            'position': 'WR',
            'grudgeType': 'Grudge',
            'seasons': '2022',
            'positionRk': '76'
        }, {
            'urlName': 'HoopAu00_2025',
            'name': 'Austin Hooper',
            'position': 'TE',
            'grudgeType': 'Grudge',
            'seasons': '2023',
            'positionRk': '24'
        }, {
            'urlName': 'PekoKy00_2025',
            'name': 'Kyle Peko',
            'position': 'DT',
            'grudgeType': 'Grudge',
            'seasons': '2022',
            'positionRk': 'N/A'
        }, {
            'urlName': 'SpilRo00_2025',
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
            'urlName': 'GillBl00_2025',
            'name': 'Blake Gillikin',
            'position': 'P',
            'grudgeType': 'Primary Grudge',
            'seasons': '2021, 2022',
            'positionRk': 'N/A'
        }, {
            'urlName': 'MustPJ00_2025',
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
            'urlName': 'ClarCh00_2025',
            'name': 'Chuck Clark',
            'position': 'FS',
            'grudgeType': 'Grudge',
            'seasons': '2024',
            'positionRk': 'N/A'
        }, {
            'urlName': 'EchoBr00_2025',
            'name': 'Brandin Echols',
            'position': 'CB',
            'grudgeType': 'Primary Grudge',
            'seasons': '2021, 2022, 2023, 2024',
            'positionRk': 'N/A'
        }, {
            'urlName': 'RodgAa00_2025',
            'name': 'Aaron Rodgers',
            'position': 'QB',
            'grudgeType': 'Grudge',
            'seasons': '2023, 2024',
            'positionRk': '15'
        }],
        'homeGrudges': [{
            'urlName': 'FielJu00_2025',
            'name': 'Justin Fields',
            'position': 'QB',
            'grudgeType': 'Grudge',
            'seasons': '2024',
            'positionRk': '31'
        }, {
            'urlName': 'OkorCh00_2025',
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
            'urlName': 'CageLa01_2025',
            'name': 'Lawrence Cager',
            'position': 'WR',
            'grudgeType': 'Grudge',
            'seasons': '2022, 2023',
            'positionRk': '77'
        }, {
            'urlName': 'HamiAn01_2025',
            'name': 'Antonio Hamilton',
            'position': 'CB',
            'grudgeType': 'Grudge',
            'seasons': '2018, 2019',
            'positionRk': 'N/A'
        }, {
            'urlName': 'HartBo00_2025',
            'name': 'Bobby Hart',
            'position': 'G',
            'grudgeType': 'Primary Grudge',
            'seasons': '2015, 2016, 2017',
            'positionRk': 'N/A'
        }, {
            'urlName': 'OttxTy00_2025',
            'name': 'Tyler Ott',
            'position': 'LS',
            'grudgeType': 'Primary Grudge',
            'seasons': '2015',
            'positionRk': 'N/A'
        }, {
            'urlName': 'PhilTy00_2025',
            'name': 'Tyre Phillips',
            'position': 'OL',
            'grudgeType': 'Grudge',
            'seasons': '2022, 2023, 2024',
            'positionRk': 'N/A'
        }, {
            'urlName': 'JackTy01_2025',
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
            'urlName': 'AlleBr00_2025',
            'name': 'Brandon Allen',
            'position': 'QB',
            'grudgeType': 'Primary Grudge',
            'seasons': '2019',
            'positionRk': '64'
        }, {
            'urlName': 'BartCo00_2025',
            'name': 'Cody Barton',
            'position': 'OLB',
            'grudgeType': 'Grudge',
            'seasons': '2024',
            'positionRk': 'N/A'
        }, {
            'urlName': 'CushLl00_2025',
            'name': 'Lloyd Cushenberry III',
            'position': 'OL',
            'grudgeType': 'Primary Grudge',
            'seasons': '2020, 2021, 2022, 2023',
            'positionRk': 'N/A'
        }, {
            'urlName': 'JoneDr00_2025',
            'name': "Dre'Mont Jones",
            'position': 'DL',
            'grudgeType': 'Primary Grudge',
            'seasons': '2019, 2020, 2021, 2022',
            'positionRk': 'N/A'
        }, {
            'urlName': 'SiemTr00_2025',
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
            'urlName': 'BrowTr03_2025',
            'name': 'Tre Brown',
            'position': 'DB',
            'grudgeType': 'Primary Grudge',
            'seasons': '2021, 2022, 2023, 2024',
            'positionRk': 'N/A'
        }, {
            'urlName': 'GipsTr00_2025',
            'name': 'Trevis Gipson',
            'position': 'DL',
            'grudgeType': 'Grudge',
            'seasons': '2024',
            'positionRk': 'N/A'
        }, {
            'urlName': 'TurnMa00_2025',
            'name': 'Malik Turner',
            'position': 'WR',
            'grudgeType': 'Primary Grudge',
            'seasons': '2018, 2019',
            'positionRk': '242'
        }],
        'homeGrudges': [{
            'urlName': 'DarnSa00_2025',
            'name': 'Sam Darnold',
            'position': 'QB',
            'grudgeType': 'Grudge',
            'seasons': '2023',
            'positionRk': '9'
        }, {
            'urlName': 'JeanSh00_2025',
            'name': 'Shemar Jean-Charles',
            'position': 'CB',
            'grudgeType': 'Grudge',
            'seasons': '2023',
            'positionRk': 'N/A'
        }, {
            'urlName': 'SaubEr00_2025',
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
            'urlName': 'TaylMa01_2025',
            'name': 'Malik Taylor',
            'position': 'WR',
            'grudgeType': 'Primary Grudge',
            'seasons': '2020, 2021',
            'positionRk': '196'
        }],
        'homeGrudges': [{
            'urlName': 'BallCo00_2025',
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
            'urlName': 'ThomZa04_2025',
            'name': 'Zachary Thomas',
            'position': 'OL',
            'grudgeType': 'Primary Grudge',
            'seasons': '2022, 2023',
            'positionRk': 'N/A'
        }, {
            'urlName': 'YeasRu00_2025',
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
    'monday': [{
        'time': '8:15 PM',
        'awayTeam': 'MIN',
        'homeTeam': 'CHI',
        'awayGrudges': [{
            'urlName': 'DePaAn00_2025',
            'name': 'Andrew DePaola',
            'position': 'LS',
            'grudgeType': 'Grudge',
            'seasons': '2017',
            'positionRk': 'N/A'
        }, {
            'urlName': 'HarrJo05_2025',
            'name': 'Jonathan Harris',
            'position': 'DE',
            'grudgeType': 'Grudge',
            'seasons': '2019',
            'positionRk': 'N/A'
        }, {
            'urlName': 'StewRe00_2025',
            'name': 'Reddy Steward',
            'position': 'CB',
            'grudgeType': 'Primary Grudge',
            'seasons': '2024',
            'positionRk': 'N/A'
        }],
        'homeGrudges': [{
            'urlName': 'KeenCa00_2025',
            'name': 'Case Keenum',
            'position': 'QB',
            'grudgeType': 'Grudge',
            'seasons': '2017',
            'positionRk': '64'
        }, {
            'urlName': 'WrigNa00_2025',
            'name': 'Nahshon Wright',
            'position': 'CB',
            'grudgeType': 'Grudge',
            'seasons': '2024',
            'positionRk': 'N/A'
        }]
    }]
};
