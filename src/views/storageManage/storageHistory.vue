<template>
  <div class="container">
    <el-form :model="form" ref="formRef" :rules="formRules">
      <el-row type="flex" justify="center" style="margin-top: -15px">
        <el-col :span="9">
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
          <el-button type="info" @click="exportClick">导出库存</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top: 15px">
        <el-col :span="24">
          <el-table :data="form.loanData" border style="width: 97%; height: 325px">
            <el-table-column
              prop="material_name"
              header-align="center"
              fixed
              label="物料名称"
              width="auto"
            />
            <el-table-column
              prop="warranty_period"
              header-align="center"
              label="发放结束时间"
              align="center"
              width="auto"
            />
            <el-table-column
              prop="creation_time"
              header-align="center"
              label="入库时间"
              align="center"
              width="auto"
            />
            <el-table-column
              prop="delay_time"
              header-align="center"
              align="center"
              label="延期时间"
              width="auto"
            />
            <el-table-column
              prop="inventory_quantity"
              align="center"
              header-align="center"
              label="物料数量"
              width="100px"
            />
          </el-table>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { tree, searchHistoryCk } from '@/api/login'
import * as XLSX from 'xlsx'
import { useUserStore } from '@/store/modules/user'
export default {
  data() {
    return {
      userId: '',
      instCodeOptions: [],
      form: {
        instCode: '',
        materialName: '',
        loanData: []
      },
      formRules: {
        instCode: [{ required: true, message: '请选择机构', trigger: 'blur' }]
      }
    }
  },
  async created() {
    const payload = {}
    const response = await tree(payload) // 调用 upload 函数并传入 payload
    this.instCodeOptions = response.data.data
    const userStore = useUserStore()
    const loginInfo = userStore.getLoginInfo
    this.userId = loginInfo.userId
  },
  methods: {
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
          const payload = {
            instCode: this.form.instCode,
            materialName: this.form.materialName
          }
          const response = await searchHistoryCk(payload) // 调用 upload 函数并传入 payload
          if (response.data.code == 200) {
            this.form.loanData = response.data.data
          } else {
            this.$message.error(response.data.data.message)
          }
        }
      }, 300)
    },
    exportClick() {
      const data = []
      data.push([
        '物料编码',
        '物料类型',
        '物料名称',
        '物料单位',
        '物料规格',
        '采购年份',
        '是否易耗品',
        '库存数量',
        '可用数量',
        '物料价格',
        '费用类型',
        '采购方式',
        '采购项目名称',
        '供应商名称',
        '质保到期时间',
        '延期时间'
      ])
      this.form.loanData.forEach((result) => {
        data.push([
          result.material_code,
          result.material_type,
          result.material_name,
          result.material_unit,
          result.material_specification,
          result.procurement_time,
          result.consumable,
          result.inventory_quantity,
          result.available_quantity,
          result.material_price,
          result.cost_type,
          result.procurement_method,
          result.project_name,
          result.supplier_name,
          result.warranty_period,
          result.delay_time
        ])
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
      link.setAttribute('download', '历史库存表.xlsx') // Set file name
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

<style>
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
</style>
