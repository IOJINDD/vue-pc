/* eslint-disable */
/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== "string") {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
};

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return;
  return window.localStorage.getItem(name);
};

/**
 * 移除localStorage
 */
export const removeStore = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
};

/**
 * 删除数组某个元素
 * @param {Array} arr
 * @param {Function} func
 * 用法 :
 *   removeArray(arr, n => n != id)
 *   arr是操作的数组，id是要删除的元素，返回最新的数组
 */
export const removeArray = (arr, func) => {
  return Array.isArray(arr)
    ? arr.filter(func).reduce((acc, val) => {
        arr.splice(arr.indexOf(val), 1);
        return acc.concat(val);
      }, [])
    : [];
};

export const removeDuplicate = (array, key) => {
  let hash = {};
  array = array.reduce(function(arr, current) {
    hash[current[key]] ? "" : (hash[current[key]] = true && arr.push(current));
    return arr;
  }, []);
  console.log("array", array);
  return array;
};

/**
 * 数组包含
 * @param {Array} a 主
 * @param {Array} b 次
 */
export const isIncludes = (a, b) => {
  const s = new Set(b);
  return a.filter(x => s.has(x)).length == b.length;
};

/**
 * 数组交集
 * @param {*} arr 主
 * @param {*} values 次
 */
export const similarity = (arr, values) => arr.filter(v => values.includes(v));

/**
 * 获取当前时间
 */
export const getCurrentTime = () => {
  let now = new Date();
  let year = now.getFullYear(); //年
  let month = now.getMonth() + 1; //月
  let day = now.getDate(); //日
  let hh = now.getHours(); //时
  let mm = now.getMinutes(); //分
  let ss = now.getSeconds(); //分
  let clock = year + "-";
  if (month < 10) clock += "0";
  clock += month + "-";
  if (day < 10) clock += "0";
  clock += day + " ";
  if (hh < 10) clock += "0";
  clock += hh + ":";
  if (mm < 10) clock += "0";
  clock += mm + ":";
  if (ss < 10) clock += "0";
  clock += ss;
  return clock;
};

/**
 * 深度克隆对象
 * @param {Object} obj
 */
export const deepClone = obj => {
  let _tmp, result;
  _tmp = JSON.stringify(obj);
  result = JSON.parse(_tmp);
  return result;
};

/**
 * 数组比较
 * @param {*} a
 * @param {*} b
 *  difference([1,2,3], [1,2]) -> [3]
 */
export const difference = (a, b) => {
  const s = new Set(b);
  return a.filter(x => !s.has(x));
};

// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
export const sheet2blob = (sheet, sheetName) => {
  sheetName = sheetName || "sheet1";
  let workbook = {
    SheetNames: [sheetName],
    Sheets: {}
  };
  workbook.Sheets[sheetName] = sheet;
  // 生成excel的配置项
  let wopts = {
    bookType: "xls", // 要生成的文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: "binary"
  };
  let wbout = XLSX.write(workbook, wopts);
  let blob = new Blob([s2ab(wbout)], {
    type: "application/octet-stream"
  });
  // 字符串转ArrayBuffer
  function s2ab(s) {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
  return blob;
};

/**
 * 通用的打开下载对话框方法，没有测试过具体兼容性
 * @param url 下载地址，也可以是一个blob对象，必选
 * @param saveName 保存文件名，可选
 */
export const openDownloadDialog = (url, saveName) => {
  if (typeof url == "object" && url instanceof Blob) {
    url = URL.createObjectURL(url); // 创建blob地址
  }
  var aLink = document.createElement("a");
  aLink.href = url;
  aLink.download = saveName || ""; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
  var event;
  if (window.MouseEvent) event = new MouseEvent("click");
  else {
    event = document.createEvent("MouseEvents");
    event.initMouseEvent(
      "click",
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    );
  }
  aLink.dispatchEvent(event);
};

/**
 * 下载excel - xls格式
 * @param {*} aoa [['表头1', '表头2'， ‘表头3’], ['第二列1', '第二列2'， '第二列3'], ['第三列1', '第三列2'， ’第三列3‘]]
 * @param {*} title  标题
 */
export const tableToXls = (aoa, title) => {
  let sheet = XLSX.utils.aoa_to_sheet(aoa);
  openDownloadDialog(sheet2blob(sheet), `${title}.xls`);
};

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate(data, id = "id", pid = "parentId") {
  console.log("data", data);
  var res = [];
  var temp = {};
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i];
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]["children"]) {
        temp[data[k][pid]]["children"] = [];
      }
      if (!temp[data[k][pid]]["_level"]) {
        temp[data[k][pid]]["_level"] = 1;
      }
      data[k]["_level"] = temp[data[k][pid]]._level + 1;
      temp[data[k][pid]]["children"].push(data[k]);
    } else {
      res.push(data[k]);
    }
  }
  return res;
}

/**
 *  提取汉字
 */
export function getChinese(str) {
  console.log("str", str);
  if (str != null && str != "") {
    var reg = /[\u4e00-\u9fa5]/g;
    return str.match(reg) ? str.match(reg).join("") : "";
  } else {
    return "";
  }
}
