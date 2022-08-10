import * as fs from 'fs'

type GameRawData = {
    gameCount: number,
    totalKills: number,
    players: Set<string>,
    kills: Record<string, number>
}

export function parser(logPath: string) : Array<GameRawData> {
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
        const players:Set<string> = new Set()

        const killCount = game.match(/.Kill./gm)
        const result = game.split(/\r?\n/)
        result.filter(value => {
            return value.includes('killed')
    })

        try {
            totalKills = killCount.length
            const kills = (game.match(/\d: (.)+killed (.)+ by/gm))
            kills.forEach(kill => {
                const killer = (kill.split(' '))[1]
                const killed = (kill.split(' '))[3]
                if (killer == '<world>'){
                    killedByWorld.push(killed)
                }
                else{
                    players.add(killer).add(killed)
                    killers.push(killer)
                }

            })
        } catch (error) {
            totalKills = 0
        }

        const countKiller:Record<string, number> = {}
        const countKilledByWorld:Record<string, number> = {}
        killedByWorld.forEach ((killedName:string) => {
            countKilledByWorld[killedName] =  (countKilledByWorld[killedName] || 0) + 1
        })
        killers.forEach ((killerName:string) => {
            countKiller[killerName] =  (countKiller[killerName] || 0) + 1
        })        

        players.forEach((player:string) => {
            countKiller[player] -= countKilledByWorld[player]
        })
        const kills = countKiller

        const gameData:GameRawData = {
            gameCount,
            totalKills,
            players,
            kills
        }
        gamesData.push(gameData)
    })
    return gamesData
}

export function gameDataBuilder(gameCount: number, gameRawData:GameRawData) {
    return {
        game: {
            gameCount: gameCount,
            total_kills: gameRawData.totalKills,
            players: [...gameRawData.players],
            kills: gameRawData.kills
        }
    }
}

const rawData = (parser('quakelog/teste.log'))
rawData.forEach((gameRawData, index) => {
    console.log(gameDataBuilder(index,gameRawData))
})