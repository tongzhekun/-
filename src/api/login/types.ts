import { UrlWithStringQuery } from 'url'

export interface UserLoginType {
  username: string
  userId: string
  password: string
}

export interface UserType {
  message: string | undefined
  username: string
  userId: string
  password: string
  role: string
  roleId: string
}

export interface RegisterUserType {
  message: string | undefined
  username: string
  userId: string
  iAgree: string
  check_password: string
  password: string
}
