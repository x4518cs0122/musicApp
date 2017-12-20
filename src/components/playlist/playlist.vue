<template>
  <div class="playlist" v-show="showFlag" @click="hide">
     <div class="playlist-wrapper" @click.stop>
         <div class="list-header">
             <h1 class="title">
                <i :class="iconMode " class="icon" @click="changeMode"></i>
                <span class="text" >{{modeText}}</span>
                <span class="clear" @click="showConfirm">
                    <i class="icon-clear"></i>
                </span>
             </h1>
         </div>
         <Scroll class="list-content" :data="sequenceList" ref="listContent" :refreshDelay="refreshDelay">
             <transition-group name="list" tag="ul" ref="listWrapper">
                 <li class="list-item" v-for="(item,index) in sequenceList" 
                                        :key="item.id" 
                                        @click="selectItem(item,index)"
                                        ref="listItem">
                     <i class="current" :class="getCurrentIcon(item)"></i>
                     <span class="text">{{item.name}}</span>
                     <span class="like" @click.stop="toggleFavorite(item)">
                         <i :class="getFavoriteIcon(item)"></i>
                     </span>
                     <span class="delete" @click.stop="deleteOne(item)">
                         <i class="icon-delete"></i>
                     </span>
                 </li>
             </transition-group>
         </Scroll>
         <div class="list-operate">
             <div class="add" @click="showAddSong">
                 <i class="icon-add"></i>
                 <span class="text">添加歌曲到队列</span>
             </div>
         </div>
         <div class="list-close" @click="hide">
             <span>关闭</span>
         </div>
     </div>
     <confirm ref="confirm" text="是否清空播放列表" @confirm="confirmClear"></confirm>
     <add-song ref="addSong"></add-song>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import {playMode} from 'common/js/config'
import {mapGetters,mapMutations,mapActions} from 'vuex'
import confirm from 'base/confirm/confirm'
import {playerMixin} from 'common/js/mixin'
import addSong from 'components/add-song/add-song'
export default {
  mixins: [playerMixin],
  data(){
      return{
          showFlag:false,
          refreshDelay:100
      }
  },
  components:{
      Scroll,
      confirm,
      addSong
  },
  computed:{
      modeText(){
          return this.mode === playMode.sequence? '顺序播放':this.mode ===playMode.loop? '单曲循环':'随机播放'
      }
  },
  watch:{
      currentSong(newSong,oldSong){
          if(!this.$refs.listItem){
              return
          }
          if(newSong.id === oldSong.id && !this.showFlag){
              return
          }
         setTimeout(() => {
          this.scrollToCurrent(newSong)
        }, 20) 
      }
  },
  methods:{
      show(){
          this.showFlag = true
        //   由于调用show方法后渲染dom，所以scroll没有正确计算高度
          setTimeout(()=>{
              this.$refs.listContent.refresh()
              this.scrollToCurrent(this.currentSong)
          },20)
      },
      hide(){
          this.showFlag = false
      },
      getCurrentIcon(item){
          return this.currentSong.id === item.id? 'icon-play':''
      },
      selectItem(item,index){
          if(this.mode === playMode.random){
              index = this.playList.findIndex((listItem)=>{
                  return listItem.id === item.id
              })
          }
          this.setCurrentIndx(index)
          this.setPlayingState(true)
      },
      ...mapMutations({
          setCurrentIndx:'SET_CURRENT_INDEX',
          setPlayingState:'SET_PLAYING_STATE'
      }),
      scrollToCurrent(current){
          const index = this.sequenceList.findIndex((song)=>{
              return song.id === current.id
          }) 
          this.$refs.listContent.scrollToElement(this.$refs.listWrapper.$el.children[index],300)
      },
      deleteOne(item){
          this.deleteSong(item)
          if(!this.playList.length){
              this.hide()
          }
      },
      ...mapActions([
          'deleteSong',
          'deleteSongList'
      ]),
      showConfirm(){
          this.$refs.confirm.show()
      },
      confirmClear(){
          this.deleteSongList()
          this.hide()
      },
      showAddSong(){
          this.$refs.addSong.show()
      }
  }
}
</script>
<style lang="stylus" scoped>
    @import '~common/stylus/variable'
    @import '~common/stylus/mixin'
.playlist
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    z-index 200
    background $color-background-d
    .playlist-wrapper
        position absolute
        bottom 0
        left 0
        width 100%
        background $color-highlight-background
        .list-header
            // position: relative
            padding: 20px 30px 10px 20px
            .title
                display flex
                align-items center 
                .icon
                    color $color-theme-d
                    font-size 30px
                    margin-right 10px
                .text
                    flex 1
                    color $color-text-l
                    font-size $font-size-medium
                .clear
                    // padding 5px
                    .icon-clear
                        font-size $font-size-medium
                        color $color-text-d
    .list-content
        max-height: 240px
        overflow: hidden
        .list-item
            display flex
            align-items: center
            height: 40px
            padding: 0 30px 0 20px
            overflow: hidden
            &.list-enter-active,&.list-leave-active
                transition all 0.1s
            &.list-enter,&.list-leave-to
                height 0
            .current
                flex: 0 0 20px
                width: 20px
                font-size: $font-size-small
                color: $color-theme-d
            .text
                flex 1
                no-wrap()
                font-size: $font-size-medium
                color: $color-text-d
            .like
                margin-right 15px
                font-size: $font-size-small
                color: $color-theme
                .icon-favorite
                    color $color-sub-theme
            .delete
                color $color-theme
                font-size: $font-size-small
            // .current
    .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
            display: flex
            align-items: center
            padding: 8px 16px
            border: 1px solid $color-text-l
            border-radius: 100px
            color: $color-text-l
            .icon-add
                margin-right 5px
                font-size: $font-size-small-s
            .text
                font-size: $font-size-small
    .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
            
                



</style>


