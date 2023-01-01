<template>
  <router-view></router-view>
</template>

<script>

export default {
  name: 'App',
  computed: {
    width() {
      return window.innerWidth;
    },
    height() {
      return window.innerHeight;
    },
    squareSize() {
      if (this.$route.params.squareSize) {
        return parseInt(this.$route.params.squareSize);
      }
      return 40;
    },
    type() {
      if (this.$route.params.type) {
        if (this.$route.params.type === "berggren") {
          return "berggren";
        }
      }
      return "normal";
    }
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
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
body {
  margin: 0;
}
</style>
