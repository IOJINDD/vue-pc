<style lang="scss">
.CdtTable {
  .toolBar {
    padding: 6px 2px;
    background: #f6f6f6;
    overflow: hidden;
    .el-icon-download,
    .el-icon-setting{
      margin: 0 8px;
      font-size: 22px;
      line-height: 28px;
      color: #7fb8ff;
    }
    .el-icon-download{
      font-weight: bold;
    }
    .el-icon-setting{
      padding-right: 6px;
    }
  }
  .block {
    .el-pagination {
      background: #fff;
      padding: 12px 20px;
      text-align: right;
      // border-top: 1px solid #ddd;
    }
  }
  .tableData {
    min-height: 400px;
  }
  .el-table th,
  .el-table td {
    text-align: center;
  }
  .floatL {
    min-width: 50%;
  }
}
</style>

<template>
  <section class="CdtTable">
    <div class="toolBar hidden"  v-if="toolBar">
      <!-- 按钮插槽 -->
      <div class="floatL">
        <slot name="toolBar"></slot>
      </div>
      <div class="floatR">
        <el-tooltip content="导出清单"><i class="el-icon-download" @click="handleExport" v-if="download"></i></el-tooltip>
        <el-popover
          placement="bottom"
          title="展示列控制"
          width="200"
          trigger="click">
          <el-checkbox-group v-model="displayList" @change="onCheckboxChange">
            <el-checkbox v-for="item in columns" :label="item" :key="item.key">{{item.title}}</el-checkbox>
          </el-checkbox-group>
          <el-tooltip content="展示列控制" slot="reference"><i class="el-icon-setting floatR"></i></el-tooltip>
        </el-popover>
        </div>
    </div>
    <el-table
      size="small"
      ref="tableRef"
      :data="tableData"
      style="width: 100%"
      class="tableData"
      tooltip-effect="dark"
      @row-click="handleRow" 
      :height="height"
      :summary-method="getTotal"
      @selection-change="handleSelectChange"
      v-if="displayListRefresh"
    >
      <el-table-column type="selection" width="55" v-if="selection"></el-table-column>
      <el-table-column  label="序号" width="80" fixed :show-overflow-tooltip="false">
        <template slot-scope="scope">
          <span v-if="listQuery.rows">{{ listQuery.rows * (listQuery.page - 1) + scope.$index + 1 }}</span>
          <span v-if="!listQuery.rows">{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>

      <!-- 其他属性栏插槽 -->
      <slot name="otherColumn"></slot>

      <!-- 常用属性栏 -->
      <el-table-column
        v-for="(item) in displayList"
        :label="item.title"
        :width="item.width"
        :key="item.title"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span v-if="item.render">{{ item.render(scope.row) }}</span>
          <span v-if="!item.render">{{ scope.row[item.key] || noMessage }}</span>
        </template>
      </el-table-column>

      <!-- 按钮插槽 -->
      <slot name="buttonColumn" class="text-center"></slot>
    </el-table>
    <div class="block" v-if="pagination">
      
      <!-- 分页插槽 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.page"
        :page-sizes="[10, 15, 20, 50]"
        :page-size="listQuery.rows"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </section>
</template>
<script>
import { tableToXls } from "@/utils/tool.js";
export default {
  name: "CdtTable",
  components: {},
  data: function() {
    return {
      displayList: [],
      displayListRefresh: true,
      listQuery: {
        page: 1,
        rows: 10,
      }
    };
  },
  computed: {},
  watch: {
    columns: {
      handler (val) {
        this.displayList = val.filter((x) => {
          return !x.hidden
        })
      },
      immediate: true,
      deep: true
    }
  },
  props: {
    tableData: {
      // 表单内的数据
      type: Array
    },
    columns: {
      // 表单内的属性
      type: Array
    },
    download: {
      // 是否显示下载按钮
      type: Boolean,
      default() {
        return true;
      }
    },
    selection: {
      // 是否有选择框，默认无
      type: Boolean,
      default() {
        return false;
      }
    },
    toolBar: {
      //默认有
      type: Boolean,
      default() {
        return true;
      }
    },
    height: {
      type: String,
      default() {
        return null;
      }
    },
    noMessage: {
      type: String,
      default() {
        return "暂无";
      }
    },
    pagination: {
      // 是否有分页
      type: Boolean,
      default () {
        return true
      }
    },
    total: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  methods: {

    // 获取选中项
    handleSelectChange(val) {
      this.$emit("multipleSelection", val);
    },

    // 点击某一行
    handleRow(val) {
      this.$emit("row-click", val);
    },

    // 全部选中
    init() {
      this.$refs.tableRef.toggleAllSelection();
    },
    
    //展示列勾选
    onCheckboxChange() {
      this.displayListRefresh = false;
      setTimeout(() => {
        this.displayListRefresh = true;
      }, 0);
      console.log("onCheckboxChange", this.displayList);
    },

    // 默认选择
    toggleRowSelection (val) {
      this.$refs.tableRef.toggleRowSelection(val, true)
    },

    //下载
    
    // 导出清单
    handleExport() {
      let dataList = [];
      let header = [];
      for (var item of this.displayList) {
        header.push(item.title);
      }
      dataList.push(header);
      this.tableData.forEach((ele, index) => {
        let contentItem = [];
        this.displayList.forEach((ele2, index2) => {
          contentItem.push(ele[ele2.key] || '暂无')
        })
        dataList.push(contentItem)
      })
      tableToXls(dataList, this.$route.meta.title);
    },

    handleSizeChange(val) {
      this.listQuery.rows = val;
      this.$emit("fetchData", this.listQuery);
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.$emit("fetchData", this.listQuery);
    },

    // 自定义合计列
    getTotal(param) {
      const { columns, data } = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (column.property) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index];
        } else {
          sums[index] = "--";
        }
      });

      return sums;
    }
  },
  mounted() {
    
  }
};
</script>
