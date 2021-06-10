export const dateFormat= (originVal, isFull)=> {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth + 1 + '').padStart(2, '0')
    const d = (dt.getDate + 1 + '').padStart(2, '0')
    const hh = (dt.getHours + 1 + '').padStart(2, '0')
    const mm = (dt.getMinutes + 1 + '').padStart(2, '0')
    const ss = (dt.getSeconds + 1 + '').padStart(2, '0')
    if (isFull) {
        return `${y}-${m}-${d}`
    } else {
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
}
