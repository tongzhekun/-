import request from '@/axios'
import axios from 'axios'
import type { UserType } from './types'

interface RoleParams {
  roleName: string
}
export const PATH_URL = import.meta.env.VITE_API_BASE_PATH

export const loginApi = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/checkLogin', data)
}
export const registerApi = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/register', data)
}
export const uploadTobacco = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/uploadTobacco', data)
}
export const dowloadTobacco = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/dowloadTobacco', data)
}
export const uploadCust = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/uploadCust', data)
}
export const dowloadCust = (data: any): Promise<IResponse<any>> => {
  return axios.post(PATH_URL + '/wzgl/public/index.php/index/dowloadCust', data)
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
