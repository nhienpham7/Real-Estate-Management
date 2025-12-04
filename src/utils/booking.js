export function nightsBetween(startIso, endIso) {
    if (!startIso || !endIso) return 0
    const s = new Date(startIso)
    const e = new Date(endIso)
    const diff = e.getTime() - s.getTime()
    if (isNaN(diff) || diff <= 0) return 0
    return Math.round(diff / (1000 * 60 * 60 * 24))
}

export default { nightsBetween }
