import * as types from './mutation-types.js'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import { saveSearch, deleteSearch, clearSearch } from 'common/js/cache'
import { savePlay, clearPlay } from 'common/js/cache'
import { saveFavorite, deleteFavorite } from 'common/js/cache'

function findindex(list, song) {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}

export const selectPlay = function({ commit, state }, { list, index }) {
    commit(types.SET_SEQUENCE_LIST, list)
    if (state.mode === playMode.random) {
        let randomList = shuffle(list)
        index = findindex(randomList, list[index])
        commit(types.SET_PLAYLIST, randomList)
    } else {
        commit(types.SET_PLAYLIST, list)
    }
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_PLAYING_STATE, true)
}
export const randomPlay = function({ commit, state }, { list }) {
    commit(types.SET_PLAY_MODE, playMode.random)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_SEQUENCE_LIST, list)
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function({ commit, state }, song) {
    // slice方法是返回一个副本，不会对state.playList做修改
    let playList = state.playList.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    let currentSong = playList[currentIndex]
        // 查找当前列表中是否有待插入的歌曲并返回其索引
    let fpIndex = findindex(playList, song)
    currentIndex++
    playList.splice(currentIndex, 0, song)
        // 查找播放列表中是否有这首歌,有则删除
    if (fpIndex > -1) {
        if (fpIndex < currentIndex) {
            playList.splice(fpIndex, 1)
            currentIndex--
        } else {
            playList.splice(fpIndex + 1, 1)
        }
    }
    // sequenceList修改
    let CIndex
    if (state.currentIndex === -1) {
        CIndex = 0
    } else {
        CIndex = findindex(sequenceList, currentSong) + 1
    }
    let SIndex = findindex(sequenceList, song)
    sequenceList.splice(CIndex, 0, song)
    if (SIndex > -1) {
        if (SIndex < currentIndex) {
            sequenceList.splice(SIndex, 1)
            currentIndex--
        } else {
            sequenceList.splice(SIndex + 1, 1)
        }

    }
    commit(types.SET_PLAYLIST, playList)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

export const deleteSong = function({ commit, state }, song) {
    let playList = state.playList.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex

    let pIndex = findindex(playList, song)
    playList.splice(pIndex, 1)
    let sIndex = findindex(sequenceList, song)
    sequenceList.splice(sIndex, 1)

    if (currentIndex > pIndex || currentIndex === playList.length) {
        currentIndex--
    }
    commit(types.SET_PLAYLIST, playList)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)

    const playingList = playList.length > 0
    commit(types.SET_PLAYING_STATE, playingList)

}

export const saveSearchHistory = function({ commit }, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function({ commit }, query) {
    commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function({ commit }) {
    commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSongList = function({ commit }) {
    commit(types.SET_PLAYLIST, [])
    commit(types.SET_SEQUENCE_LIST, [])
    commit(types.SET_CURRENT_INDEX, -1)
    commit(types.SET_PLAYING_STATE, false)
}

export const savePlayHistory = function({ commit }, song) {
    commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const clearPlayHistory = function({ commit }) {
    commit(types.SET_PLAY_HISTORY, clearPlay())
}

export const saveFavoriteList = function({ commit }, song) {
    commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function({ commit }, song) {
    commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}