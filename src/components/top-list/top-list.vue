<template>
  <transition name="slide">
      <music-list :title="title" :bgImage="bgImage" :songs="songs" :rank="rank"></music-list>
  </transition>
</template>
<script>
import musicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {createSong} from 'common/js/song'
import {getMusicList} from 'api/rank'

const ERR_OK = 0

export default {
    data(){
        return{
            songs:[],
            rank:true
        }
    },
    created(){
        this._getMusicList()
    },
    computed:{
        title(){
            return this.topList.topTitle
        },
        bgImage(){
            if(this.songs.length){
                return this.songs[0].image
            }
            return ''    
        },
        ...mapGetters([
            'topList'
        ])  
    },
    components:{
        musicList
    },
    methods:{
        _getMusicList(){
            if(!this.topList.id){
                this.$router.push('/rank')
            }
            getMusicList(this.topList.id).then((res)=>{
                if(res.code === ERR_OK){
                    this.songs = this._normalizeSongs(res.songlist)
                }
            })
        },
        _normalizeSongs(list){
            let ret = []
            list.forEach((song) =>{
                if(song.data.songid && song.data.albumid){
                    ret.push(createSong(song.data))
                }
            })
            return ret
        }
    }
}
</script>
<style lang="stylus" scoped>
    .slide-enter-active, .slide-leave-active 
        transition: all .3s
    .slide-enter, .slide-leave-to
        transform translate3d(100%,0,0)
        opacity 0
</style>


