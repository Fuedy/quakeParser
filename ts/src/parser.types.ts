export type GameRawData = {
    gameCount: number,
    totalKills: number,
    players: Set<string>,
    kills: Record<string, number>
}

export type KillsData = {
    totalKills: number,
    killedByWorld: Array<string>,
    killers: Array<string>
}