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
