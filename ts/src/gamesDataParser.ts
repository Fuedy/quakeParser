import * as fs from 'fs'
import { GroupedGameData, KillsData } from './parser.types'

//ClientUserInfoChanged is logged everytime a player enters the game or change teams.
//Using Set to assure each player is unique. Return as array to make it easy to manipulate later.
export function getPlayersList(gameData: string) {
    const playersList: Set<string> = new Set()
    const playersInfo = gameData.match(/ClientUserinfoChanged: \d n\\([a-zA-Z\s]*)/gm)
    
    playersInfo?.forEach(clientUser => {
        playersList.add(clientUser.match(/\\(.)+$/m)[0].slice(1))
    })
    return [...playersList]
}

//Kill is logged everytime a kills happens. It also contain the killer and killed name between the 'killed' word
//Killed by world important to calculate score late
//Should not log if player kill themself because will not count as score
export function getKillsList(gameData: string) {
    const killsList = gameData.match(/.Kill./gm)
    const killedByWorld = []
    const killers = []
    let totalKills = 0

    totalKills = killsList?.length || 0
    const kills = (gameData.match(/\d: (.)+killed (.)+ by/gm))
    kills?.forEach(kill => {
        //Index needed to find the names before and after 'killed'
        const killer = (kill.slice(3, (kill.indexOf('killed') - 1)))
        const killed = (kill.slice(kill.indexOf('killed') + 7, -3))

        if (killer == '<world>') {
            killedByWorld.push(killed)
        }
        else if (killer != killed) {
            killers.push(killer)
        }
    })
    return {
        totalKills,
        killedByWorld,
        killers
    }
}

//Calculate player score based on kills. World death count as -1 score
export function calculatePlayerScore(killsData: KillsData, playersList: Array<string>) {
    const playerScore: Record<string, number> = {}
    const countKilledByWorld: Record<string, number> = {}

    killsData.killedByWorld.forEach((killedName: string) => {
        countKilledByWorld[killedName] = (countKilledByWorld[killedName] || 0) + 1
    })
    killsData.killers.forEach((killerName: string) => {
        playerScore[killerName] = (playerScore[killerName] || 0) + 1
    })

    playersList.forEach((player: string) => {
        if (playerScore[player]) {
            playerScore[player] -= countKilledByWorld[player] || 0
        }
        else {
            playerScore[player] = 0
            playerScore[player] = - countKilledByWorld[player] || 0
        }
    })
    return playerScore
}

//Parser recieve the logpath and returns a array with all grouped match data
export function gamesDataParser(logPath: string): Array<GroupedGameData> {
    const log = fs.readFileSync(logPath, 'utf8')
    const gamesRaw: Array<string> = log.split('InitGame')
    const gamesData: Array<GroupedGameData> = []

    //Cut the first element because it's only the server startup
    gamesRaw.slice(1).forEach((game, index) => {

        const playersList = getPlayersList(game)
        const killsList = getKillsList(game)
        const playerScore = calculatePlayerScore(killsList, playersList)

        gamesData.push({
            gameCount: index + 1,
            totalKills: killsList.totalKills,
            players: [...playersList],
            kills: playerScore
        })
    })
    return gamesData
}

//Recieve a logpath and return a Record with all players and their scores counting all games
export function playersRanking(logPath: string): Record<string, number> {
    const log = fs.readFileSync(logPath, 'utf8')
    const gamesRaw: Array<string> = log.split('InitGame')
    const playersRanking: Record<string, number> = {}

    //Cut the first element because it's only the server startup
    gamesRaw.slice(1).forEach(game => {
        const playersList = getPlayersList(game)
        const killsList = getKillsList(game)
        const playerScore = calculatePlayerScore(killsList, playersList)

        for (const playerName in playerScore) {
            playersRanking[playerName] = (playersRanking[playerName] || 0) + playerScore[playerName]
        }
    })
    return playersRanking
}