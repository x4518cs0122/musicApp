<template>
  <div class="progress-circle">
      <!-- viewBox表示从0 0 扩展到100 100 -->
    <svg :width="radius" :height="radius" viewBox="0,0,100,100" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <!-- 圆心 50 50 半径为50 的圆 -->
        <circle cx="50" cy="50" r="50" class="progress-background" />
        <circle cx="50" cy="50" r="50" class="progress-bar" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"/>
    </svg>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props:{
      radius:{
          type:Number,
          default:100
      },
      percent:{
          type:Number,
          default:0
      }
  },
  data(){
      return{
          dashArray: Math.PI * 100
      }
  },
  computed:{
      dashOffset(){
        return (1-this.percent)*this.dashArray
      }
  }
}
</script>
<style lang="stylus" scoped>
  @import "~common/stylus/variable"

    .progress-circle
        position relative
        circle
            stroke-width 8px
            transform-origin center
            &.progress-background
                transform scale(0.9)
                stroke: $color-theme-d
            &.progress-bar
                transform: scale(0.9) rotate(-90deg)
                stroke: $color-theme
</style>
