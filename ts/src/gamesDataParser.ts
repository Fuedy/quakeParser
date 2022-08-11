import * as fs from 'fs'
import { GroupedGameData, KillsData } from './parser.types'

export function getPlayersList(gameData: string) {
    const playersList: Set<string> = new Set()
    const playersInfo = gameData.match(/ClientUserinfoChanged: \d n\\([a-zA-Z\s]*)/gm)
    
    playersInfo?.forEach(clientUser => {
        playersList.add(clientUser.match(/\\(.)+$/m)[0].slice(1))
    })
    return [...playersList]
}

export function getKillsList(gameData: string) {
    const killsList = gameData.match(/.Kill./gm)
    const killedByWorld = []
    const killers = []
    let totalKills = 0

    totalKills = killsList?.length || 0
    const kills = (gameData.match(/\d: (.)+killed (.)+ by/gm))
    kills?.forEach(kill => {
        const killer = (kill.slice(3, (kill.indexOf('killed') - 1)))
        const killed = (kill.slice(kill.indexOf('killed') + 7, -3))
        if (killer == '<world>') {
            killedByWorld.push(killed)
        }
        else {
            killers.push(killer)
        }
    })
    return {
        totalKills,
        killedByWorld,
        killers
    }
}

export function calculatePlayerScore(killsData: KillsData, playersList: Array<string>) {
    const countKiller: Record<string, number> = {}
    const countKilledByWorld: Record<string, number> = {}

    killsData.killedByWorld.forEach((killedName: string) => {
        countKilledByWorld[killedName] = (countKilledByWorld[killedName] || 0) + 1
    })
    killsData.killers.forEach((killerName: string) => {
        countKiller[killerName] = (countKiller[killerName] || 0) + 1
    })

    playersList.forEach((player: string) => {
        if (countKiller[player]) {
            countKiller[player] -= countKilledByWorld[player] || 0
        }
        else {
            countKiller[player] = 0
            countKiller[player] = - countKilledByWorld[player] || 0
        }
    })
    return countKiller
}

export function gamesDataParser(logPath: string): Array<GroupedGameData> {
    const log = fs.readFileSync(logPath, 'utf8')
    const gamesRaw: Array<string> = log.split('InitGame')
    const gamesData: Array<GroupedGameData> = []

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

export function playersRanking(logPath: string): Record<string, number> {
    const log = fs.readFileSync(logPath, 'utf8')
    const gamesRaw: Array<string> = log.split('InitGame')
    const playersRanking: Record<string, number> = {}

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