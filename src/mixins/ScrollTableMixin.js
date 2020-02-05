import { mapGetters } from "vuex";

// table下拉滚动加载 mixin
export const ScrollTableMixin = {
  data() {
    return {
      total: 0,
      tableData: [],
      isLeave: false,
      isLoad: false, // 是否在加载
    }
  },
  computed: {
    ...mapGetters(['sysConfigData']),
    disabled () {
      // console.log('this.isLoad || this.tableData.length >= this.total', this.isLoad || this.tableData.length >= this.total);
      return this.isLoad || this.tableData.length >= this.total || this.isLeave
    }
  },
  methods: {
    $_ScrollTableMixin_handleSearch(val) {
      //更新查询条件
      this.listQuery.page = 1;
      this.listQuery.rows = 100;
      for (let key in val) {
        if (key === "time") {
          this.listQuery["startTime_start"] = val["time"] ?
            new Date(val["time"][0].getTime()).format("yyyy-MM-dd hh:mm:ss") :
            null;
          this.listQuery["startTime_end"] = val["time"] ?
            new Date(val["time"][1].getTime()).format("yyyy-MM-dd hh:mm:ss") :
            null;
        } else {
          this.listQuery[key] = val[key];
        }
      }
      this.$_ScrollTableMixin_fetchData();
    },

    // 获取初始数据
    $_ScrollTableMixin_fetchData() {
      this.fetchService(this.listQuery).then(res => {
        this.tableData = res.data.rows;
        this.total = res.data.total;
      });
    }, 

    // 获取更多数据
    $_ScrollTableMixin_fetchMoreData() {
      this.isLoad = true;
      this.listQuery.page++;
      this.fetchService(this.listQuery).then(res => {
        res.data.rows.forEach(item => {
          this.tableData.push(item);
        });
        this.isLoad = false
      });
    },
 
    // 下来监听
    $_ScrollTableMixin_load() {
      let scrollTop = document.querySelector(".el-scrollbar__wrap").scrollTop;
      let scrollHeight = document.querySelector(".el-scrollbar__wrap")
        .scrollHeight;
      let clientHeight = document.querySelector(".el-scrollbar__wrap")
        .clientHeight;
        // console.log('scrollTop', scrollTop);
      if (scrollTop > 130 || (scrollTop > 90 && scrollTop < 110)) {
        document.querySelector(".el-table__header").style.position = "fixed";
        document.querySelector(".el-table__header").style.top = this.sysConfigData.mon_sys_tag_view === 'true' ? '116px' : "76px";
        document.querySelector(".el-table__header").style.zIndex = "999";
      } else {
        document.querySelector(".el-table__header").style.position = "relative";
        document.querySelector(".el-table__header").style.top = "0px";
      }

      if (scrollTop + clientHeight > scrollHeight - 400 && !this.isLoad) {
        this.$_ScrollTableMixin_fetchMoreData();
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    this.isLeave = true
    next();
  }
}
