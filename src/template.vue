<!-- 页面模板 -->
<style lang="scss">
#TemplateVue {
}
</style>

<template>
  <div id="TemplateVue"></div>
</template>
<script>
import Minix from '@/minix/Minix.js'
export default {
  name: "TemplateVue",
  components: {},
  data() {
    return {};
  },
  directives:{},
  computed: {},
  watch: {},
  minix: [Minix],
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
