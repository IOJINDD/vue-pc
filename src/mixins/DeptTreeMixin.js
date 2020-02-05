// 部门树 mixin
import {
  mapGetters
} from "vuex";
export const DeptTreeMixin = {
  data() {
    return {
      glbmListTreeProps: {
        label: "dwjc",
        children: "children"
      },
      visible_tree: false,
    }
  },
  computed: {
    ...mapGetters(["glbmList"])
  },
  methods: {

    // 部门树选中
    $_DeptTreeMixin_changeHandle(data, node) {
      this.searchFormDept.ssbm = data.dwdm;
      this.searchFormDept.ssbmmc = data.dwjc;
      this.visible_tree = false;
    },
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {});
  },
  beforeRouteLeave(to, from, next) {
    next();
  }
}
