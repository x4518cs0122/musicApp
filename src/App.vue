<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
  import MHeader from 'components/header/header'
  import tab from 'components/tab/tab'
  import player from 'components/player/player'
  import playlist from 'components/playlist/playlist'

export default {
  name: 'app',
  components:{
    MHeader,
    tab,
    player,
    playlist
  }
}
</script>

<style>

</style>
