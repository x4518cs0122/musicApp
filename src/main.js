import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import 'babel-polyfill'
import 'common/stylus/index.styl'
import VueLazyLoad from 'vue-lazyload'
import store from './store'

Vue.use(VueLazyLoad, {
    loading: require('./common/image/default.png')
})
fastclick.attach(document.body)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})