<!-- 页面模板 -->
<style lang="scss">
#Demo {
}
</style>

<template>
  <div id="Demo">
    一个新的页面
  </div>
</template>
<script>
export default {
  name: "Demo",
  components: {},
  data() {
    return {};
  },
  directives:{},
  computed: {},
  watch: {},
  methods: {},
  mounted() {},
  beforeRouteEnter: (to, from, next) => {
    next(() => {});
  },
  beforeRouteLeave(to, from, next) {
    next();
  }
};
</script>
