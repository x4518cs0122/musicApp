<template>
  <div class="search">
    <div class="search-box-wrapper">
      <searchBox ref="searchBox" @query="onQueryChange"></searchBox>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortCutWrapper"> 
      <Scroll class="shortcut" :data="shortCut" ref="shortcut" :refreshDelay="refreshDelay">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li v-for="item in hotKey" :key="item.index" class="item" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
        <!-- 搜索历史 -->
          <div class="search-history" v-show="searchHistory.length>0">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <div class="search-list-wrapper">
              <searchList :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></searchList>
            </div>
          </div>
        </div>   
      </Scroll>
    </div>
    <!-- 输入后显示搜索结果 -->
    <div class="search-result" v-show="query" ref="searchResultWrapper">
      <suggest :query="query" :showSinger="true" @listScroll="blurInput" @select="saveSearch" ref="suggest"></suggest>
    </div>
    <confirm ref="showConfirm" text="是否清空所有搜索历史" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
  </div>
</template>
<script>
import searchBox from 'base/search-box/search-box'
import {getHotKey} from 'api/search'
import suggest from 'components/suggest/suggest'
import {mapGetters,mapActions} from 'vuex'
import searchList from 'base/search-list/search-list'
import confirm from 'base/confirm/confirm'
import Scroll from 'base/scroll/scroll'
import {playlistMixin,searchMixin} from 'common/js/mixin'

const ERR_OK = 0

export default {
  mixins:[playlistMixin,searchMixin],
  components:{
    searchBox,
    suggest,
    searchList,
    confirm,
    Scroll
  },
  data(){
    return {
      hotKey:[],
      query:''
    }
  },
  created(){
    this._getHotKey()
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  computed:{
    shortCut(){
      return this.hotKey.concat(this.searchHistory)
    },
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods:{
    _getHotKey(){
      getHotKey().then((res)=>{
        if(res.code ===ERR_OK){
          this.hotKey = res.data.hotkey.slice(0,10)
        }
      })
    },

    showConfirm(){
      this.$refs.showConfirm.show()
    },
    hanlePlayList(playList){
      let bottom = playList.length>0? '60px':''
      this.$refs.shortCutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
      this.$refs.searchResultWrapper.style.bottom = bottom
      this.$refs.suggest.refresh()
    }
  }
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable"
.search
  .search-box-wrapper
    margin 20px
  .shortcut-wrapper
    position fixed
    top 178px
    bottom 0
    width 100%
    .shortcut
      overflow hidden
      height 100%
      .hot-key
        margin 0 20px 20px 20px
        .title
          margin-bottom 20px
          font-size $font-size-medium
          color $color-text-l
        .item
          display: inline-block
          padding: 5px 10px
          margin: 0 20px 10px 0
          border-radius: 6px
          background: $color-highlight-background
          font-size: $font-size-medium
          color: $color-text-d
      .search-history
        position: relative
        margin: 0 20px
        .title
          display flex
          align-items center
          height 40px
          font-size: $font-size-medium
          color: $color-text-l 
          .text
            flex: 1
          .clear
            .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
  .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
