import { gamesDataParser } from "./gamesDataParser"
import { killByMeansParser } from "./killsByMeanParser"

export function getGroupedGameData() {
    return (gamesDataParser('quakelog/qgames.log'))
}

console.log(killByMeansParser('quakelog/qgames.log'))
console.log(getGroupedGameData())