<template>
  <div class="container">
    <el-form :model="form" ref="formRef" :rules="formRules" label-width="130px">
      <el-row type="flex" justify="center" style="text-align: left">
        <el-col :span="8">
          <el-form-item label="时间：" prop="time">
            <el-date-picker
              style="height: 40px"
              v-model="form.time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              size="small"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="机构：" prop="instCode">
            <el-tree-select
              check-strictly
              v-model="form.instCode"
              :data="instCodeOptions"
              :render-after-expand="false"
              style="width: 240px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户经理名称：" prop="user_name">
            <el-input
              v-model="form.user_name"
              style="width: 85%; height: 40px"
              placeholder="请输入客户经理名称"
            /> </el-form-item
        ></el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="24" style="text-align: center">
          <el-button type="primary" @click="searchClick">查询</el-button>
          <el-button type="success" @click="exportClick">导出</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top: -10px">
        <el-col :span="24">
          <el-pagination
            background
            size="small"
            layout="total, prev, pager, next"
            :total="total"
            v-model:current-page="currentPage"
            :page-size="pageSize"
            @current-change="fetchData"
          />
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
              prop="material_name"
              header-align="center"
              fixed
              align="center"
              label="物料名称"
              width="auto"
            />
            <el-table-column
              prop="material_type"
              header-align="center"
              label="物料类型"
              align="center"
              width="130px"
            />
            <el-table-column
              prop="consumable"
              header-align="center"
              label="是否易耗品(1是0否)"
              align="center"
              width="180px"
            />
            <el-table-column
              prop="num"
              header-align="center"
              align="center"
              label="需求数量"
              width="130px"
            />
          </el-table>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { searchDemandMx, tree, exportDemandMx, userMessage } from '@/api/login'
import * as XLSX from 'xlsx'
import { useUserStore } from '@/store/modules/user'
export default {
  data() {
    return {
      total: 0, // 总记录数
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页记录数
      loading: false,
      userId: '',
      instCodeOptions: [],
      form: {
        instCode: '',
        time: '',
        loanDataExport: [],
        loanData: [],
        user_name: ''
      },
      formRules: {
        time: [{ required: true, message: '请选择时间', trigger: 'blur' }],
        instCode: [{ required: true, message: '请选择机构', trigger: 'blur' }]
      }
    }
  },
  async created() {
    const userStore = useUserStore()
    const loginInfo = userStore.getUserInfo
    this.userId = loginInfo.userId
    const responseUser = await userMessage({ userId: this.userId })
    const inst_code = responseUser.data.data[0].inst_code

    const payload = { inst_code: inst_code }
    const response = await tree(payload) // 调用 upload 函数并传入 payload
    this.instCodeOptions = response.data.data
  },
  methods: {
    async exportClick() {
      const payload = {
        instCode: this.form.instCode,
        time: this.form.time,
        user_name: this.form.user_name
      }
      const response = await exportDemandMx(payload) // 调用 upload 函数并传入 payload
      if (response.data.code == 200) {
        this.form.loanDataExport = response.data.data
        const data = []
        data.push(['物料名称', '物料类型', '是否易耗品(1是0否)', '需求数量'])
        this.form.loanDataExport.forEach((result) => {
          data.push([result.material_name, result.material_type, result.consumable, result.num])
        })
        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.aoa_to_sheet(data) // Convert array of arrays to sheet
        ws['!cols'] = this.calculateColumnWidths(data)
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1') // Append data to Sheet2
        const excelBlob = new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], {
          type: 'application/octet-stream'
        })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(excelBlob) // Create blob URL
        link.setAttribute('download', '需求预估明细导出表.xlsx') // Set file name
        document.body.appendChild(link)
        link.click() // Trigger download
        document.body.removeChild(link) // Clean up the link
      } else {
        this.$message.error(response.data.data.message)
      }
    },
    async searchClick() {
      this.currentPage = 1
      this.fetchData()
    },
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
            instCode: this.form.instCode,
            time: this.form.time,
            user_name: this.form.user_name
          }
          const response = await searchDemandMx(payload) // 调用 upload 函数并传入 payload
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
  border-top: 1px solid #909399;
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
:deep(.el-select__wrapper) {
  align-items: center;
  background-color: var(--el-fill-color-blank);
  border-radius: var(--el-border-radius-base);
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  gap: 6px;
  line-height: 40px !important;
  min-height: 40px !important;
  padding: 4px 12px;
  position: relative;
  text-align: left;
  transition: var(--el-transition-duration);
}
</style>
