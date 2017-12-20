import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

function insertArray(arr, val, compare, maxLen) {
    // compare是一个实现的标准，类似于forEach，每次传入一个arr中的元素item，若符合return的条件则返回所在的位置
    const index = arr.findIndex(compare)
    if (index === 0) {
        return
    }
    if (index > 0) {
        arr.splice(index, 1)
    }
    arr.unshift(val)
    if (maxLen && arr.length > maxLen) {
        arr.pop()
    }
}

function deleteFromArray(arr, compare) {
    const index = arr.findIndex(compare)
    if (index > -1) {
        arr.splice(index, 1)
    }
}

export function saveSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])
    insertArray(searches, query, (item) => {
        return item === query
    }, SEARCH_MAX_LENGTH)
    storage.set(SEARCH_KEY, searches)
    return searches
}

export function loadSearch() {
    return storage.get(SEARCH_KEY, [])
}

export function deleteSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])
    deleteFromArray(searches, (item) => {
        return item === query
    })
    storage.set(SEARCH_KEY, searches)
    return searches
}
export function clearSearch() {
    storage.remove(SEARCH_KEY)
    return []
}

export function savePlay(song) {
    let songList = storage.get(PLAY_KEY, [])
    insertArray(songList, song, (item) => {
        return item.id === song.id
    }, PLAY_MAX_LENGTH)
    storage.set(PLAY_KEY, songList)
    return songList
}
export function loadPlay() {
    return storage.get(PLAY_KEY, [])
}

export function clearPlay() {
    storage.remove(PLAY_KEY)
    return []
}

export function saveFavorite(song) {
    let favoritelist = storage.get(FAVORITE_KEY, [])
    insertArray(favoritelist, song, (item) => {
        return item.id === song.id
    }, FAVORITE_MAX_LENGTH)
    storage.set(FAVORITE_KEY, favoritelist)
    return favoritelist
}

export function deleteFavorite(song) {
    let favoritelist = storage.get(FAVORITE_KEY, [])
    deleteFromArray(favoritelist, (item) => {
        return item.id === song.id
    })
    storage.set(FAVORITE_KEY, favoritelist)
    return favoritelist
}

export function loadFavorite() {
    return storage.get(FAVORITE_KEY, [])
}