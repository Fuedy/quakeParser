import * as fs from 'fs'
import { GameRawData, KillsData } from './parser.types'

export function getPlayersList(gameData: string) {
    const playersList: Set<string> = new Set()
    gameData.match(/ClientUserinfoChanged: \d n\\([a-zA-Z\s]*)/gm).forEach(clientUser => {
        playersList.add(clientUser.match(/\\(.)+$/m)[0].slice(1))
    })
    return playersList
}

export function getKillsList(gameData: string) {
    const killsList = gameData.match(/.Kill./gm)
    const killedByWorld = []
    const killers = []
    let totalKills = 0

    if (killsList) {
        totalKills = killsList.length
        const kills = (gameData.match(/\d: (.)+killed (.)+ by/gm))
        kills.forEach(kill => {
            const killer = (kill.slice(3, (kill.indexOf('killed') - 1)))
            const killed = (kill.slice(kill.indexOf('killed') + 7, -3))
            if (killer == '<world>') {
                killedByWorld.push(killed)
            }
            else {
                killers.push(killer)
            }
        })
    }
    return {
        totalKills,
        killedByWorld,
        killers
    }
}

export function calculatePlayerScore(killsData: KillsData, playersList: Set<string>) {
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

export function parser(logPath: string): Array<GameRawData> {
    const log: string = fs.readFileSync(logPath, 'utf8')
    const games: Array<string> = log.split('InitGame')
    const gamesData: Array<GameRawData> = []

    games.shift()

    games.forEach((game, index) => {

        const playersList = getPlayersList(game)

        const killsData = getKillsList(game)

        const playerScore = calculatePlayerScore(killsData, playersList)

        gamesData.push({
            gameCount: index + 1,
            totalKills: killsData.totalKills,
            players: playersList,
            kills: playerScore
        })
    })
    return gamesData
}

export function gameDataBuilder(gameRawData: GameRawData) {
    return {
        game: {
            gameCount: gameRawData.gameCount,
            total_kills: gameRawData.totalKills,
            players: [...gameRawData.players],
            kills: gameRawData.kills
        }
    }
}