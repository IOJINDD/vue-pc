// 操作记录上一次记录 mixin
export const OperateMarkMixin = {
  methods: {
    // 标记选中行
    $_OperateMarkMixin_operate(val) {
      // this.$refs.CdtTable.$refs.tableRef.setCurrentRow(val)
    },
    // 清除标记
    $_OperateMarkMixin_closeOperate() {
      // let _this = this
      // setTimeout(() => {
      //   _this.$refs.CdtTable.$refs.tableRef.setCurrentRow()
      // }, 3000)
    },
  }
}
