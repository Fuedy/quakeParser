import * as fs from 'fs'

type GameRawData = {
    gameCount: number,
    totalKills: number,
    players: Set<string>,
    kills: Record<string, number>
}

export function parser(logPath: string): Array<GameRawData> {
    const log = fs.readFileSync(logPath, 'utf8')
    const games = log.split('InitGame')
    const gamesData: Array<GameRawData> = []
    games.shift()
    let gameCount = 0

    games.forEach(game => {
        gameCount++
        let totalKills = 0
        const killers = []
        const killedByWorld = []
        const playersList: Set<string> = new Set()

        const killCount = game.match(/.Kill./gm)
        const result = game.split(/\r?\n/)
        game.match(/ClientUserinfoChanged: \d n\\([a-zA-Z\s]*)/gm).forEach(clientUser => {
            playersList.add(clientUser.match(/\\(.)+$/m)[0].slice(1))
        })
        result.filter(value => {
            return value.includes('killed')
        })

        try {
            totalKills = killCount.length
            const kills = (game.match(/\d: (.)+killed (.)+ by/gm))
            kills.forEach(kill => {
                const killer = (kill.slice(3,(kill.indexOf('killed')-1)))
                const killed = (kill.slice(kill.indexOf('killed')+7,-3))
                if (killer == '<world>') {
                    killedByWorld.push(killed)
                }
                else {
                    killers.push(killer)
                }

            })
        } catch (error) {
            totalKills = 0
        }

        const countKiller: Record<string, number> = {}
        const countKilledByWorld: Record<string, number> = {}

        killedByWorld.forEach((killedName: string) => {
            countKilledByWorld[killedName] = (countKilledByWorld[killedName] || 0) + 1
        })
        killers.forEach((killerName: string) => {
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
        const kills = countKiller

        const gameData: GameRawData = {
            gameCount,
            totalKills,
            players: playersList,
            kills
        }
        gamesData.push(gameData)
    })
    return gamesData
}

export function gameDataBuilder(gameCount: number, gameRawData: GameRawData) {
    return {
        game: {
            gameCount: gameCount,
            total_kills: gameRawData.totalKills,
            players: [...gameRawData.players],
            kills: gameRawData.kills
        }
    }
}

const rawData = (parser('quakelog/qgames.log'))
rawData.forEach((gameRawData, index) => {
    console.log(gameDataBuilder(index, gameRawData))
})