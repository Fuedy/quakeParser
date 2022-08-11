import { gamesDataParser, playersRanking } from "./gamesDataParser"
import { killByMeansParser } from "./killsByMeanParser"
import {stdin, stdout} from "node:process"
import * as readline from "node:readline"

const logPath = 'quakelog/qgames.log'
const rl = readline.createInterface(stdin,stdout)

console.log(playersRanking(logPath))

console.log(`-----Quake Arena 3 Parser-----
    Select grouped information:
    1 - Grouped info per game
    2 - Kills by means per game
    3 - General Player Ranking`)
rl.question('Please type your option number: ', option => {
    switch (option) {
        case '1':
            console.log(gamesDataParser(logPath))
            break;
        case '2':
            console.log(killByMeansParser(logPath))
            break;
        case '3':
            console.log(playersRanking(logPath))
            break;
        default:
            console.log('Option not valid.')
            break;
    }
    rl.close()
})
