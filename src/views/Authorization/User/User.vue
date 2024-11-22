<template>
  <div class="container">
    <el-form :model="form" ref="formRef">
      <el-row type="flex" justify="center" style="margin-top: -20px">
        <el-col :span="9">
          <el-form-item label="用户账号：" prop="userId">
            <el-input
              v-model="form.userId"
              style="width: 85%; height: 30px"
              placeholder="请输入用户账号"
            />
          </el-form-item>
          <el-form-item label="机构：" prop="instCode">
            <el-tree-select
              check-strictly
              v-model="form.instCode"
              :data="instCodeOptions"
              :render-after-expand="false"
              style="width: 85%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="用户名：" lable-width="120px" prop="userName">
            <el-input
              v-model="form.userName"
              style="width: 85%; height: 30px"
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item label="关联角色名称：" prop="roleId">
            <el-select
              v-model="form.roleId"
              placeholder="请选择关联角色名称"
              style="width: 85%; height: 30px"
            >
              <el-option
                v-for="item in roleOptions"
                :key="item.role_id"
                :label="item.role_name"
                :value="item.role_id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5" style=" margin-top: 25px;text-align: left">
          <el-button type="primary" @click="searchClick">查询</el-button>
          <el-button type="danger" @click="resetClick">重置</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top: -15px">
        <el-col :span="24">
          <el-pagination
            background
            size="small"
            layout="prev, pager, next"
            :total="total"
            v-model:current-page="currentPage"
            :page-size="pageSize"
            @current-change="fetchData"
          />
          <el-table
            :data="form.loanData"
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-svg-view-box="-10, -10, 50, 50"
            element-loading-background="rgba(122, 122, 122, 0.8)"
            border
            style="width: 97%; height: 310px; margin-top: 5px"
          >
            <el-table-column
              prop="employee_code"
              header-align="center"
              fixed
              label="员工编号"
              width="90px"
            />
            <el-table-column
              prop="employee_name"
              header-align="center"
              label="员工姓名"
              align="center"
              width="90px"
            />
            <el-table-column
              prop="type"
              header-align="center"
              label="岗位性质"
              align="center"
              width="120px"
            />
            <el-table-column
              prop="inst_code"
              header-align="center"
              align="center"
              label="所属机构编码"
              width="120px"
            />
            <el-table-column
              prop="inst_name"
              align="center"
              header-align="center"
              label="所属机构名称"
              width="220px"
            />
            <el-table-column
              prop="telephone"
              align="center"
              header-align="center"
              label="手机号"
              width="130px"
            />
            <el-table-column
              prop="status"
              align="center"
              header-align="center"
              label="状态"
              width="70px"
            />
            <el-table-column
              prop="project"
              align="center"
              header-align="center"
              label="操作"
              width="auto"
            >
              <template #default="scope">
                <el-button round type="success" size="small" @click.prevent="editClick(scope.row)"
                  >修改
                </el-button>
                <el-button
                  round
                  type="warning"
                  size="small"
                  @click.prevent="resetPassWordClick(scope.row)"
                  >重置密码
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-dialog
        v-model="dialogVisibleRole"
        title="角色信息"
        width="550px"
        class="centered-dialog custom-width-dialog"
      >
        <el-row type="flex" justify="center" style="margin-top: -15px">
          <el-col :span="9">
            <el-form-item label="用户账号：" prop="userId">
              <el-input
                v-model="form.userId"
                style="width: 85%; height: 40px"
                placeholder="请输入用户账号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="用户名：" prop="userName">
              <el-input
                v-model="form.userName"
                style="width: 85%; height: 40px"
                placeholder="请输入用户名"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="24" style="text-align: center">
            <el-button type="primary" @click="searchClick">查询</el-button>
          </el-col>
        </el-row>
        <el-row style="margin-top: -15px">
          <el-col :span="24">
            <el-table
              :data="form.loanData1"
              v-loading="loading"
              element-loading-text="加载中"
              element-loading-svg-view-box="-10, -10, 50, 50"
              element-loading-background="rgba(122, 122, 122, 0.8)"
              border
              style="width: 97%; height: 325px; margin-top: 5px"
            >
              <el-table-column
                prop="employee_code "
                header-align="center"
                fixed
                label="员工编号"
                width="90px"
              />
              <el-table-column
                prop="employee_name"
                header-align="center"
                label="员工姓名"
                align="center"
                width="90px"
              />
              <el-table-column
                prop="type"
                header-align="center"
                label="岗位性质"
                align="center"
                width="90px"
              />
              <el-table-column
                prop="inst_code"
                header-align="center"
                align="center"
                label="所属机构编码"
                width="120px"
              />
              <el-table-column
                prop="inst_name"
                align="center"
                header-align="center"
                label="所属机构名称"
                width="120px"
              />
              <el-table-column
                prop="telephone"
                align="center"
                header-align="center"
                label="手机号"
                width="120px"
              />
              <el-table-column
                prop="project"
                align="center"
                header-align="center"
                label="操作"
                width="auto"
              >
                <template #default="scope">
                  <el-button
                    round
                    type="danger"
                    size="small"
                    @click.prevent="deleteClick(scope.row)"
                    >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>
