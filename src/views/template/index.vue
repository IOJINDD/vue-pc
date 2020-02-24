<!-- 列表模板 -->
<template>
  <div id="ListTemplate">
    <!-- 搜索框 -->
    <cdt-search-new
      :formList="searchFormList"
      isReset
      isRefresh
      :defaultData="defaultData"
      @handleSearch="$_SearchFormMixin_handleSearch"
    >
    </cdt-search-new>

    <!-- 列表 -->
    <cdt-table-new
      :tableData="tableData"
      :columns="columns"
      :total="total"
      toolBar
      @fetchData="$_PaginationTableMixin_handleFetchData"
    >
      <div slot="toolBar">
        <el-button
          type="text"
          icon="el-icon-circle-plus"
          @click="handleDialog('add', {})"
          size="mini"
        >新增</el-button>
      </div>
      <div slot="buttonColumn">
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="250"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-view"
              @click.native="handleDialog('detail', scope.row)"
              size="mini"
            >详情</el-button>
            <el-button
              type="text"
              icon="el-icon-edit"
              @click.native="handleDialog('edit', scope.row)"
              size="mini"
            >编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-remove-outline"
              @click.native="handleDelete(scope.row)"
              size="mini"
            >删除</el-button>
          </template>
        </el-table-column>
      </div>
    </cdt-table-new>

    <!-- 弹出框 -->
    <template-dialog ref="TemplateDialog" />
  </div>
</template>   
<script> 
import { SearchFormMixin } from "@/mixins/SearchFormMixin.js";
import { PaginationTableMixin } from "@/mixins/PaginationTableMixin.js";
import TemplateDialog from "./components/TemplateDialog"; // 新增修改详情 的组件弹窗
import { TemplateQueryUrl, TemplateDeleteUrl } from "@/api/service.js"; // 接口引用 TemplateQueryUrl是列表分页的接口，TemplateDeleteUrl这个是删除的接口
export default {
  name: "ListTemplate",
  components: {
    TemplateDialog
  },
  data() {
    return {
      defaultData: {},  // 查询条件
      searchFormListSelf: [], // 搜索参数
      columns: [], // 列表属性栏
      tableData: [],
      total: 0 // 总数
    };
  },
  computed: {
    searchFormList: function() {
      // 设置默认搜索参数
      return this.$_SearchFormMixin_filterSearch(this.searchFormListSelf);
    }
  }, 
  watch: {},
  mixins: [SearchFormMixin, PaginationTableMixin], // 公用部分
  methods: {
    // 获取数据
    fetchData() {
      this.common.DelayCall(() => {
        TemplateQueryUrl(this.defaultData).then(res => {
          this.common.CheckCode(res, null, () => {
            this.tableData = res.data.rows;
            this.total = res.data.total;
          });
        });
      })
    },

    // 打开 新增，详情，编辑弹出框
    handleDialog(type, val) { 
      this.$refs.TemplateDialog.open(type, val);
    },

    // 删除
    handleDelete(val) {
      this.common.handleConfirm(() => {
        TemplateDeleteUrl({
          id: val.id,
          zt: 0
        }).then(res => {
          this.common.CheckCode(res, "删除成功", () => {
            this.fetchData();
          });
        });
      })
    }
  },
  mounted() {}
};
</script>
<style lang="scss">
</style>
