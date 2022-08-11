import { getPlayersList, getKillsList, calculatePlayerScore, gamesDataParser, playersRanking } from "../src/gamesDataParser";
import * as fs from 'fs'
const logPath = 'ts/test/test.log'
const log = fs.readFileSync(logPath, 'utf8')
const gamesRaw: Array<string> = log.split('InitGame')

describe('getPlayerList', () => {
  it('Should return an empty list', () => {
    expect(getPlayersList(gamesRaw[0])).toEqual([])
  })
  it('Should return only one player', () => {
    expect(getPlayersList(gamesRaw[1])).toEqual(['Isgalamido'])
  })
  it('Should return multiple players with spaces in the name)', () => {
    expect(getPlayersList(gamesRaw[3])).toEqual(
      ["Dono da Bola",
        "Mocinha",
        "Isgalamido",
        "Zeh"]
    )
  })
})

describe('getKillsList', () => {
  it('Should return no kills on the list', () => {
    expect(getKillsList(gamesRaw[0])).toEqual({ "killedByWorld": [], "killers": [], "totalKills": 0 })
  })
  it('Should return only Isgalamido on the lists', () => {
    expect(getKillsList(gamesRaw[2])).toEqual(
      {
        "killedByWorld": ["Isgalamido", "Isgalamido", "Isgalamido", "Isgalamido", "Isgalamido", "Isgalamido",
          "Isgalamido", "Isgalamido"], "killers": ["Isgalamido", "Isgalamido", "Isgalamido",], "totalKills": 11,
      })
  })
  it('Should return multiple players with space in the name', () => {
    expect(getKillsList(gamesRaw[5])).toEqual({
      "killedByWorld": ["Assasinu Credi", "Assasinu Credi", "Assasinu Credi", "Zeh", "Assasinu Credi"], "killers": ["Isgalamido", "Isgalamido", "Zeh", "Assasinu Credi", "Assasinu Credi", "Assasinu Credi", "Zeh", "Assasinu Credi", "Assasinu Credi"], "totalKills": 14
    })
  })
})

describe('calculatePlayerScore', () => {
  it('Should calculate without players', () => {
    const playersList: Array<string> = []
    const killsData = { "killedByWorld": [], "killers": [], "totalKills": 0 }
    expect(calculatePlayerScore(killsData, playersList)).toEqual({})
  })
  it('Should calculate with multiple players', () => {
    const playersList = ["Dono da Bola", "Mocinha", "Isgalamido", "Zeh", "Assasinu Credi"]
    const killsData = { "killedByWorld": ["Assasinu Credi", "Assasinu Credi", "Assasinu Credi", "Zeh", "Assasinu Credi"], "killers": ["Isgalamido", "Isgalamido", "Zeh", "Assasinu Credi", "Assasinu Credi", "Assasinu Credi", "Zeh", "Assasinu Credi", "Assasinu Credi"], "totalKills": 14 }
    expect(calculatePlayerScore(killsData, playersList)).toEqual({
      "Assasinu Credi": 1,
      "Dono da Bola": 0,
      "Isgalamido": 2,
      "Mocinha": 0,
      "Zeh": 1,
    })
  })
})

describe('playersRanking', () => {
  it('Should return expected player ranking', () => {
    expect(playersRanking(logPath)).toEqual({ "Assasinu Credi": 14, "Dono da Bola": 12, "Isgalamido": 17, "Mocinha": 0, "Zeh": 19})
  })
})

describe('parser', () => {
  it('Should parse a game raw data', () => {
    expect(gamesDataParser(logPath)).toEqual(
   [{
      "gameCount": 1,
      "kills":  {
        "Isgalamido": 0,
      },
      "players":  [
        "Isgalamido",
      ],
      "totalKills": 0,
    },
     {
      "gameCount": 2,
      "kills":  {
        "Dono da Bola": 0,
      "Isgalamido": -5,
      "Mocinha": 0,
    },
    "players":  [
      "Isgalamido",
      "Dono da Bola",
      "Mocinha",
    ],
    "totalKills": 11,
  },
   {
    "gameCount": 3,
    "kills":  {
      "Dono da Bola": -1,
      "Isgalamido": 1,
      "Mocinha": 0,
      "Zeh": -2,
    },
    "players":  [
      "Dono da Bola",
      "Mocinha",
      "Isgalamido",
      "Zeh",
    ],
    "totalKills": 4,
  },
   {
    "gameCount": 4,
    "kills":  {
      "Assasinu Credi": 13,
      "Dono da Bola": 13,
      "Isgalamido": 19,
      "Zeh": 20,
    },
    "players":  [
      "Dono da Bola",
      "Isgalamido",
      "Zeh",
      "Assasinu Credi",
    ],
    "totalKills": 105,
  },
   {
    "gameCount": 5,
    "kills":  {
      "Assasinu Credi": 1,
      "Dono da Bola": 0,
      "Isgalamido": 2,
      "Zeh": 1,
    },
    "players":  [
      "Dono da Bola",
      "Isgalamido",
      "Zeh",
      "Assasinu Credi",
    ],
    "totalKills": 14,
  },
])
  })
})