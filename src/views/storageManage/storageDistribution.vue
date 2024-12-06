<template>
  <div class="container">
    <el-form :model="form" ref="formRef" :rules="formRules">
      <el-row type="flex" justify="center" style="margin-top: -15px">
        <el-col :span="9">
          <el-form-item label="被分配市场部：" prop="instCode">
            <el-select
              v-model="form.instCode"
              placeholder="请选择被分配市场部"
              size="large"
              style="width: 240px"
            >
              <el-option
                v-for="item in instCodeScOptions"
                :key="item.inst_code"
                :label="item.inst_name"
                :value="item.inst_code"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="物料名称：" prop="materialName">
            <el-input
              v-model="form.materialName"
              style="width: 85%; height: 40px"
              placeholder="请输入物料名称"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="24" style="text-align: center">
          <!-- <el-button type="primary" round>查询</el-button> -->
          <el-button type="primary" @click="searchClick">查询</el-button>
          <el-button type="info" @click="exportClick">导出分配记录</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top: -15px">
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
            v-loading="loading"
            element-loading-text="加载中"
            :header-cell-style="{ color: '#212121' }"
            element-loading-svg-view-box="-10, -10, 50, 50"
            element-loading-background="rgba(122, 122, 122, 0.8)"
            border
            style="width: 97%; height: 325px; margin-top: 5px"
          >
            <el-table-column
              prop="material_code"
              header-align="center"
              fixed
              label="物料编码"
              width="auto"
            />
            <el-table-column
              prop="material_name"
              header-align="center"
              fixed
              label="物料名称"
              width="auto"
            />
            <el-table-column
              prop="inst_name"
              header-align="center"
              fixed
              label="被分配市场部名称"
              width="140px"
            />
            <el-table-column
              prop="inventory_quantity"
              header-align="center"
              fixed
              label="分配数量"
              width="90px"
            />
            <el-table-column
              prop="quantity"
              header-align="center"
              label="分配前市场部数量"
              align="center"
              width="140px"
            />
            <el-table-column
              prop="allocate_quantity"
              header-align="center"
              label="分配前本部数量"
              align="center"
              width="140px"
            />
            <el-table-column
              prop="allocate_person"
              header-align="center"
              align="center"
              label="分配人"
              width="80px"
            />
            <el-table-column
              prop="allocate_time"
              header-align="center"
              label="分配时间"
              align="center"
              width="auto"
            />
          </el-table>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { treeSc, searchAllocateCk, exportAllocateCk } from '@/api/login'
import * as XLSX from 'xlsx'
import { useUserStore } from '@/store/modules/user'
export default {
  data() {
    return {
      loading: false,
      total: 0, // 总记录数
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页记录数
      userId: '',
      instCodeScOptions: [],
      form: {
        instCode: '',
        materialName: '',
        loanData: []
      },
      formRules: {}
    }
  },
  async created() {
    const response1 = await treeSc({}) // 调用 upload 函数并传入 payload
    this.instCodeScOptions = response1.data.data
    const userStore = useUserStore()
    const loginInfo = userStore.getUserInfo
    this.userId = loginInfo.userId
    this.searchClick()
  },
  methods: {
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
            materialName: this.form.materialName
          }
          const response = await searchAllocateCk(payload) // 调用 upload 函数并传入 payload
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
    async searchClick() {
      this.currentPage = 1
      this.fetchData()
    },
    async exportClick() {
      const data = []
      data.push([
        '物料编码',
        '物料名称',
        '被分配市场部名称',
        '分配数量',
        '分配前市场部数量',
        '分配前本部数量',
        '分配人',
        '分配时间'
      ])
      const payload = {
        instCode: this.form.instCode,
        materialName: this.form.materialName
      }
      const response = await exportAllocateCk(payload) // 调用 upload 函数并传入 payload
      if (response.data.code == 200) {
        const loanData1 = response.data.data
        loanData1.forEach((result) => {
          data.push([
            result.material_code,
            result.material_name,
            result.inst_name,
            result.inventory_quantity,
            result.quantity,
            result.allocate_quantity,
            result.allocate_person,
            result.allocate_time
          ])
        })
      } else {
        this.$message.error(response.data.data.message)
      }
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.aoa_to_sheet(data) // Convert array of arrays to sheet
      ws['!cols'] = this.calculateColumnWidths(data)
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1') // Append data to Sheet2
      const excelBlob = new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], {
        type: 'application/octet-stream'
      })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(excelBlob) // Create blob URL
      link.setAttribute('download', '分配记录表.xlsx') // Set file name
      document.body.appendChild(link)
      link.click() // Trigger download
      document.body.removeChild(link) // Clean up the link
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

<style scoped>
.container {
  margin: 20px;
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

.el-table .cell {
  padding: 0 12px;
  overflow: hidden;
  line-height: 23px;
  color: #404040;
  text-overflow: ellipsis;
  white-space: normal;
  box-sizing: border-box;
  overflow-wrap: break-word;
}
</style>
