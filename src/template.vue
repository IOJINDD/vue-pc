<!-- 页面模板 -->
<style lang="scss">
#TemplateVue {
}
</style>

<template>
  <div id="TemplateVue"></div>
</template>
<script>
export default {
  name: "TemplateVue",
  components: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {},

  // 当keep-alive 激活时使用
  activated() {},
  mounted() {},
  beforeRouteEnter: (to, from, next) => {
    next(() => {});
  },
  beforeRouteLeave(to, from, next) {
    next();
  }
};
</script>
