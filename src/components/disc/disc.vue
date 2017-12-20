<template>
  <transition name="slide">
      <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
      <!-- <div class="title">hello world!</div> -->
  </transition>
</template>
<script>
import musicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getSongList} from 'api/recommend'
import {createSong} from 'common/js/song'

const ERR_OK = 0

export default {
    data(){
        return{
            songs:[]
        }
    },
    computed:{
        title(){
            return this.disc.dissname
        },
        bgImage(){
            return this.disc.imgurl
        },
        ...mapGetters([
            'disc'
        ]) 
    },
    components: {
        musicList,
    },
    created(){
        this._getSongList()
    },
    methods:{
        _getSongList(){
            getSongList(this.disc.dissid).then((res)=>{
                if(res.code === ERR_OK){
                    this.songs = this._normalizeSongs(res.cdlist[0].songlist) 
                }
            })
        },
        _normalizeSongs(list){
            let ret = []
            list.forEach((musicData) =>{
                if(musicData.songid && musicData.albumid){
                    ret.push(createSong(musicData))
                }  
            })
            return ret
        }
    }

}
</script>
<style lang="stylus" scoped>
    .slide-enter-active, .slide-leave-active
        transition: all 0.3s
    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)
</style>
