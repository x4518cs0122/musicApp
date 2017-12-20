<template>
  <div class="rank" ref="rank">
      <Scroll class="toplist" :data="rank" ref="toplist">
        <ul>
          <li class="item" v-for="item in rank" :key="item.index" @click="selectItem(item)">
            <div class="icon">
              <img v-lazy="item.picUrl" width="100" height="100" />
            </div>
            <ul class="songlist">
              <li class="song" v-for="(song,index) in item.songList" :key="index">
                <span>{{index+1}}</span>
                <span>{{song.songname}} - {{song.singername}}</span>
              </li>
            </ul>
          </li>
        </ul>
        <div class="loading-container" v-show="!rank.length">
          <loading></loading>
        </div>
      </Scroll>
    <router-view></router-view>
  </div>
</template>
<script>
import {getTopList} from 'api/rank'
import Scroll from 'base/scroll/scroll'
import {playlistMixin} from 'common/js/mixin'
import loading from 'base/loading/loading'
import {mapMutations} from 'vuex'

const ERR_OK = 0

export default {
  mixins:[playlistMixin],
  data(){
    return {
      rank:[]
    }
  },
  created(){
    this._getTopList()
  },
  components:{
    Scroll,
    loading
  },
  methods:{
    _getTopList(){
      getTopList().then((res) =>{
        if(res.code === ERR_OK){
          // console.log(res.data.topList)
          this.rank = res.data.topList
        }
      })
    },
    hanlePlayList(playlist){
      let bottom = playlist.length>0? '60px':''
      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh()
    },
    selectItem(item){
      this.$router.push({
        path:`/rank/${item.id}`
      })
      this.setTopList(item)
    },
    ...mapMutations({
      setTopList:'SET_TOP_LIST'
    })
  }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/variable'
@import '../../common/stylus/mixin'
  .rank
    position fixed
    top 88px
    bottom 0
    width 100%
    .toplist
      height 100%
      overflow hidden
      .item
        display flex
        margin 0 20px
        padding-top 20px
        height 100px
        &:last-child
          padding-bottom 20px
        .icon
          flex 0 0 100px
          width 100px
          height 100px
        .songlist
          height 100px
          flex 1
          display flex
          flex-direction column
          justify-content center
          padding 0 20px
          overflow hidden
          background $color-highlight-background
          color $color-text-d
          font-size $font-size-small
          .song
              no-wrap()
              line-height 26px
      .loading-container
        position fixed
        top 50%
        width 100%
        transform translateY(-50%)

</style>
