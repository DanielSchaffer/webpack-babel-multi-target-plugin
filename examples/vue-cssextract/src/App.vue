<template>
  <div id="app">
    <HelloWorld msg="vue-cssextract"/>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
    HelloWorld: () => import('./components/HelloWorld.vue')
  }
}
</script>

<style>
html,
body {
  background: green;
}
</style>
