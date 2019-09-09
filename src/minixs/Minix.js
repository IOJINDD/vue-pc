export const listMixin = {
  data() {
    return {
      totalElements: 0,
      tableData: [],
      multipleSelection: []
    };
  },
  components: {},
  computed: {},
  watch: {},
  methods: {
    // 分页获取数据
    $_listMixin_handlefetchData(val) {
      this.listQuery.rows = val.rows;
      this.listQuery.page = val.page;
      this.fetchData();
    },

    // 获取选择项
    $_listMixin_getSelectData(val) {
      this.multipleSelection = val;
    },

    $_listMixin_handleDialog(type, name) {
      console.log('name', name);
      if (type == "add") {
        this.$refs.addDialog.open();
      } else if (type == "modify") {
        this.$refs.modifyDialog.open(name);
      }
    },

    // 获取修改弹出框内容
    $_listMixin_getModifyDialogResult() {
      this.fetchData()
    },

    // 获取新增弹出框内容
    $_listMixin_getAddDialogResult() {
      this.fetchData()
    },

    // 搜索
    $_listMixin_handleSearch(val) {
      this.listQuery.page = 1;
      for (let key in this.listQuery) {
        if (key != 'page' && key != 'size')
          this.listQuery[key] = val[key];
      }
      this.fetchData();
    },
    // 删除单行
    $_listMixin_handleDelete(val) {
      console.log('val', val);
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.delData(val.id)
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 删除多行
    $_listMixin_handleDeleteMultiline() {
      if (this.multipleSelection.length > 0) {
        this.common.deleteConfirm(() => {
          console.log('multipleSelection', this.multipleSelection);
          this.delData(this.multipleSelection)
        });
      } else {
        this.$message({
          message: "请选择至少选择一条数据！",
          type: "warning"
        });
      }
    }
  },

  // 当keep-alive 激活时使用
  activated() {},
  mounted() {},
  beforeRouteEnter: (to, from, next) => {
    next((vm) => {
      vm.fetchData();
    });
  },
  beforeRouteLeave(to, from, next) {
    next();
  }
};

export const dialogMixin = {
  data() {
    return {
      dialogVisible: false, // 
      formData: {}, // 表单数据
      multipleSelection: []
    };
  },
  components: {},
  computed: {},
  watch: {
    // 监听弹出来，重置form
    dialogVisible: function (val) {
      this.$store.commit("SET_resetFormFlag", val);
    },
  },
  methods: {

    // 获取表单数据
    $_dialogMixin_fetchFormData(val) {
      this.formData = val;
    },

    change() {
      this.$forceUpdate();
    }
  },

  // 当keep-alive 激活时使用
  activated() {},
  mounted() {},
  beforeRouteEnter: (to, from, next) => {
    next(() => {

    });
  },
  beforeRouteLeave(to, from, next) {
    next();
  }
};
