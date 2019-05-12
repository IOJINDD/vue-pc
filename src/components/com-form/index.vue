<!-- 共同的form表单 -->
<style lang="scss">
.CdtForm {
  border-bottom: 2px solid #4a9bff;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 20px 20px 0;
  background: #fff;

  .el-form-item {
    width: 100%;
    .el-form-item__content {
      width: calc(100% - 150px);
    }
    .el-form-item__label {
      width: 120px;
    }
  }
  .el-autocomplete {
    width: 100%;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
  .treeLable {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 32px;
    line-height: 32px;
    outline: none;
    padding: 0 15px;
    -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
    font-size: 12px;
  }
}
</style>

<template>
  <section class="CdtForm">
    <el-form
      size="small"
      :inline="true"
      :model="formData"
      ref="formData"
      :rules="rules"
      :label-width="labelWidth + 'px'"
    >
      <!-- 遍历一行两条数据的form-->
      <el-row :gutter="24">
        <el-col :span="item.span || 24" v-for="(item, index) in formList" :key="index">
          <el-form-item :label="item.label">
            <!-- 判断form 的类型 -->
            <!-- 自定义搜索框 -->
            <el-autocomplete
              v-if="item.formType == 'autocomplete'"
              popper-class="my-autocomplete"
              v-model="formData[item.key]"
              :disabled="item.disabled"
              :fetch-suggestions="item.querySearch"
              :placeholder="item.placeholder"
              @select="item.handleSelect"
            >
              <i class="el-icon-edit el-input__icon" slot="suffix"></i>
              <template slot-scope="{ item }">
                <div class="name">{{ item.label }}</div>
              </template>
            </el-autocomplete>

            <!-- 选择框 -->
            <el-select
              v-if="item.formType == 'select'"
              v-model="formData[item.key]"
              filterable
              :disabled="item.disabled"
              @change="change"
            >
              <el-option
                :label="item2.label"
                :value="item2.value"
                :key="item2.value"
                :disabled="item.disabled"
                v-for="(item2) in item.options"
              ></el-option>
            </el-select>

            <!-- 输入框 -->
            <el-input
              v-if="item.formType == 'input'"
              v-model="formData[item.key]"
              :disabled="item.disabled"
              :maxlength="item.maxlength || 30"
              :placeholder="item.placeholder"
            ></el-input>

            <!-- 数字 -->
            <el-input
              v-if="item.formType == 'number'"
              type="number"
              v-model="formData[item.key]"
              :disabled="item.disabled"
              :placeholder="item.placeholder"
              :controls="false"
              :min="item.min || 1"
            ></el-input>

            <!-- 联动选择 -->
            <el-cascader
              v-if="item.formType == 'cascader'"
              :options="item.options"
              :props="item.props"
              :show-all-levels="false"
              :disabled="item.disabled"
              v-model="formData[item.key]"
            ></el-cascader>

            <!-- 日期时间范围 -->
            <el-date-picker
              v-if="item.formType == 'datetimerange'"
              :disabled="item.disabled"
              v-model="formData[item.key]"
              type="datetimerange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>

            <!-- 日期范围 -->
            <el-date-picker
              v-if="item.formType == 'daterange'"
              :disabled="item.disabled"
              v-model="formData[item.key]"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>

            <!-- 日期选择 -->
            <el-date-picker
              v-if="item.formType == 'date'"
              :disabled="item.disabled"
              v-model="formData[item.key]"
              align="right"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>

            <!-- 多选框 -->
            <el-checkbox-group
              v-if="item.formType == 'checkbox'"
              v-model="formData[item.key]"
              :disabled="item.disabled"
            >
              <el-checkbox
                v-for="(item2) in item.options"
                :label="item2.value"
                :key="item2.value"
              >{{ item2.label }}</el-checkbox>
            </el-checkbox-group>

            <!-- 单选框 -->
            <el-radio-group
              v-if="item.formType == 'radio'"
              v-model="formData[item.key]"
              :disabled="item.disabled"
            >
              <el-radio
                v-for="(item2) in item.options"
                :label="item2.value"
                :key="item2.value"
              >{{ item2.label }}</el-radio>
            </el-radio-group>

            <!-- switch开关 -->
            <el-switch
              :disabled="item.disabled"
              v-if="item.formType == 'switch'"
              v-model="formData[item.key]"
              active-value="1"
              inactive-value="0"
            ></el-switch>

            <!-- 文本 -->
            <el-input
              v-if="item.formType == 'textarea'"
              :disabled="item.disabled"
              :maxlength="item.maxlength || 200"
              type="textarea"
              :placeholder="item.placeholder"
              v-model="formData[item.key]"
            ></el-input>

            <el-popover
              ref="glbmListPopover"
              placement="bottom-start"
              trigger="click"
              :disabled="item.disabled"
              v-if="item.formType == 'tree'"
              v-model="formData[item.show]"
            >
              <el-tree
                :data="glbmList"
                :props="glbmListTreeProps"
                node-key="glbm"
                ref="glbmListTree"
                default-expand-all
                @current-change="glbmListTreeCurrentChangeHandle"
                :highlight-current="true"
                :expand-on-click-node="false"
              ></el-tree>
              <div slot="reference" @click="handleShow(item)" class="treeLable">
                {{ (treeObj[item.show] && treeObj[item.show].label) || item.placeholder }}
              </div>
            </el-popover>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "CdtForm",
  components: {},
  data() {
    return {
      index: 0,
      formData: {},
      restaurants: [],
      glbmListTreeProps: {
        label: "dwjc",
        children: "xjbm"
      },
      treeObj: {

      }, // 树对象
      clickTreeName: '', // 被选中的树
    };
  },
  computed: {
    ...mapGetters(["resetFormFlag", "glbmList"])
  },
  watch: {
    // 重置表单内容
    resetFormFlag: {
      handler(val) {
        if (this.$refs.formData) {
          for (let key in this.formData) {
            if (this.formData[key]) {
              if (this.formData[key].constructor == Array) {
                console.log("this.formData[key]", this.formData[key]);
                this.formData[key] = [];
              } else if (this.formData[key].constructor == Object) {
                this.formData[key] = {};
              } else if (this.formData[key].constructor == String) {
                this.formData[key] = "";
              }
            } else {
              this.formData[key] = null
            }
          }
          this.treeObj = {}
        }
      },
      immediate: true,
      deep: true
    },

    glbmList: {
      handler(val) {
        console.log("val", val);
      },
      immediate: true,
      deep: true
    },

    // 传递form表单数据
    formData: {
      handler(val) {
        let formData = val
        
        // 解析tree数据
        for (let key in this.treeObj) {
          formData[key.replace('TreeShow','')] = this.treeObj[key].value
        }
        this.$emit("formData", formData);
      },
      immediate: true,
      deep: true
    },

    // 如果有值 就赋值
    data: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.formData = val;
          })
        }
      },
      immediate: true,
      deep: true
    },
  },
  props: {
    formList: {
      // 表单数据
      type: Array
    },
    labelWidth: {
      type: Number, // label宽度
      default() {
        return 150;
      }
    },
    rules: {
      type: Object
    },
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    change() {
      this.$forceUpdate();
    },

    // 设置数组
    setArray(val) {
      val.forEach((item, index) => {
        if (item.formType == "checkbox") {
          this.$set(this.formData, item.key, []);
        }
      });
    },

    // 部门树选中
    glbmListTreeCurrentChangeHandle(data, node) {
      this.treeObj[this.clickTreeName].label = data.dwjc
      this.treeObj[this.clickTreeName].value = data.dwdm
      this.formData[this.clickTreeName] = false
    },

    handleShow (val) {
      this.clickTreeName = val.show
      this.treeObj[this.clickTreeName] = {}
    }
  },
  mounted() {}
};
</script>
