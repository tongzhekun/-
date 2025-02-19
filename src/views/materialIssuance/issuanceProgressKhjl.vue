<template>
  <div class="container">
    <el-form :model="form" ref="formRef" :rules="formRules" label-width="130px" v-if="showAll">
      <el-row type="flex" justify="center" style="text-align: left">
        <el-col :span="9">
          <el-form-item label="市场部：" prop="inst_name">
            <el-input v-model="form.inst_name" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="客户经理：" prop="user_id">
            <el-select
              filterable
              v-model="form.user_id"
              clearable
              placeholder="请选择客户经理"
              style="width: 85%; height: 30px"
            >
              <el-option
                v-for="item in userIdOptions"
                :key="item.employee_code"
                :label="item.employee_name"
                :value="item.employee_code"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="24" style="text-align: center">
          <el-button type="primary" @click="searchClick">查询</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="24">
          <el-table
            :data="form.loanData"
            border
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-svg-view-box="-10, -10, 50, 50"
            element-loading-background="rgba(122, 122, 122, 0.8)"
            :header-cell-style="{ color: '#212121' }"
            style="width: 97%; height: 330px; margin-top: 5px"
          >
            <el-table-column
              prop="user_name"
              header-align="center"
              fixed
              align="center"
              label="客户经理"
              width="auto"
            >
              <template #default="scope">
                <div
                  style="color: #409eff; cursor: pointer"
                  @click="handleClick(scope.$index, scope.row)"
                >
                  {{ scope.row.user_name }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="done_amount"
              header-align="center"
              label="已发放金额"
              align="center"
              width="100px"
            />
            <el-table-column
              prop="is_consumable"
              header-align="center"
              label="易耗品金额"
              align="center"
              width="100px"
            />
            <el-table-column
              prop="no_consumable"
              header-align="center"
              label="非易耗品金额"
              align="center"
              width="110px"
            />
            <el-table-column
              prop="no_consumable_num"
              header-align="center"
              label="非易耗品数量"
              align="center"
              width="110px"
            />
            <el-table-column
              prop="pt_price"
              header-align="center"
              label="普通终端金额"
              align="center"
              width="110px"
            />
            <el-table-column
              prop="jm_price"
              header-align="center"
              label="加盟终端金额"
              align="center"
              width="110px"
            />
            <el-table-column
              prop="xd_price"
              header-align="center"
              label="现代终端金额"
              align="center"
              width="110px"
            />
          </el-table>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
  empSc,
  searchReviewProcessKhjl,
  userRole,
  treeSc,
  wzType,
  submitDemand,
  userMessage,
  searchNextApproval,
  searchDemand
} from '@/api/login'
import * as XLSX from 'xlsx'
import { useUserStore } from '@/store/modules/user'
export default {
  name: 'IssuanceProgressKhjl',
  data() {
    return {
      level: '0', //0是各市场部，1是市场部各客户经理，2是客户经理各客户
      instDisable: false,
      showAll: true,
      role: '0',
      roleKeyArray: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页记录数
      loading: false,
      userId: '',
      userIdOptions: [],
      form: {
        inst_code: '',
        inst_name: '',
        procurement_time: '',
        procurement_time1: '',
        loanData: [],
        user_name: '',
        user_id: ''
      },
      formRules: {
        procurement_time: [{ required: true, message: '请选择年份', trigger: 'blur' }]
      }
    }
  },
  async created() {
    this.form.procurement_time1 = this.$route.query.procurement_time1
    this.form.procurement_time = this.$route.query.procurement_time
    this.form.inst_code = this.$route.query.inst_code
    this.form.inst_name = this.$route.query.inst_name
    const userStore = useUserStore()
    const loginInfo = userStore.getUserInfo
    this.userId = loginInfo.userId
    const response2 = await userRole({ userId: this.userId })
    const roleKey = response2.data.data
    this.roleKeyArray = []
    if (roleKey.length > 0) {
      roleKey.forEach((item) => {
        this.roleKeyArray.push(item.role_id)
      })
    }
    if (this.roleKeyArray.indexOf('yc006') > -1) {
      this.role = '1'
    }
    const response1 = await empSc({ inst_code: this.form.inst_code }) // 调用 upload 函数并传入 payload
    this.userIdOptions = response1.data.data
    this.searchClick()
  },
  methods: {
    handleClick(index, row) {
      this.$router.push({
        path: 'IssuanceProgressKh',
        query: {
          user_id: row.user_id,
          user_name: row.user_name,
          inst_code: this.form.inst_code,
          procurement_time1: this.form.procurement_time1,
          procurement_time: this.form.procurement_time, // 这里的value2是你要传递的第二个参数的值，根据实际情况替换
          inst_name: this.form.inst_name // 同理，添加更多要传递的参数
        }
      })
    },
    async searchClick() {
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
            procurement_time: this.form.procurement_time,
            instCode: this.form.inst_code,
            user_id: this.form.user_id,
            role: this.role
          }
          const response = await searchReviewProcessKhjl(payload) // 调用 upload 函数并传入 payload
          if (response.data.code == 200) {
            this.form.loanData = response.data.data
            this.total = response.data.total
          } else {
            this.$message.error(response.data.data.message)
          }
          this.loading = false
        }
      }, 300)
      this.$forceUpdate()
    },
    calculateColumnWidths(data) {
      const columnWidths = []
      for (let colIndex = 0; colIndex < data[0].length; colIndex++) {
        let maxLength = 0
        data.forEach((row) => {
          const cellValue = row[colIndex] ? row[colIndex].toString() : '' // Ensure it's a string
          maxLength = Math.max(maxLength, cellValue.length)
        })
        columnWidths.push({ wch: maxLength + 7 }) // Adding extra padding for clarity
      }
      return columnWidths
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin-left: 20px !important;
  margin-right: 20px !important;
}
:deep(.el-input.is-disabled .el-input__inner) {
  color: #000000 !important;
  -webkit-text-fill-color: #000000 !important;
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
:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: #dcdcdc;
  box-shadow: 0 0 0 1px var(--el-disabled-border-color) inset;
}
:deep(.el-form-item__label) {
  align-items: flex-start;
  box-sizing: border-box;
  color: #000000 !important;
  display: inline-flex;
  flex: 0 0 auto;
  font-size: var(--el-form-label-font-size);
  height: 32px;
  justify-content: flex-end;
  line-height: 32px;
  padding: 0 12px 0 0;
}
</style>
