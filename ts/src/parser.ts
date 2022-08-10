import * as fs from 'fs'

export function parser(params: any) {
    //const log = fs.readFileSync('quakelog/qgames.log', 'utf8')
    const log = fs.readFileSync('quakelog/teste.log', 'utf8')
    const games = log.split('InitGame')
    const gamesData = []
    games.shift()
    let gamesCount = 0
    
    games.forEach(game => {
        gamesCount++
        let totalKills = 0
        const players = new Set()

        const killCount = game.match(/.Kill./gm)
        const result = game.split(/\r?\n/)
        const filtered = result.filter(value => {
            return value.includes('killed')
    })
        console.log(filtered)

        try {
            totalKills = killCount.length
            const kills = (game.match(/\d: (.)+killed (.)+ by/gm))
            kills.forEach(kill => {
                const killer = (kill.split(' '))[1]
                const killed = (kill.split(' '))[3]
                players.add(killer).add(killed)
            })
        } catch (error) {
            totalKills = 0
        }

        const gameData = {
            gamesCount,
            totalKills,
            players,
            kills: {}
        }
        gamesData.push(gameData)
    })
    console.log(gamesData)
}

export function gameDataBuilder(gameCount: string, totalKills: number, playersSet: Set<string>, kills:object) {
    const players = [...playersSet]
    const gameData = {

        gameCount: {
            total_kills: totalKills,
            players,
            kills
        }
    }
    return gameData
}
parser('lol')