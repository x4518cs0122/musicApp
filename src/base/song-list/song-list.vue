<template>
  <div class="song-list">
      <ul>
          <li v-for="(song,index) in songs" :key="index" class="item" @click="selectItem(song,index)">
                <div class="rank" v-show="rank">
                    <span :class="getRankCls(index)" >{{getRankText(index)}}</span>         
                </div>
                <div class="content">
                    <h2 class="name">{{song.name}}</h2>
                    <p class="desc">{{getDesc(song)}}</p>
                </div>
          </li>
      </ul>
  </div>
</template>
<script>
export default {
  props:{
      songs:{
          type:Array,
          default:[]
      },
      rank:{
          type:Boolean,
          default:false
      }
  },
  methods:{
      getDesc(song){
          return `${song.singer} . ${song.album}`
      },
      selectItem(item,index){
          this.$emit('select',item,index)
      },
      getRankCls(index){
          if(index<=2){
              return `icon icon${index}`
          }
          return 'icon'
      },
      getRankText(index){
          if(index>2){
              return index+1
          }
          return ''
      } 
  }
}
</script>
<style lang="stylus" scoped>
 @import "~common/stylus/variable"
@import "~common/stylus/mixin"

    .song-list
        .item
            display flex
            height 64px
            align-items center
            box-sizing border-box
            font-size $font-size-medium
            // border-bottom 1px solid $color-text-d
            .rank
                flex: 0 0 25px
                width: 25px
                margin-right: 30px
                text-align: center
                .icon
                    display: inline-block
                    width: 25px
                    height: 24px
                    background-size: 25px 24px
                    &.icon0
                        bg-image('first')
                    &.icon1
                        bg-image('second')
                    &.icon2
                        bg-image('third')
                .text
                    color: $color-theme
                    font-size: $font-size-large
            .content
                flex 1
                line-height 20px
                overflow hidden
                .name
                    no-wrap()
                    color $color-text
                .desc 
                    color $color-text-d
                    no-wrap()
</style>