import {
  tree,
  searchUser,
  searchRole,
  userMessage,
  submitUserMessage,
  resetPassWord,
  deleteUser
} from '@/api/login'
import { ElMessageBox } from 'element-plus'
import * as XLSX from 'xlsx'
import { useUserStore } from '@/store/modules/user'
export default {
  data() {
    return {
      dialogVisibleRole: false,
      loading: false,
      total: 0, // 总记录数
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页记录数
      userId: '',
      instCodeOptions: [],
      roleOptions: [],
      form: {
        roleId: '',
        userName: '',
        userId: '',
        instCode: '',
        loanData1: [],
        loanData: []
      }
    }
  },
  async created() {
    const payload = {}
    const response = await tree(payload) // 调用 upload 函数并传入 payload
    this.instCodeOptions = response.data.data
    const response1 = await searchRole({})
    this.roleOptions = response1.data.data
    const userStore = useUserStore()
    const loginInfo = userStore.getLoginInfo
    this.userId = loginInfo.userId
    this.searchClick()
  },
  methods: {
    editClick(row) {
      this.dialogVisibleRole = true
    },
    resetPassWordClick(row) {
      ElMessageBox.confirm('是否确认重置密码?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const payload = { userId: row.employee_code }
          const response = await resetPassWord(payload) // 调用 upload 函数并传入 payload
          if (response.data.code == 200) {
            this.$message.success(response.data.message)
          } else {
            this.$message.error(response.data.message)
          }
        })
        .catch(() => {})
    },
    deleteClick(row) {},
    fetchData() {
      let validatestat = false
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          validatestat = true
        } else {
          return false
        }
      })
      setTimeout(async () => {
        if (validatestat) {
          this.loading = true
          const payload = {
            page: this.currentPage,
            pageSize: this.pageSize,
            userId: this.form.userId,
            instCode: this.form.instCode,
            roleId: this.form.roleId,
            userName: this.form.userName
          }
          const response = await searchUser(payload) // 调用 upload 函数并传入 payload
          if (response.data.code == 200) {
            this.form.loanData = response.data.data
            this.total = response.data.total
          } else {
            this.$message.error(response.data.data.message)
          }
          this.loading = false
        }
      }, 300)
    },
    resetClick() {
      this.form.userId = ''
      this.form.instCode = ''
      this.form.roleId = ''
      this.form.userName = ''
      this.searchClick()
    },
    async searchClick() {
      this.currentPage = 1
      this.fetchData()
    }
  }
}
</script>

<style>
.container {
  margin: 10px;
}

table {
  width: 100%;
  margin-bottom: 20px;
  overflow: hidden; /* 防止内容溢出 */
  border: 2px solid #909399; /* 表格整体边框加厚 */
  border-collapse: separate; /* 使用 separate 避免边框重叠 */
  border-spacing: 0; /* 确保单元格间距为 0 */
}

.el-table--fit {
  border-right: 1px solid #909399;
  border-bottom: 0;
  border-bottom: 1px solid #909399;
  border-left: 1px solid #909399;
}

table,
th,
td {
  border: 1px solid #909399; /* 保持统一边框 */
}

.el-table.cell {
  padding: 0 12px;
  overflow: hidden;
  line-height: auto;
  color: #212121;
  text-overflow: ellipsis;
  white-space: normal;
  box-sizing: border-box;
  overflow-wrap: break-word;
}

/* 表头样式 */
.el-table__header-wrapper th {
  color: #000;
  vertical-align: top; /* 垂直对齐顶部 */
  border-bottom: none; /* 移除 th 自身的下边框 */
}

/* 表头容器样式 */
.el-table__header-wrapper {
  position: relative; /* 设置相对定位 */
  z-index: 1;
  height: 41px !important;
  overflow: hidden;
  background-color: #fff;
}

/* 表头下边框伪元素 */
.el-table__header-wrapper::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2; /* 确保伪元素覆盖表格内容 */
  height: 1px;
  background-color: #909399; /* 表头下边框颜色 */
  content: '';
}

/* 表体单元格样式 */
.el-table__body tr td {
  height: 12px; /* 单元格高度 */
  padding: 5px !important;
  color: #212121;
  border-top: 1px solid #909399; /* 确保中间行上边框存在 */
  border-right: 1px solid #909399;
  border-bottom: 1px solid #909399; /* 确保中间行下边框存在 */
}

/* 去除第一行单元格的上边框 */
.el-table__body tr:first-child td {
  border-top: none;
}

/* 去除最后单元格的右边框 */
.el-table__body tr td:last-child {
  border-right: none;
}

/* 去除最后一行的下边框 */
.el-table__body tr:last-child td {
  border-bottom: none;
}

/* 默认表格单元格样式 */
.el-table--default.el-table__cell {
  padding: 0; /* 调整内边距 */
}

.el-form-item__label {
  width: 120px;
}

.custom-form-item::v-deep.el-form-item__label {
  font-size: 18px;
  color: #000 !important;
}

.el-dialog__header {
  height: 54px;
  padding: 0;
  margin-right: 0 !important;
  text-align: center;
  border-bottom: 1px solid var(--el-border-color);
}
</style>
