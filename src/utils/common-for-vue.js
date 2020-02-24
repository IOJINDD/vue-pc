import { Message, MessageBox } from "element-ui";
import store from "../store";
var GLOBAL_DELAY_FLAG = true // 全局变量
export default {
  /**
   *
   * @param {Array} params - 要检查的数组
   * @param {Array} toasts - 对于的提示语句
   * @param {function} callback - 执行的方法
   */
  checkDataEmpty(params, toasts, callback) {
    let flag = true;
    params.forEach((element, index) => {
      console.log('element', element);
      if (!element || (element && element.length === 0)) {
        if (flag) {
          Message({
            message: toasts[index],
            type: "warning"
          });
        }
        flag = false;
        return
      }
    });
    if (flag) {
      callback();
    }
  },

  /**
   * 判断返回的状态码是否是200
   * @param {*} res 返回的参数
   * @param {*} successMsg 成功提示语
   * @param {*} successCallBack 是200的回调函数
   * @param {*} errorCallBack 失败的回调函数
   */
  CheckCode(res, successMsg, successCallBack, errorCallBack) {
    if (res && res.code == 200) {
      if (successMsg) {
        Message({
          message: successMsg,
          type: "success",
        });
      }
      successCallBack();
    } else {
      Message({
        message: res.msg,
        type: "error",
        duration: 1500
      });
      errorCallBack && errorCallBack()
    }
  },

  /**
   * 删除提示
   * @Function {*} successCallBack 确认后回调函数
   * @String {*} title 提示语
   */
  handleConfirm(successCallBack, title) {
    MessageBox.confirm(title || "此操作将永久删除该数据, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        successCallBack();
      })
      .catch(() => {
        Message({
          type: "info",
          message: "已取消"
        });
      });
  },

  /**
   * 将一维的扁平数组转换为多层级对象
   * @param  {[type]} list 一维数组，数组中每一个元素需包含id和parent_id两个属性
   * @return {[type]} tree 多层级树状结构
   */
  buildTree(list, id, parent_id) {
    let temp = {};
    let tree = [];
    for (let i in list) {
      temp[list[i][id]] = list[i];
    }
    for (let i in temp) {
      if (temp[i][parent_id] !== "dj") {
        if (!temp[temp[i][parent_id]].children) {
          temp[temp[i][parent_id]].children = new Array();
        }
        temp[temp[i][parent_id]].children.push(temp[i]);
      } else {
        tree.push(temp[i]);
      }
    }
    return tree;
  },

  /**
   * 把菜单栏改成联动选择
   * @param {*} arr - 所有菜单
   * @param {*} selected - 已选菜单
   */
  menuToSelect(arr, selected) {
    for (let i = 0; i < arr.length; i++) { 
      if (arr[i].childrenNode && arr[i].childrenNode.length > 0 && arr[i].data.cdlj === null) {
        arr[i].children = arr[i].childrenNode
        arr[i].childrenNode = this.menuToSelect(arr[i].childrenNode, selected);
      }
      if (arr[i].data) {
        arr[i].label = arr[i].data.mkmc
        arr[i].value = arr[i].data
        if (selected.indexOf(arr[i].data.mkmc) != -1) {
          arr[i].disabled = true
        } else {
          arr[i].disabled = false
        }
      }
    }
    return arr;
  },

  /**
   * option格式化
   */
  optionFormater(arr, value, label) {
    return arr.map(item => {
      return {
        value: item[value],
        label: item[label]
      }
    })
  },

  /**
   * 根据 dmlb 或者 lbmc 获取数据字典
   * @param {*} key
   */
  getDic(key) {
    let list = [];
    if (key) {
      if (store.state.dicList) {
        store.state.dicList.forEach((item, index) => {
          if (item.dmlb == key || item.lbmc == key) {
            if (key == 'QYBAZLLB' || key == 'RJBAZLLB') {
              item.xjsj.forEach(item2 => {
                list.push({
                  cllx: item2.dmbh,
                  wjmc: item2.dmmc,
                  plsx: item2.plsx,
                  jllx: item2.jllx,
                  dmlb: item2.dmlb,
                });
              })
            } else if (key == 'FZJG') {
              item.xjsj.forEach(item2 => {
                list.push({
                  value: item2.dmmc,
                  label: item2.dmmc,
                  plsx: item2.plsx,
                  jllx: item2.jllx,
                  dmlb: item2.dmlb
                });
              })
            } else if (key == 'mon_supervise_yjxtlb') {
              item.xjsj.forEach(item2 => {
                list.push({
                  value: item2.dmbh,
                  label: item2.dmmc,
                  plsx: item2.plsx,
                  jllx: item2.jllx,
                  dmlb: item2.dmlb,
                  icon: item2.bz
                });
              })
            } else {
              item.xjsj.forEach(item2 => {
                list.push({
                  value: item2.dmbh,
                  label: item2.dmmc,
                  plsx: item2.plsx,
                  jllx: item2.jllx,
                  dmlb: item2.dmlb
                });
              });
            }
          }
        });
      } else {
        this.getDic(key);
      }
    }

    if (key == 'mon_supervise_yjxtlb') {
      let arr = []
      list.sort(this.compare("plsx")).forEach((item, index) => {
        if (store.state.userInfo.userExpForm.yhlx.indexOf(item.value) != -1) {
          arr.push(item)
        }
      })
      return arr
    } else {
      return list.sort(this.compare("plsx"));
    }
  },

  FormatDic(zdlb, val) {
    let arr = this.getDic(zdlb)
    let label = "";
    arr.forEach(item => {
      if (item.value == val) {
        label = item.label;
      }
    });
    return label || '暂无';
  },
 
  /**
   * 根据参数名 获取store里面的state对应的参数名的值
   * @param {*} state 
   */
  getStoreState (state) {
    if (store.state[state]) {
      return store.state[state]
    } else {
      this.getStoreState(state)
    }
  },

  /**
   * 根据数组中对象的某一个属性值进行排序
   * 用法 arr.sort(compare('age'))
   * @param {*} key
   */
  compare(key) {
    return function(a, b) {
      let value1 = a[key];
      let value2 = b[key];
      return value1 - value2;
    };
  },

  /**
   * 数字牌补齐位数
   */
  FillCount(str,length) {
    if(str.length < length){
      let need = length-str.length
      for(let i=0; i<need; i++){
        str.unshift('0')
      }
    } 
    return str
  },

  /**
   * 根据glbm代码转中文
   */
  FormatGlbm(dwdm) {
    return store.state.glbmDwdm[dwdm] || dwdm
  },

  /**
   * 解析审核状态
   */
  filterShzt(val) {
    let obj = {
      0: '未审批',
      1: '审批通过',
      2: '审批不通过'
    }
    return obj[val] || val
  },

  /**
   * 格式化时间
   * @param {*} val - 时间戳
   */
  FormatDate(val) {
    return new Date(val).format("yyyy-MM-dd hh:mm:ss");
  },

  /**
   * 深度克隆
   * @param {*} obj 
   */
  DeepClone (obj) {
    let _tmp, result
    _tmp = JSON.stringify(obj)
    result = JSON.parse(_tmp)
    return result
  },

  /**
   * 延迟调用
   * @param {*} callback - 需要调用的方法
   * @param {*} time - 延迟的实际，默认300毫秒
   */
  DelayCall (callback, time) {
    if (GLOBAL_DELAY_FLAG) {
      GLOBAL_DELAY_FLAG = false
      callback()
      setTimeout(() => {
        GLOBAL_DELAY_FLAG = true
      }, time || 500)
    }
  }
};
