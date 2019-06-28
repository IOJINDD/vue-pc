export default {
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
