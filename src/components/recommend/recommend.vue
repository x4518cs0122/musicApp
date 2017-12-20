<template>
  <div class="recommend" ref="recommend">
      <Scroll ref="scroll" class="recommend-content" :data="songList">
          <div>
            <div v-if="recommends.length" class="slider-wrapper">
                <Slider>
                    <div v-for="(item,index) in recommends" :key="index" >
                        <!-- <p>{{index}}</p> -->
                        <a :href="item.linkUrl">
                            <img :src="item.picUrl" @load="loadImage">
                        </a>
                    </div>
                </Slider>
            </div>
            <div class="recommend-list">
                <h1 class="list-title">热门歌单推荐</h1>
                <ul>
                    <li class="list-item" v-for="item in songList" :key="item.index" @click="selectDiss(item)">
                            <div class="icon">
                                <img width="60" height="60" v-lazy="item.imgurl">
                            </div>
                            <div class="text">
                                <h2 class="name">{{item.creator.name}}</h2>
                                <p class="desc" >{{item.dissname}}</p>
                            </div>
                    </li>
                </ul>
            </div>
          </div>
          <div class="loading-container" v-show="!songList.length">
              <loading></loading>
          </div>
          <router-view></router-view>
      </Scroll>
  </div>
</template>
<script>
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import loading from 'base/loading/loading'
import {getRecommend,getDiscList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'

export default {
    mixins:[playlistMixin],
    data(){
        return{
            recommends:[],
            songList:[]
        }
    },
    created() {
        this._getRecommend()
        this._getDiscList()
    },
    methods:{
        _getRecommend(){
            getRecommend().then((res) =>{
                if(res.code === ERR_OK){
                    this.recommends =  res.data.slider   
                }
            })
        },
        _getDiscList(){
            getDiscList().then((res) =>{
                if(res.code === ERR_OK){
                    this.songList = res.data.list
                }
            })
        },
        loadImage(){
            // better-scroll监听songList变化而刷新，该方法为了避免slider中image获取晚而导致的高度计算错误
            if(!this.checkLoaded){
                setTimeout(()=>{
                    this.$refs.scroll.refresh()
                    this.checkLoaded = true
                },20) 
            }
        },
        hanlePlayList(playlist){
            let bottom = playlist.length>0 ? '60px':''
            this.$refs.recommend.style.bottom = bottom
            this.$refs.scroll.refresh()
        },
        selectDiss(disc){
            this.$router.push({
                path:`/recommend/${disc.dissid}`
            })
            this.setDisc(disc)
        },
        ...mapMutations({
            setDisc:'SET_DISC'
        })
    },
    components:{
        Slider,
        Scroll,
        loading
    }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/variable'
    .recommend
        position fixed
        width 100%
        top 88px
        bottom 0
        .recommend-content
            height 100%
            overflow hidden
            .slider-wrapper
                position relative
                width 100%
                overflow hidden
            .recommend-list
                .list-title
                    text-align center
                    color $color-theme
                    height 65px
                    line-height 65px
                    font-size $font-size-medium
                .list-item
                    display flex
                    box-sizing border-box
                    align-items center
                    padding 0 20px 20px 20px
                    .icon
                        flex 0 0 60px
                        width 60px
                        padding-right: 20px
                        img 
                            border-radius 5px
                    .text
                        flex 1
                        display flex
                        flex-direction column
                        justify-content center
                        line-height 20px
                        overflow hidden
                        font-size $font-size-medium
                        .name
                            color $color-text
                            margin-bottom 10px
                        .desc
                            color $color-text-d
        .loading-container
            position absolute
            top 50%
            width 100%
            transform translateY(-50%)
</style>

