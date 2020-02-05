<!-- 共同的搜索框 (之前的组件冗余代码过多，现在重新整理出一个) -->
<template>
  <section class="CdtSearch">
    <el-form
      :inline="true"
      :model="searchForm"
    >
      <!-- 遍历form数据 -->
      <el-row>
        <el-col v-if="otherItem">
          <slot name="otherItem"></slot>
        </el-col>
        <el-col
          :span="item.span || (item.formType == 'time' ? 12 : 6)"
          v-for="(item, index) in filterFormList(formList)"
          :key="index"
        >
          <el-form-item
            size="mini"
            :label="item.label + '：'"
          >
            <!-- 判断form 的类型 -->
            <el-select
              v-model="searchForm[item.key]"
              :clearable="true"
              :filterable="item.fileter"
              v-if="item.formType == 'select'"
              :multiple="item.multiple"
              @change="change"
            >
              <el-option
                :label="item2.label"
                :value="item2.value"
                :key="item2.value"
                v-for="item2 in item.options"
              ></el-option>
            </el-select>

            <!-- 输入框 -->
            <el-input
              v-model.trim="searchForm[item.key]"
              :placeholder="item.placeholder"
              clearable
              v-if="item.formType == 'input'"
              @keyup.enter.native="keyupEnter()"
            ></el-input>

            <!-- 只能输入数字输入框 -->
            <el-input
              v-model.trim="searchForm[item.key]"
              :placeholder="item.placeholder"
              clearable
              v-if="item.formType == 'number'"
              :maxlength="item.maxlength"
              class="inputNumber"
              @keyup.enter.native="keyupEnter()"
              oninput="value=value.replace(/[^\d]/g,'')"
            ></el-input>

            <!-- 组合输入框 -->
            <el-input
              v-model.trim="searchForm[item.key]"
              :placeholder="item.placeholder"
              clearable
              v-if="item.formType == 'comboInput'"
              @keyup.enter.native="keyupEnter()"
            >
              <template slot="prepend">{{ item.prepend }}</template>
            </el-input>
            <!-- switch开关 -->
            <el-switch
              v-if="item.formType == 'switch'"
              v-model="searchForm[item.key]"
              :active-value="item.activeValue"
              :inactive-value="item.inactiveValue"
            ></el-switch>
            <span
              v-if="item.formType == 'switch'"
              style="margin-left: 20px"
            >{{ searchForm[item.key] === item.activeValue ? item.activeLabel : item.inactiveLabel}}</span>

            <!-- 多选框 -->
            <el-checkbox-group
              v-model="searchForm[item.key]"
              v-if="item.formType == 'checkbox' && searchForm[item.key] && searchForm[item.key].constructor == Array"
              @change="change"
            >
              <el-checkbox
                :label="item2.value"
                :key="item2.value"
                v-for="item2 in item.options"
              >{{ item2.label }}</el-checkbox>
            </el-checkbox-group>

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
              :type="item.datetype || 'daterange'"
              align="right"
              unlink-panels
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>

            <el-popover
              ref="glbmListPopover"
              placement="bottom-start"
              trigger="click"
              v-if="item.formType == 'tree'"
              v-model="visibleTreeObj[item.key]"
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
              <div
                class="dapartTree el-input el-input--mini el-popover__reference"
                slot="reference"
                @click="handleShow(item)"
              >
                <span class="el-input__inner text-overflow">
                  {{
                    (treeObj[item.key] && treeObj[item.key].label) ||
                      item.placeholder
                  }}
                </span>
              </div>
            </el-popover>
          </el-form-item>
        </el-col>
        <div
          v-if="isReset || isRefresh"
          class="handleBtn"
        >
          <el-button
            size="mini"
            type="info"
            v-if="isReset"
            @click="handleReset()"
            class="resetBtn"
          >重置
          </el-button>
          <el-button
            size="mini"
            type="primary"
            v-if="isRefresh"
            @click="handleRefresh()"
            class="refreshBtn"
          >刷新</el-button>
          <!-- 之前新增搜索，如果是搜索按钮的话，就取消自动监听搜索（刷新和查询不要同时存在） -->
          <el-button
            size="mini"
            type="primary"
            v-if="isSearch"
            @click="handleRefresh()"
            class="refreshBtn"
          >查询</el-button>
        </div>
      </el-row>
    </el-form>
  </section>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "CdtSearch",
  components: {},
  data() {
    return {
      glbmListTreeProps: {
        label: "dwjc",
        children: "children"
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      treeObj: {}, // 树对象
      clickTreeName: "", // 被选中的树
      visibleTreeObj: {},
      searchForm: {}
    };
  },
  computed: {
    ...mapGetters(["glbmList"])
  },
  watch: {
    searchForm: {
      handler(val) {
        if (!this.isSearch) {
          // 如果没有查询按钮，才执行监听
          clearTimeout(this.timeout); // 间隔监听
          this.timeout = setTimeout(() => {
            this.$emit("handleSearch", val);
          }, 300);
        }
      },
      deep: true
    },
    // 默认值赋值
    defaultData: {
      handler(val) {
        this.searchForm = val;
      },
      immediate: true,
      deep: true
    }
  },
  props: {
    formList: {
      // 搜索字段
      type: Array,
      default() {
        return [];
      }
    },
    otherItem: {
      // 是否有其他按钮槽
      type: Boolean,
      default() {
        return false;
      }
    },
    defaultData: {
      // 默认值
      type: Object,
      default() {
        return {};
      }
    },
    isRefresh: {
      type: Boolean,
      default() {
        return false;
      }
    },
    isReset: {
      type: Boolean,
      default() {
        return false;
      }
    },
    isSearch: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  methods: {
    change() {
      this.$forceUpdate();
    },

    // 部门树选中
    glbmListTreeCurrentChangeHandle(data, node) {
      this.treeObj[this.clickTreeName] = {};
      this.treeObj[this.clickTreeName].label = data.dwjc;
      this.treeObj[this.clickTreeName].value = data.dwdm;
      this.searchForm[this.clickTreeName] = data.dwdm;
      this.visibleTreeObj[this.clickTreeName] = false;
    },

    handleShow(val) {
      this.clickTreeName = val.key;
    },

    // 重置表单
    handleReset() {
      for (let key in this.searchForm) {
        if (this.searchForm[key]) {
          if (this.searchForm[key].constructor == Array) {
            this.searchForm[key] = [];
          } else if (this.searchForm[key].constructor == Object) {
            this.searchForm[key] = {};
          } else if (this.searchForm[key].constructor == String) {
            this.searchForm[key] = "";
          }
        } else {
          this.searchForm[key] = null;
        }
        this.treeObj[this.clickTreeName] = {};
      }
      for (let key in this.treeObj) {
        this.treeObj[key] = {};
      }
      this.$forceUpdate();
    },

    // 刷新
    handleRefresh() {
      this.$emit("handleSearch", this.searchForm);
    },

    // 过滤formList数据
    filterFormList(val) {
      return val.filter(item => {
        return this.searchForm[item] || !item.isHide;
      });
    },

    // 回车事件
    keyupEnter() {
      this.$emit("handleSearch", this.searchForm);
    }
  }
};
</script>

<style lang="scss">
.CdtSearch {
  position: relative;
  border-bottom: 2px solid #66b1ff;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 20px 20px 0;
  padding-bottom: 10px;
  height: auto;
  overflow: hidden;
  text-align: left;
  transition: height 0.2s;
  -moz-transition: height 0.2s; /* Firefox 4 */
  -webkit-transition: height 0.2s; /* Safari and Chrome */
  -o-transition: height 0.2s; /* Opera */
  .handleBtn {
    text-align: right;
    position: absolute;
    right: 0px;
    bottom: 15px;
  }
  .el-form-item {
    width: 100%;
    .el-input,
    .el-select {
      width: 100%;
    }
    .dapartTree {
      .el-input__inner {
        cursor: pointer;
        font-size: 12px;
      }
    }
    .inputNumber {
      .el-input__inner::-webkit-outer-spin-button,
      .el-input__inner::-webkit-inner-spin-button {
        -webkit-appearance: none;
      }

      .el-input__inner[type="number"] {
        -moz-appearance: textfield;
      }
    }
    .el-form-item__label {
      width: 100px;
      font-size: 12px;
    }
  }
  .el-form-item__content {
    width: auto;
  }
  .el-range-editor--small.el-input__inner {
    width: 100% !important;
  }
  .el-form-item__content {
    line-height: 32px !important;
  }
  .el-form {
    .el-form-item--mini.el-form-item {
      margin-bottom: 10px;
    }
  }
}
</style>
