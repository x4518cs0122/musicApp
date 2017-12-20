<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
      <div class="progress-inner">
          <div class="progress" ref="progress"></div>
          <div class="progress-btn-wrapper" ref="progressBtn"
                @touchstart.prevent = "progressTouchStart"
                @touchmove.prevent = "progressTouchMove"
                @touchend.prevent = "progressTouchEnd"
            >
            <!-- prevent用于预防浏览器默认行为 -->
              <div class="progress-btn"></div>
          </div>
      </div>
  </div>
</template>
<script>
import {prefixStyle} from 'common/js/dom'

const progressBtnWidth = 16
const transform = prefixStyle('transform')

export default {
  props:{
      percent:{
          type: Number,
          default: 0
      }
  },
  created(){
      this.touch = {}
  },
  methods:{
    _offset(offsetWidth){
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
     },
     progressTouchStart(e){
         this.touch.initState = true
         this.touch.startX = e.touches[0].pageX
         this.touch.left = this.$refs.progress.clientWidth
     },
     progressTouchMove(e){
         if(!this.touch.initState){
             return 
         }
         const deltaX = e.touches[0].pageX - this.touch.startX
         const offsetWidth = Math.min(Math.max(0,this.touch.left+deltaX),this.$refs.progressBar.clientWidth - progressBtnWidth) 
         this._offset(offsetWidth) 
     },
     progressTouchEnd(e){
         this.touch.initState = false
         this._triggerPercent()
     },
     _triggerPercent(){
         const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
         const percent = this.$refs.progress.clientWidth /barWidth
         this.$emit('percentChange',percent)
     },
     progressClick(e){
         let offsetLeft =this.$refs.progressBar.getBoundingClientRect()
         let offsetWidth = e.pageX - offsetLeft.left-progressBtnWidth/2
         this._offset(offsetWidth)
         this._triggerPercent()
        
     }
  },
  watch:{
      percent(newPercent){
          if(newPercent>=0 && !this.touch.initState){
              const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
              const offsetWidth = barWidth*newPercent
              this._offset(offsetWidth)
          }
      }
  }
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable"

    .progress-bar
        height 30px
        .progress-inner
            position: relative
            top: 13px
            height: 4px
            background: rgba(0, 0, 0, 0.3)
            border-radius 4px
            .progress
                position: absolute
                border-radius 4px
                height 100%
                background $color-theme
            .progress-btn-wrapper
                position: absolute
                left: -8px
                top: -13px
                width: 30px
                height: 30px 
                .progress-btn
                    position: relative
                    top: 7px
                    left: 7px
                    box-sizing: border-box
                    width: 16px
                    height: 16px
                    border: 3px solid $color-text
                    border-radius: 50%
                    background: $color-theme
</style>
