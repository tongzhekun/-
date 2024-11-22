import request from '@/axios'
import axios from 'axios'
import type { UserType } from './types'

interface RoleParams {
  roleName: string
}
export const PATH_URL = import.meta.env.VITE_API_BASE_PATH

//用户登录校验
export const loginApi = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/checkLogin', data)
}
//用户修改密码
export const editPassWord = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/editPassWord', data)
}
//用户注册
export const registerApi = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/register', data)
}
//上传香烟参数
export const uploadTobacco = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/uploadTobacco', data)
}
//下载香烟参数
export const downloadTobacco = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/downloadTobacco', data)
}
//查询香烟参数
export const queryTobacco = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/queryTobacco', data)
}
//上传客户参数
export const uploadCust = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/uploadCust', data)
}
//下载客户参数
export const downloadCust = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/downloadCust', data)
}
//查询客户参数
export const queryCust = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/queryCust', data)
}
//上传定价速率
export const uploadDecayRule = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/uploadDecayRule', data)
}
//下载定价速率
export const downloadDecayRule = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/downloadDecayRule', data)
}
//查询定价速率
export const queryDecayRules = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/queryDecayRules', data)
}

//保存分配数据
export const saveCalculateDistribution = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/saveCalculateDistribution', data)
}
//下载分配数据
// export const downloadCalculateDistribution = (data: any): Promise<IResponse<any>> => {
//   return axios.post(PATH_URL + '/wzgl/public/index.php/index/downloadCalculateDistribution', data)
// }
//查询分配数据
export const queryCalculateDistribution = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/queryCalculateDistribution', data)
}
//根据批次号查询分配数据
export const queryCalculateDistributionBySerialId = (data: any): Promise<IResponse<any>> => {
  return axios.post(
    PATH_URL + '/wzgl/public/index.php/index/queryCalculateDistributionBySerialId',
    data
  )
}

//查询香烟信息
export const queryTobaccoBySku = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/queryTobaccoBySku', data)
}

//保存香烟批次信息
export const savePeriod = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/savePeriod', data)
}

//查询香烟批次信息
export const queryPeriod = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/queryPeriod', data)
}

//查询香烟批次信息
export const queryPeriodBySerialId = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/queryPeriodBySerialId', data)
}
//机构树
export const tree = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/tree', data)
}
//查询单个用户的用户信息和角色信息
export const userRole = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/userRole', data)
}

//查询全部用户信息
export const searchUser = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/searchUser', data)
}
//查询所有角色
export const searchRole = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/searchRole', data)
}

//提交用户信息
export const submitUserMessage = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/submitUserMessage', data)
}
//重置用户密码
export const resetPassWord = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/resetPassWord', data)
}
//删除用户账号
export const deleteUser = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/deleteUser', data)
}

//单个用户信息查询
export const userMessage = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/userMessage', data)
}
//查询库存信息
export const searchCk = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/searchCk', data)
}
//导出库存信息
export const exportCk = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/exportCk', data)
}
//删除库存信息
export const deleteCk = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/deleteCk', data)
}
//各个市场部的下拉框
export const treeSc = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/treeSc', data)
}
//分配库存
export const alloateKc = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/alloateKc', data)
}
//导入库存
export const importKc = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/importKc', data)
}
//物资种类查询
export const wzType = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/wzType', data)
}
//将物资移入历史库存中
export const givehistoryKc = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/givehistoryKc', data)
}
//查询历史库存
export const searchHistoryCk = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/searchHistoryCk', data)
}
//导出历史库存
export const exportHistoryCk = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/exportHistoryCk', data)
}
//查询分配记录
export const searchAllocateCk = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/searchAllocateCk', data)
}
//导出分配记录
export const exportAllocateCk = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/exportAllocateCk', data)
}
// export const loginApi = (data: any): Promise<IResponse<any>> => {
//   return axios
//     .post('http://localhost/wzgl/public/index.php/index/checkLogin', data)
//     .then((response) => response.data) // 返回响应数据
//     .catch((error) => {
//       console.error('请求失败:', error)
//       throw error // 抛出错误以便调用方处理
//     })
// }

export const loginOutApi = (): Promise<IResponse> => {
  return request.get({ url: '/mock/user/loginOut' })
}

export const getUserListApi = ({ params }: AxiosConfig) => {
  return request.get<{
    code: string
    data: {
      list: UserType[]
      total: number
    }
  }>({ url: '/mock/user/list', params })
}

export const getAdminRoleApi = (
  params: RoleParams
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/mock/role/list', params })
}

export const getTestRoleApi = (params: RoleParams): Promise<IResponse<string[]>> => {
  return request.get({ url: '/mock/role/list2', params })
}
