<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots" :key="index"></span>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
import {addClass} from 'common/js/dom'
export default {
    props:{
        loop:{
            type:Boolean,
            default:true
        },
        autoplay:{
            type:Boolean,
            default:true
        },
        interval:{
            type:Number,
            default:4000
        }
    },
    data(){
        return{
            dots:[],
            currentPageIndex:0,
        }
    },
    mounted(){
        setTimeout(()=>{
            this._setSliderWidth(false)
            this._initdots()
            this._initSlider()
            if(this.autoplay){
                this._play()
            }
        }, 20);

        window.addEventListener('resize',()=>{
            if(!this.slider){
                return
            }
            this._setSliderWidth(true)
            this.slider.refresh()
        })
    },
    methods:{
        _setSliderWidth(isResize){
            this.child = this.$refs.sliderGroup.children
            let width = 0
            let sliderWidth = this.$refs.slider.clientWidth
            for (var i=0;i<this.child.length;i++){
                let child = this.child[i]
                addClass(child,'slider-item')
                child.style.width = sliderWidth+'px'
                width += sliderWidth
            }
            // 循环的时候会默认在头和尾拷贝一个页面，保证无缝循环，所以需要将width加2个页面宽度
            if(this.loop&&!isResize){
                width +=2*sliderWidth
            }
            this.$refs.sliderGroup.style.width = width +'px'
        },
        _initdots(){
            this.dots = new Array(this.child.length)
        },
        _play(){
            let pageIndex = this.currentPageIndex +1
            if (this.loop){
                pageIndex +=1
            }
            this.timer = setTimeout(()=>{
                this.slider.goToPage(pageIndex,0,400)
            },this.interval)

        },
        _initSlider(){
            this.slider = new BScroll('.slider',{
                scrollX:true,
                scrollY:true,
                momentum:true,
                snap: {loop: this.loop,threshold: 0.3,speed:400},
                tab:true
            })

            this.slider.on('scrollEnd',()=>{
                let pageIndex = this.slider.getCurrentPage().pageX
                if(this.loop){
                    pageIndex -=1
                }
                this.currentPageIndex = pageIndex
                
                if(this.autoplay){
                    clearTimeout(this.timer)
                    this._play()
                }
            })
        }
    },
    destroyed(){
        clearTimeout(this.timer)
    }
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
            display: block
            width: 100%
            overflow: hidden
            text-decoration: none
        img
            display: block
            width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
