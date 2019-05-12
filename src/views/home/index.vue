<style lang="scss">
#Home {
}
</style>

<template>
  <div id="Home">
      PC后端管理系统
  </div>
</template>
<script>
export default {
  name: "Home",
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
