// 搜索框 mixin 
export const SearchFormMixin = {
  data() {
    return {
      defaultData: {}
    }
  }, 
  computed: {},
  methods: {

    // 搜索框进行搜索
    $_SearchFormMixin_handleSearch(val) {
      this.fetchData();
    },

    $_SearchFormMixin_filterSearch(val) {
      // 过来搜索条件
      if (this.$route.query && this.$route.query.noSearch && this.$route.query.noSearch.split(";").length > 0) {
        let noSearch = this.$route.query.noSearch.split(";");
        noSearch.forEach((item, index) => {
          val.forEach((item2, index2) => {
            if (item.split(",")[0] === item2.key) {
              val.splice(index2, 1);
              return;
            }
          });
          this.defaultData[item.split(",")[0]] = item.split(",")[1];
        });
        console.log('defaultData', this.defaultData);
      }
      return val;
    },
  }
}
