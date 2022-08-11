import { parser, gameDataBuilder } from "./parser"

export function createReport() {
    const rawData = (parser('quakelog/qgames.log'))
    rawData.forEach((gameRawData, index) => {
        console.log(gameDataBuilder(index, gameRawData))
    })
}

createReport()