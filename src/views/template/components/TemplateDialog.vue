<!-- 弹出框模板 -->
<template>
  <section>
    <el-dialog
      :title="title"
      width="80%"
      custom-class="TemplateDialog"
      top="5vh"
      :visible.sync="dialogVisible"
    >
      <cdt-form-new
        v-if="dialogVisible"
        :formList="formList"
        :defaultData="defaultData"
        ref="cdtForm"
      >
      </cdt-form-new>
      <div
        slot="footer"
        class="dialog-footer dailog-bottom-btn"
        v-if="dialogType !== 'detail'"
      >
        <el-button @click="init()">重置</el-button>
        <el-button type="primary" @click="submit()">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import { TemplateDetail, TemplateAdd, TemplateEdit } from "@/api/service.js"; // TemplateDetail 详情，TemplateAdd 新增，TemplateEdit 删除
export default {
  name: "TemplateDialog",
  components: {},
  data() {
    return {
      title: "弹出框模板",
      dialogVisible: false, // 弹出框是否显示
      defaultData: {},
      dialogType: "add"
    };
  },
  computed: {
    formList: function() {
      return [];
    }
  },
  watch: {},
  props: {},
  methods: {
    // 初始化
    init () {
      this.defaultData = {} // 数据初始化
    },
    open(type, val) {
      this.dialogType = type;
      if (type === "add") {
        this.title = "新增模板";
        this.init()
        this.dialogVisible = true;
      } else if (type === "detail" || type === "edit") {
        type === "detail"
          ? (this.title = "异常采集详情")
          : (this.title = "异常采集编辑");
        TemplateDetail({
          id: val.id
        }).then(res => {
          this.common.CheckCode(res, null, () => {
            // 给默认值赋值
            this.defaultData = this.common.DeepClone(res.data);

            // 对一些需要解析的字段进行解析
            // this.defaultData.sjbm = res.data.sjbm && res.data.sjbm.split(",");
            // this.defaultData.yzcd = Number(res.data.yzcd);
            this.dialogVisible = true;
          });
        });
      }
    },

    // 保存
    submit(qrzt) {
      this.$refs.cdtForm
        .validate()
        .then(res => {
          if (this.dialogType === "add") {
            TemplateAdd(this.defaultData).then(res => {
              this.common.CheckCode(res, "保存成功", () => {
                  this.dialogVisible = false;
                  this.$parent.fetchData(); // 调用列表获取数据接口
                }, () => {
                  // 接口调用失败处理方法
                }
              );
            });
          } else if (this.dialogType === "edit") {
            TemplateEdit(this.defaultData).then(res => {
              this.common.CheckCode(res, "修改成功", () => {
                  this.dialogVisible = false;
                  this.$parent.fetchData(); // 调用列表获取数据接口
                }, () => {
                  // 接口调用失败处理方法
                }
              );
            });
          }
        })
        .catch(err => {
          console.log("提交失败");
        });
    }
  }
};
</script>
<style lang="scss">
.TemplateDialog > .el-dialog {
  height: 80vh;
  overflow-y: scroll;
}
</style>
