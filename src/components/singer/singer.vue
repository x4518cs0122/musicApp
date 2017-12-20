<template>
  <div class="singer" ref="singer">
      <list-view :data="singers" @select="selectSinger" ref="list"></list-view>
      <!-- music-list -->
      <router-view></router-view>
  </div>
</template>
<script>
import {getSingerList} from 'api/singer.js'
import Singer from 'common/js/singer'
import listView from 'base/listview/listview'
import {mapMutations} from 'vuex'
import {playlistMixin} from 'common/js/mixin'

const ERR_OK = 0
const HOT_NAME = "热门"
const HOT_NUM = 10

export default {
  mixins:[playlistMixin],
  data(){
    return{
      singers:[]
    }
  },
  created(){
    this._getSingerList()
  },
  components:{
    listView
  },
  methods:{
    hanlePlayList(playlist){
        let bottom = playlist.length>0 ? '60px' :''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
    },
    _getSingerList(){
      getSingerList().then((res)=>{
        if(res.code ===0){
          // res.data.list.unshift({
          //   Findex:"W",
          //   Fsinger_mid:"1",
          //   Fsinger_name:"吴仪",
          // })
          // console.log(res.data.list)
          this.singers = this.normalizeSinger(res.data.list)
          // console.log(this.singers)
        }
      })
    },
    normalizeSinger(List){
      let map = {
        hot:{
          title:HOT_NAME,
          items:[]
        }
      }
      List.forEach((item,index) =>{
        if(index<HOT_NUM){
          map.hot.items.push(new Singer(
            {
              id:item.Fsinger_mid,
              name:item.Fsinger_name
            }))
        }
        const key = item.Findex
        if(!map[key]){
          map[key] = {
            title:key,
            items:[]
          }
        }
        map[key].items.push(new Singer({
          id:item.Fsinger_mid,
          name:item.Fsinger_name         
        }))
      })

      // 转换成有序列表
      let hot = []
      let ret = []
      let spe = []
      for (let key in map){
        let val = map[key]
        if(val.title.match(/[a-zA-Z]/)){
          ret.push(val)
        }else if(val.title === HOT_NAME){
          hot.push(val)
        }else{
          spe.push(val)
        }
      }
      // 按字母排序
      ret.sort((a,b)=>{
        return a.title.charCodeAt(0)-b.title.charCodeAt(0)
      })
      spe.sort((a,b) =>{
        return a.title.charCodeAt(0)-b.title.charCodeAt(0)
      })

      return hot.concat(ret).concat(spe)
    },
    selectSinger(singer){
      this.$router.push({
        path:`/singer/${singer.id}`
      })
      this.setSinger(singer)
    },
    ...mapMutations({
      setSinger:'SET_SINGER'
    })
  }
  
}
</script>
<style lang="stylus" scoped>
  .singer
    position fixed
    top 88px
    bottom 0
    width 100%
</style>
