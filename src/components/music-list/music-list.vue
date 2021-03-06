<template>
  <div class="music-list">
      <div class="back" @click="back">
          <i class="icon-back"></i>
      </div>
      <h1 class="title" v-html="title"></h1>
      <div class="bg-image" :style="bgstyle" ref="bgImage">
          <div class="play-wrapper" v-show="songs.length>0" ref="playButton">
              <div class="play" @click="random">
                  <i class="icon-play"></i>
                  <span class="text" >随机播放全部</span>
              </div>
          </div>
          <div class="filter" ref="filter"></div>
      </div>
      <div class="bg-layer" ref="bgLayer"></div>
      <Scroll :data="songs" class="list" ref="list" 
            @scroll="scroll" :listenScroll="listenScroll" :probeType="probeType">
          <div class="song-list-wrapper">
              <song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
          </div>
          <div class="loading-container" v-show="!songs.length">
              <loading></loading>
          </div>
          
      </Scroll>
  </div>
</template>
<script>
import songList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import {prefixStyle} from 'common/js/dom'
import loading from 'base/loading/loading'
import {mapActions} from 'vuex'
import {playlistMixin} from 'common/js/mixin'


const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')

export default {   
  mixins:[playlistMixin],
  props:{
      bgImage:{
          type:String,
          default:''
      },
      songs:{
          type:Array,
          default:[]
      },
      title:{
          type:String,
          default:''
      },
      rank:{
          type:Boolean,
          default:false
      }
  },
  data(){
      return{
          scrollY:0
      }
  },
  mounted(){
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.minTranslateY = -(this.imageHeight- RESERVED_HEIGHT)
      this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
  },
  created(){
      this.probeType = 3
      this.listenScroll = true
  },
  computed:{
      bgstyle(){
          return `background-image:url(${this.bgImage})`
      },
  },
  methods:{
      hanlePlayList(playlist){
        let bottom = playlist.length>0 ? '60px' :''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      scroll(pos){
          this.scrollY = pos.y
      },
      back(){
          this.$router.back()
      },
      selectItem(item,index){
          this.selectPlay({
              list:this.songs,
              index:index
          })
      },
      random(){
          this.randomPlay({
              list:this.songs
          })
      },
      ...mapActions([
          'selectPlay',
          'randomPlay'
      ])   
  },
  watch:{
      scrollY(newY){

          let translateY = Math.max(this.minTranslateY,newY)
          let Zindex = 0
          let scale = 1
          let blur = 0
          const percent = Math.abs(newY/this.imageHeight)
          this.$refs.bgLayer.style[transform] = `translate3d(0,${translateY}px,0)`
          if(newY>0){   
            scale = 1 + percent
            Zindex = 10
          }else{
              blur = Math.min(20*percent,20)
          }
          this.$refs.filter.style[backdrop] = `blur(${blur}px)` 
          if(newY<this.minTranslateY){
              Zindex = 10
              this.$refs.bgImage.style.paddingTop =0
              this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px` 
              this.$refs.playButton.style.display = 'none'
          }else{
              this.$refs.bgImage.style.paddingTop ='70%'
              this.$refs.bgImage.style.height = 0
              this.$refs.playButton.style.display = ''
          }
          this.$refs.bgImage.style.zIndex = Zindex
          this.$refs.bgImage.style[transform] = `scale(${scale},${scale})`
           
      }
  },
  components:{
      songList,
      Scroll,
      loading
  }
}
</script>
<style lang="stylus" scoped>
@import "../../common/stylus/variable"
@import '../../common/stylus/mixin'

    .music-list
        position fixed
        z-index 100
        top 0
        left 0
        right 0
        bottom 0
        background $color-background
        .back
            position absolute
            top: 0
            left: 6px
            z-index: 50
            .icon-back
                display: block
                padding: 10px
                font-size: $font-size-large-x
                color: $color-theme
        .title
            position: absolute
            top: 0
            left: 10%
            z-index: 40
            width: 80%
            no-wrap()
            text-align: center
            line-height: 40px
            font-size: $font-size-large
            color: $color-text
        .bg-image
            position: relative
            width: 100%
            height: 0
            padding-top: 70%
            transform-origin: top
            background-size: cover
            .play-wrapper
                position absolute
                bottom 20px
                z-index 50
                width: 100%
                .play
                    padding 7px 0
                    border 1px solid $color-theme
                    border-radius 100px
                    width 135px
                    margin 0 auto
                    text-align center
                    color $color-theme
                    .icon-back
                        display: inline-block
                        vertical-align: middle
                        margin-right: 6px
                        font-size: $font-size-medium-x
                    .text                  
                        display: inline-block
                        vertical-align: middle
                        font-size: $font-size-small
            .filter
                position: absolute
                top: 0
                left: 0
                width: 100%
                height: 100%
                background: rgba(7, 17, 27, 0.4)
        .bg-layer
            position: relative
            height: 100%
            background: $color-background
        .list
            position fixed
            top 0
            bottom 0
            width 100%
            background: $color-background
            // overflow hidden
            .song-list-wrapper
                padding 20px 30px
            .loading-container
                position absolute
                top 50%
                width 100%
                transform: translateY(-50%)
            
</style>
