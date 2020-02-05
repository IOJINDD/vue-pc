// 树形穿梭框 mixin
import {
  deepClone
} from "@/utils/tool.js";
export const TreeTransferMixin = {
  data() {
    return {
      yhzlx: 'user',
      leftTitle: ["根据用户", "根据部门"],
      fromData: [],
      addObj:{}, // 添加的对象
      toData: [], // 选中数据
      yhzList: [], // 用户组
      defaultCheckedKeys: [] // 左侧默认选中数据
    }
  },
  computed: {},
  methods: {
    $_TreeTransferMixin_changeLX(data) {
      this.yhzlx = data
      this.fromData = deepClone(this.userData[data])
      this.toData = [] //deepClone(this.userData[data])
      if (this.yhzlx === this.ylx && this.yhzList && this.yhzList.length > 0) {
        this.toData = deepClone(this.userData[data])
        // this.toData = this.array2tree(this.userData, this.toData);
        this.searchToData()
        this.searchFromData()
      }
    },
    // 添加按钮
    $_TreeTransferMixin_add(fromData, toData, obj) {
      this.toData = toData
      this.addObj = obj
    },
    // 移除按钮
    $_TreeTransferMixin_remove(fromData, toData, obj) {
      this.toData = toData
    },
  }
}
