import { playMode } from 'common/js/config'
import { loadSearch, loadPlay, loadFavorite } from 'common/js/cache'

const state = {
    singer: {},
    playing: false,
    fullScreen: false,
    // 只有当顺序播放的时候playlist和sequencelist才相等
    playList: [],
    sequenceList: [],
    mode: playMode.sequence,
    currentIndex: -1,
    disc: {},
    topList: {},
    searchHistory: loadSearch(),
    playHistory: loadPlay(),
    favoriteList: loadFavorite()
}

export default state