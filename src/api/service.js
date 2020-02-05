import request from '@/utils/request'

// ------------------ 案例调用 ------------------- //

/**
 * 分页查询
 * @param {*} params
 */
export function queryData (params) {
  return request({
    url: `/demo`,
    method: 'post',
    data: params
  })
}

/**
 * 获取详情
 * @param {*} params
 */
export function fetchData (params) {
  return request({
    url: `/demo/${params.id}`,
    method: 'get'
  })
}

/**
 * 文件下载
 */
export function downloadFiles(data) {
  return request({
    url: '/supervise_core/monSuperviseEvent/downLoadFile?wjlj=' + data.wjlj + '&wjmc=' + data.wjmc,
    method: 'get',
    responseType:'blob'
  })
}
