import { getKillsByMeans, killByMeansParser } from "../src/killsByMeanParser";
import * as fs from 'fs'
const logPath = 'ts/test/test.log'
const log = fs.readFileSync(logPath, 'utf8')
const gamesRaw: Array<string> = log.split('InitGame')

describe('getKillsByMeans', () => {
    it('Should return no kills',() => {
        expect(getKillsByMeans(gamesRaw[1])).toEqual({})
    })
    it('Should return kills grouped my mean', () => {
        expect(getKillsByMeans(gamesRaw[5])).toEqual({"MOD_RAILGUN": 1, "MOD_ROCKET": 4, "MOD_ROCKET_SPLASH": 4, "MOD_TRIGGER_HURT": 5})
    })
})

describe('killByMeansParser', () => {
    it('should return grouped information of kills means', () => {
        expect(killByMeansParser(logPath)).toEqual([{"gameCount": 1, "kills_by_means": {}}, {"gameCount": 2, "kills_by_means": {"MOD_FALLING": 1, "MOD_ROCKET_SPLASH": 3, "MOD_TRIGGER_HURT": 7}}, {"gameCount": 3, "kills_by_means": {"MOD_FALLING": 1, "MOD_ROCKET": 1, "MOD_TRIGGER_HURT": 2}}, {"gameCount": 4, "kills_by_means": {"MOD_FALLING": 11, "MOD_MACHINEGUN": 4, "MOD_RAILGUN": 8, "MOD_ROCKET": 20, "MOD_ROCKET_SPLASH": 51, "MOD_SHOTGUN": 2, "MOD_TRIGGER_HURT": 9}}, {"gameCount": 5, "kills_by_means": {"MOD_RAILGUN": 1, "MOD_ROCKET": 4, "MOD_ROCKET_SPLASH": 4, "MOD_TRIGGER_HURT": 5}}])
    })
})