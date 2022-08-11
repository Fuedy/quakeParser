import { GroupedKillsByMeans } from "./parser.types"
import * as fs from "fs"

//Match by the world "MOD_" because it's enough to find all kills means
export function getKillsByMeans(game: string) {
    const killsByMeanCount: Record<string, number> = {}
    const killsByMeansList = game.match(/MOD_(.)+$/gm)

    killsByMeansList?.forEach(killMean => {
        killsByMeanCount[killMean] = (killsByMeanCount[killMean] || 0) + 1
    })
    return killsByMeanCount
}

//Recieve the logpah and return a grouped with all kills means per game
export function killByMeansParser(logPath: string): Array<GroupedKillsByMeans> {
    const log = fs.readFileSync(logPath, 'utf8')
    const gamesRaw: Array<string> = log.split('InitGame')
    const groupedKillsByMeans: Array<GroupedKillsByMeans> = []

    gamesRaw.slice(1).forEach((game, index) => {

        const kills_by_means = getKillsByMeans(game)

        groupedKillsByMeans.push({
            gameCount: index + 1,
            kills_by_means
        })
    })
    return groupedKillsByMeans
}