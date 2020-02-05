// table 分页加载 mixin
export const PaginationTableMixin = {
  data() { 
    return {}
  },
  methods: {

    // 分页查询进行搜索
    $_PaginationTableMixin_handleFetchData(val) {
      this.defaultData.rows = val.rows;
      this.defaultData.page = val.page;
      this.fetchData();
    },
  },
}
