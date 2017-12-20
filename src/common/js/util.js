export function shuffle(arr) {
    let _arr = arr.slice(0)
    for (let i = 0; i < arr.length; i++) {
        let j = getRandomInt(0, i)
        let t = _arr[i]
        _arr[i] = _arr[j]
        _arr[j] = t
    }
    return _arr
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function debounce(func, delay) {
    let timer
    return function(...args) {
        if (timer) {
            clearTimeout(timer)
        }
        // delay时间后执行func函数，每次调用debounce会清空之前没到delay时间的timer
        timer = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}