export type GroupedGameData = {
    gameCount: number,
    totalKills: number,
    players: Array<string>,
    kills: Record<string, number>,
}

export type KillsData = {
    totalKills: number,
    killedByWorld: Array<string>,
    killers: Array<string>
}

export type GroupedKillsByMeans = {
    gameCount: number,
    kills_by_means: Record<string,number>
}