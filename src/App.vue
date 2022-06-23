<template>
   <MediaSearch/>
</template>

<script>
import MediaSearch from '@/components/Music/MediaSearch.vue'

export default {
  name: 'App',
  components: {
    MediaSearch
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
