<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  components: {},
  provide() {
    return {
    };
  },
  data() {
    return {
    };
  },
  methods: {
  }
};
</script>

<style>
@import "./assets/css/main.css";
@import "./assets/css/color-dark.css"; /*深色主题*/
/*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
