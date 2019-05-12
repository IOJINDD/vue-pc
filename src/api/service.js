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
