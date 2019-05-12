import { Message, MessageBox, Notification } from "element-ui";
import store from "../store";

export default {
  /**
   *
   * @param {Array} params - 要检查的数组
   * @param {Array} toasts - 对于的提示语句
   * @param {function} callback - 执行的方法
   */
  CheckData(params, toasts, callback) {
    let flag = true;
    params.forEach(function(element, index) {
      if (!element.Trim()) {
        if (flag) {
          Message({
            message: toasts[index],
            type: "error"
          });
        }
        flag = false;
      }
    }, this);
    if (flag) {
      callback();
    }
  },

  /**
   * 判断返回的状态码是否是200
   * @param {*} res 返回的参数
   * @param {*} callBack 是200的回调函数
   */
  CheckCode(res, callBack) {
    console.log("res", res);
    if (res && res.code == 200) {
      Message({
        message: res.msg || "操作成功",
        type: "success"
      });
      callBack();
    } else {
      Message({
        message: res.msg,
        type: "error",
        duration: 1500
      });
    }
  },

  /**
   * 时间格式方法
   * @param {*} date - new Date()
   * @param {*} format - yyyy年MM月dd日
   */
  FormatDate(date, format) {
    var o = {
      "M+": date.getMonth() + 1, //month
      "d+": date.getDate(), //day
      "h+": date.getHours(), //hour
      "m+": date.getMinutes(), //minute
      "s+": date.getSeconds(), //second
      "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
      S: date.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format))
      format = format.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    for (var k in o)
      if (new RegExp("(" + k + ")").test(format))
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
    return format;
  },

  // 重置表单
  handleReset() {
    store.commit("SET_searchForm", {});
  },

  /**
   * 删除提示
   * @param {*} successCallBack 确认后回调函数
   */
  deleteConfirm(successCallBack) {
    MessageBox.confirm("此操作将永久删除该文件, 是否继续?", "提示", {
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
          message: "已取消删除"
        });
      });
  },

  /**
   * 撤回提示
   * @param {*} successCallBack 确认后回调函数
   */
  backConfirm(successCallBack) {
    MessageBox.confirm("是否确认撤回申请？", "提示", {
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
          message: "已取消撤回"
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
   * 判断是否为空
   * @param {Array} params - 要检查的数组
   * @param {Array} message - 对于的提示语句
   * @param {function} callback - 执行的方法
   */
  CheckDataEmpty(params, message, callback) {
    let flag = true;
    params.forEach((ele, index) => {
      if (!String(ele).trim() || !ele) {
        if (flag) {
          Notification({
            title: message[index],
            // message: message[index],
            type: "warning",
            showClose: false
          });
        }
        flag = false;
      }
    });
    if (flag) {
      callback();
    }
  },

  /**
   * 判断图片是否存在
   */
  CheckImgExists(imgurl) {
    var ImgObj = new Image(); //判断图片是否存在
    ImgObj.src = imgurl;
    //没有图片，则返回-1
    if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
      return true;
    } else {
      return false;
    }
  }
};
