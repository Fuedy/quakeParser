export type GameRawData = {
    gameCount: number,
    totalKills: number,
    players: Set<string>,
    kills: Record<string, number>
}