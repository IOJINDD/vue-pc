<!-- 共同的搜索框 -->
<style lang="scss">
.CdtSearch {
  position: relative;
  border-bottom: 2px solid #4a9bff;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 20px 20px 0;
  background: #fff;
  height: auto;
  overflow: hidden;

  transition: height 0.2s;
  -moz-transition: height 0.2s; /* Firefox 4 */
  -webkit-transition: height 0.2s; /* Safari and Chrome */
  -o-transition: height 0.2s; /* Opera */

  .el-form-item {
    .el-form-item__label {
      width: 100px;
    }
    .el-input,
    .el-select {
      width: 150px;
    }
  }

  .btn-group {
    margin-left: 20px;
  }
  .flexBtn {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    color: #999;
    font-size: 12px;
    line-height: 24px;
    background: #fff;
    &:hover {
      color: #409eff;
    }
  }
}
</style>

<template>
  <section class="CdtSearch" :style="(flex && close) ? styleObj1 : styleObj2">
    <el-form :inline="true" :model="searchForm" class="searchForm">
      <!-- 遍历form数据 -->
      <el-form-item size="small" :label="item.label" v-for="(item, index) in formList" :key="index">
        <!-- 判断form 的类型 -->
        <el-select v-model="searchForm[item.key]" v-if="item.formType == 'select'" @change="change">
          <el-option
            :label="item2.label"
            :value="item2.value"
            :key="item2.value"
            v-for="(item2) in item.options"
          ></el-option>
        </el-select>

        <el-input
          v-model.trim="searchForm[item.key]"
          :placeholder="item.placeholder"
          v-if="item.formType == 'input'"
        ></el-input>

        <!-- switch开关 -->
        <el-switch
          v-if="item.formType == 'switch'"
          v-model="searchForm[item.key]"
          active-value="1"
          inactive-value="0"
        ></el-switch>

        <el-cascader
          v-if="item.formType == 'cascader'"
          :options="item.options"
          :props="item.props"
          :show-all-levels="false"
          v-model="searchForm[item.key]"
        ></el-cascader>
        <el-date-picker
          v-if="item.formType == 'time'"
          v-model="searchForm[item.key]"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>

        <el-popover
          ref="glbmListPopover"
          placement="bottom-start"
          trigger="click"
          v-if="item.formType == 'tree'"
          v-model="visible_tree"
        >
          <el-tree
            :data="glbmList"
            :props="glbmListTreeProps"
            node-key="glbm"
            ref="glbmListTree"
            @current-change="glbmListTreeCurrentChangeHandle"
            :default-expand-all="false"
            :highlight-current="true"
            :expand-on-click-node="false"
          ></el-tree>
        </el-popover>
        <el-input
          v-if="item.formType == 'tree'"
          v-model="searchForm[item.key]"
          v-popover:glbmListPopover
          :readonly="true"
          :placeholder="item.placeholder"
          :disabled="item.disabled"
        ></el-input>
      </el-form-item>

      <el-form-item size="small" class="btn-group">
        <el-button size="small" type="success" @click="handleReset()" class="resetBtn" v-if="formList.length > 0">重置</el-button>
        <el-button size="small" type="primary" @click="handleRefresh()" class="refreshBtn">刷新</el-button>
      </el-form-item>

      <el-form-item>
        <!-- 其他按钮插槽 -->
        <slot name="otherButton"></slot>
      </el-form-item>
    </el-form>

    <!-- 重置搜索条件 -->

    <div class="flexBtn" v-if="flex">
      <span v-if="close" @click="close=false">
        <i class="el-icon-caret-bottom"></i>条件展开
      </span>
      <span v-else @click="close=true">
        <i class="el-icon-caret-top"></i>条件收起
      </span>
    </div>
  </section>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "CdtSearch",
  components: {},
  data() {
    return {
      flex: false,
      close: true,
      styleObj1: { height: "118px" }, //折叠时的样式
      styleObj2: {}, //条件展开时的样式
      screenWidth: document.body.clientWidth,
      glbmListTreeProps: {
        label: "dwjc",
        children: "xjbm"
      },
      visible_tree: false
    };
  },
  computed: {
    ...mapGetters(["searchForm", "glbmList"])
  },
  watch: {
    searchForm: {
      handler(val) {
        for(var item in val){
          if(val[item] === ""){
            val[item] = null
          }
        }
        console.log('val', val);
        this.$emit("handleSearch", val);
      },
      deep: true
    },
    formList: {
      handler(val) {},
      deep: true
    },
    close: {
      handler(val) {
        if (!val) {
          let searchFormH = document.getElementsByClassName("searchForm")[0]
            .offsetHeight;
          this.styleObj2.height = searchFormH + 12 + "px";
        }
      }
    },
    flex: {
      handler(val) {
        if (val) {
          let searchFormH = document.getElementsByClassName("searchForm")[0]
            .offsetHeight;
          this.styleObj2.height = searchFormH + 12 + "px";
          document.getElementsByClassName("resetBtn")[0].style.bottom = "35px";
          document.getElementsByClassName("refreshBtn")[0].style.bottom =
            "35px";
        } else {
          document.getElementsByClassName("resetBtn")[0].style.bottom = "20px";
          document.getElementsByClassName("refreshBtn")[0].style.bottom =
            "20px";
        }
      }
    },
    screenWidth: {
      handler() {
        let searchFormH = document.getElementsByClassName("searchForm")[0]
          .offsetHeight;
        if (searchFormH > 124) {
          this.flex = true;
        } else {
          this.flex = false;
          this.styleObj2.height = "auto";
        }
      }
    }
  },
  props: {
    formList: {
      // 搜索字段
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    // 执行搜索
    handleSearch() {
      this.$emit("handleSearch", this.searchForm);
    },

    change() {
      this.$forceUpdate();
      this.$emit("handleSearch", this.searchForm);
    },

    // 部门树选中
    glbmListTreeCurrentChangeHandle(data, node) {
      this.searchForm.glbm = data.dwdm;
      this.searchForm.glbmmc = data.dwjc;
      this.$emit("handleSearch", this.searchForm);
      this.visible_tree = false;
    },

    // 重置表单
    handleReset() {
      for (let key in this.searchForm) {
        this.searchForm[key] = null;
      }
      this.$forceUpdate();
      this.$emit("handleSearch", this.searchForm);
    },

    // 刷新
    handleRefresh() {
      this.$emit("handleSearch", this.searchForm);
    }
  },
  mounted() {
    for (let key in this.searchForm) {
      this.searchForm[key] = null;
    }
    let searchFormH = document.getElementsByClassName("searchForm")[0]
      .offsetHeight;
    if (searchFormH > 124) {
      this.flex = true;
    }

    const that = this;
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
      })();
    };
  }
};
</script>
