import { parser } from "./parser"

export function getGroupedGameData() {
    return (parser('quakelog/qgames.log'))
}

console.log(getGroupedGameData())