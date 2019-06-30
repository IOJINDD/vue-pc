<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive && isRouterAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive && isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  components: {},
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  methods: {
    // 刷新当前页
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    }
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
