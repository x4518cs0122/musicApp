<template>
  <Scroll class="suggest" 
            :data="result" 
            :click="true" 
            :pullup="true"
            :beforeScroll="beforeScroll"
            @scrollToEnd="searchMore"
            @beforeScroll="listScroll"
            ref="suggest">
      <ul class="suggest-list">
          <li class="suggest-item" v-for="item in result" :key="item.index" @click="selectItem(item)">
              <div class="icon">
                  <i :class="getIconCls(item)"></i>
              </div>
              <div class="name">
                  <p class="text" v-html="getDisplayName(item)"></p>
              </div>
          </li>
          <Loading v-show="hasMore"></Loading>
      </ul>
      <div v-show="!result.length&&!hasMore" class="no-result-wrapper">
          <no-result title="抱歉，暂无搜索结果"></no-result>
      </div>
      <router-view name="searchResult"></router-view>
  </Scroll>
</template>
<script>
import {search} from 'api/search'
import {createSong} from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import {mapMutations} from 'vuex'
import {mapActions} from 'vuex'
import noResult from 'base/no-result/no-result'

const ERR_OK = 0
const TYPE_SINGER = 'singer'
const perpage = 20

export default {
  props:{
      query:{
          type:String,
          default:''
      },
      showSinger:{
          type:Boolean,
          default:true
      }
  },
  data(){
      return{
          page:1,
          result:[],
          pullup:true,
          hasMore:true,
          beforeScroll:true
      }
  },
  methods:{
      _search(){
        //   初始化查询设置
          this.page = 1
          this.hasMore = true
          this.$refs.suggest.scrollTo(0,0)
          search(this.query,this.page,this.showSinger,perpage).then((res)=>{
              if(res.code === ERR_OK){
                  this.result = this._genResult(res.data)
                  this._checkMore(res.data.song)
              }
          })
      },
      _genResult(data){
          let ret = []
          if(data.zhida&&data.zhida.singerid){
              ret.push({...data.zhida,...{type:TYPE_SINGER}})
          }
          if(data.song){
              ret = ret.concat(this._normalize(data.song.list))
          }
          return ret
      },
      _normalize(list){
          let ret = []
          list.forEach((musicData)=>{
            if(musicData.songid&&musicData.songmid){
                ret.push(createSong(musicData))
            }
          })
          return ret
      },
      getIconCls(item){
          if(item.type===TYPE_SINGER){
              return 'icon-mine'
          }else{
              return 'icon-music'
          }
      },
      getDisplayName(item){
          if(item.type===TYPE_SINGER){
              return item.singername
          }else{
              return `${item.name}-${item.singer}`
          }
      },
      searchMore(){
          if(!this.hasMore){
              return
          }
          this.page++
          search(this.query,this.page,this.showSinger,perpage).then((res)=>{
              if(res.code ===ERR_OK){
                  this.result = this.result.concat(this._genResult(res.data))
                  this._checkMore(res.data.song)
              }
          })
      },
      _checkMore(data){
          if(!data.list.length || (data.curnum + data.curpage*perpage)>=data.totalnum){
              this.hasMore = false
          }
      },
      selectItem(item){
          if(item.type === TYPE_SINGER){
              const singer = new Singer({
                  id:item.singermid,
                  name:item.singername
              })                        
              this.$router.push({
                path: `/search/${singer.id}`
              })    
              this.setSinger(singer)
          }else{
              console.log(item)
              this.insertSong(item)
          }
          this.$emit('select')
      },
      ...mapMutations({
        setSinger:'SET_SINGER'
      }),
      ...mapActions([
          'insertSong'
      ]),
      listScroll(){
          this.$emit('listScroll')
      },
      refresh(){
          this.$refs.suggest.refresh()
      }
  },
  watch:{
      query(){
          this._search()
      }
  },
  components:{
      Scroll,
      Loading,
      noResult
  }
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
        .icon
            flex: 0 0 30px
            width: 30px
            [class^="icon-"]
                font-size: 14px
                color: $color-text-d
        .name
            flex: 1
            font-size: $font-size-medium
            color: $color-text-d
            overflow: hidden
            .text
                no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)

</style>


