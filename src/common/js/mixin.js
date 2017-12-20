import { mapGetters, mapActions, mapMutations } from 'vuex'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
// mixin作用是将对象拷贝到使用该mixin的对象上

//设置出现playermini时的bottom值
export const playlistMixin = {
    computed: {
        ...mapGetters([
            'playList'
        ])
    },
    mounted() {
        this.hanlePlayList(this.playList)
    },
    activated() {
        this.hanlePlayList(this.playList)
    },
    watch: {
        playList(newVal) {
            this.hanlePlayList(newVal)
        }
    },
    methods: {
        hanlePlayList() {
            throw new Error('component must implement handlPlayList method')
        }
    }

}

//设置播放模式切换
export const playerMixin = {
    computed: {
        ...mapGetters([
            'currentSong',
            'mode',
            'playList',
            'sequenceList',
            'favoriteList'
        ]),
        iconMode() {
            return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
        }
    },
    methods: {
        ...mapMutations({
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayMode: 'SET_PLAY_MODE',
            setPlayList: 'SET_PLAYLIST'
        }),
        ...mapActions([
            'saveFavoriteList',
            'deleteFavoriteList'
        ]),
        changeMode() {
            let mode = (this.mode + 1) % 3
            this.setPlayMode(mode)
            let list = null
            if (mode === playMode.random) {
                list = shuffle(this.sequenceList)
            } else {
                list = this.sequenceList
            }
            this.resetCurrentSong(list)
            this.setPlayList(list)
        },
        resetCurrentSong(list) {
            let index = list.findIndex((item) => {
                return item.id === this.currentSong.id
            })
            this.setCurrentIndex(index)
        },
        toggleFavorite(song) {
            if (this.isFavorite(song)) {
                this.deleteFavoriteList(song)
            } else {
                this.saveFavoriteList(song)
            }
        },
        getFavoriteIcon(song) {
            if (this.isFavorite(song)) {
                return 'icon-favorite'
            }
            return 'icon-not-favorite'
        },
        isFavorite(song) {
            const index = this.favoriteList.findIndex((item) => {
                return song.id === item.id
            })
            return index > -1
        }
    }
}

//搜索框mixin
export const searchMixin = {
    data() {
        return {
            query: '',
            refreshDelay: 100
        }
    },
    computed: {
        ...mapGetters([
            'searchHistory'
        ])
    },
    methods: {
        blurInput() {
            this.$refs.searchBox.blur()
        },
        saveSearch() {
            this.saveSearchHistory(this.query)
        },
        onQueryChange(query) {
            this.query = query
        },
        addQuery(query) {
            this.$refs.searchBox.setQuery(query)
        },
        ...mapActions([
            'saveSearchHistory',
            'deleteSearchHistory',
            'clearSearchHistory'
        ])
    }
}