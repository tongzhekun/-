<template>
  <div class="container">
    <el-form :model="form" ref="formRef" :rules="formRules">
      <el-row type="flex" justify="center">
        <el-col :span="9">
          <el-form-item label="机构：" prop="instCode">
            <el-tree-select
              check-strictly
              v-model="form.instCode"
              :data="instCodeOptions"
              :render-after-expand="false"
              style="width: 240px"
              @change="instCodeChange"
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
          <el-button type="success" @click="importClick">导入库存</el-button>
          <el-button type="success" @click="allocateClick">库存分配</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top: 15px">
        <el-col :span="24">
          <el-table :data="form.loanData" border style="width: 97%; height: 310px">
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
      <el-dialog
        v-model="dialogVisibleKc"
        title="附件操作"
        width="550px"
        class="centered-dialog custom-width-dialog"
      >
        <div style="margin-top: 20px">
          <el-row>
            <el-col :span="4">
              <span>下载模版:</span>
            </el-col>
            <el-col :span="5">
              <a
                href="#"
                @click.prevent="downloadTemplateKc"
                style="color: #409eff; text-decoration: underline"
                >物料库存表</a
              >
            </el-col>
          </el-row>
          <el-row style="margin-top: 15px">
            <el-col :span="4">
              <span>上传文件（xlsx格式）:</span>
            </el-col>
            <el-col :span="5">
              <input type="file" ref="fileInput" id="file-input" accept=".xlsx" />
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col :span="24" style="margin-top: 20px; text-align: center">
            <el-button @click="uploadKcClick" type="primary">提交</el-button>
            <el-button @click="dialogVisibleKc = false">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
      <el-dialog
        v-model="dialogVisibleAllocate"
        title="附件操作"
        width="550px"
        class="centered-dialog custom-width-dialog"
      >
        <div style="margin-top: 20px">
          <el-row>
            <el-col :span="4">
              <span>下载模版:</span>
            </el-col>
            <el-col :span="5">
              <a
                href="#"
                @click.prevent="downloadTemplateAllocate"
                style="color: #409eff; text-decoration: underline"
                >物料库存表</a
              >
            </el-col>
          </el-row>
          <el-row style="margin-top: 15px">
            <el-col :span="4">
              <span>上传文件(CSV格式):</span>
            </el-col>
            <el-col :span="5">
              <input type="file" ref="fileInput" @change="handleFileUploadAllocate" accept=".csv" />
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col :span="24" style="margin-top: 20px; text-align: center">
            <el-button @click="uploadAllocateClick" type="primary">提交</el-button>
            <el-button @click="dialogVisibleAllocate = false">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>
import {
  uploadTobacco,
  dowloadTobacco,
  uploadCust,
  tree,
  treeSc,
  searchCk,
  importKc
} from '@/api/login'
import * as XLSX from 'xlsx'
import { useUserStore } from '@/store/modules/user'
export default {
  data() {
    return {
      userId: '',
      uploadArrayKc: [],
      instCodeOptions: [],
      instCodeScOptions: [],
      dialogVisibleKc: false,
      dialogVisibleAllocate: false,
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
    const response1 = await treeSc({}) // 调用 upload 函数并传入 payload
    this.instCodeScOptions = response1.data.data
    const userStore = useUserStore()
    const loginInfo = userStore.getLoginInfo
    this.userId = loginInfo.userId
    console.log(loginInfo, 'loginInfologinInfologinInfo')
  },
  methods: {
    allocateClick() {
      this.dialogVisibleAllocate = true
    },
    instCodeChange() {
      console.log(this.form.instCode, '999999')
    },
    //导入新的库存
    async uploadKcClick() {
      console.log(this.uploadArrayKc, 'this.uploadArrayKc')
      try {
        // 确保文件已上传并处理完成
        await this.handleFileUploadKc() // 等待文件处理完成
        if (this.uploadArrayKc.length === 0) {
          this.$message.warning('没有数据可以提交！')
          return
        }
        const payload = {
          data: this.uploadArrayKc,
          userId: this.userId
        }
        const response = await importKc(payload) // 调用 upload 函数并传入 payload
        if (response.data.code === 200) {
          this.$message.success(response.data.data.message)
          this.dialogVisibleKc = false // 关闭弹窗
        } else {
          this.$message.error(response.data.data.message)
        }
      } catch (error) {
        this.$message.error('上传失败')
      }
    },
    //上传附件把把烟的参数表存入临时表内
    async uploadAllocateClick() {
      for (let i = this.skusArray.length - 1; i >= 0; i--) {
        if (this.skusArray[i].sku === '') {
          this.skusArray.splice(i, 1) // 删除该对象
        }
      }
      try {
        const payload = {
          skus: this.skusArray
        }
        const response = await uploadTobacco(payload) // 调用 upload 函数并传入 payload
        if (response.data.code == 200) {
          this.$message.success(response.data.data.message)
          this.dialogVisibleAllocate = false // 关闭弹窗
        } else {
          this.$message.error(response.data.data.message)
        }
      } catch (error) {
        this.$message.error('上传失败')
      }
    },
    async searchClick() {
      let validatestat = false
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          console.log(validatestat, 'ooooooooooooo1111')
          validatestat = true
        } else {
          return false
        }
      })
      console.log(validatestat, 'ooooooooooooo')
      setTimeout(async () => {
        if (validatestat) {
          console.log('pppppppppppppp')
          const payload = {
            instCode: this.form.instCode,
            materialName: this.form.materialName
          }
          const response = await searchCk(payload) // 调用 upload 函数并传入 payload
          if (response.data.code == 200) {
            this.form.loanData = response.data.data
          } else {
            this.$message.error(response.data.data.message)
          }
        }
      }, 300)
    },
    //点击卷烟参数上传
    importClick() {
      this.$nextTick(() => {
        if (this.$refs.fileInput !== undefined) {
          this.$refs.fileInput.value = null
        }
      })
      this.dialogVisibleKc = true
    },
    handleFileUploadAllocate(event) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        const lines = e.target.result.split('\n').slice(1)
        this.skus = lines.map((line) => {
          const [sku, name, stock] = line.split(',')
          return {
            sku,
            name,
            stock30: 13,
            stockRatio: 0.1,
            stock1: 2,
            stockOld: stock,
            stock: (parseInt(stock, 10) || 0) * 250
          }
        })
        this.skusArray = lines.map((line) => {
          const [sku, name, stock] = line.split(',')
          return {
            sku,
            stock30: 13,
            stockRatio: 0.1,
            stock1: 2,
            name,
            stock: (parseInt(stock, 10) || 0) * 250
          }
        })
      }
      reader.readAsText(file, 'UTF-8')
    },
    handleFileUploadKc(event) {
      const fileInput = document.getElementById('file-input')
      const file = fileInput.files[0] // 获取用户选择的文件
      if (!file) {
        alert('请先选择一个文件')
        return
      }
      const reader = new FileReader() // 创建一个 FileReader 实例
      return new Promise((resolve, reject) => {
        // 读取文件内容
        reader.onload = (e) => {
          const data = e.target.result
          // 使用 xlsx 库解析文件内容
          const workbook = XLSX.read(data, { type: 'array' })
          // 获取名为 'Sheet1' 的工作表
          const sheet = workbook.Sheets['Sheet1']
          // 如果 'Sheet1' 不存在，提醒用户
          if (!sheet) {
            alert('没有找到名为 "Sheet1" 的工作表')
            reject('没有找到工作表')
            return
          }
          // 使用 aoa_to_sheet 方法将工作表转化为数据数组
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) // header: 1 表示第一行是表头
          // 初始化一个空数组，存储处理后的数据对象
          this.uploadArrayKc = []
          // 获取表头数据
          const headers = jsonData[0] // 第一行是表头
          // 从第二行开始处理每一行数据
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i]
            // 创建一个对象，将每列的数据与表头对应起来
            const rowObject = headers.reduce((acc, header, index) => {
              acc[header] = row[index] // 将每一列的值映射到对应的表头
              return acc
            }, {})
            this.uploadArrayKc.push(rowObject)
          }
          console.log(this.uploadArrayKc, '上传的数组')
          resolve() // 确保数据已更新
        }
        reader.onerror = (err) => {
          reject(err)
        }
        // 读取文件
        reader.readAsArrayBuffer(file)
      })
    },
    //下载模版(把临时表里面的最新数据)
    async downloadTemplateAllocate() {
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
        '质保到期时间'
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
          result.warranty_period
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
      link.setAttribute('download', '库存表.xlsx') // Set file name
      document.body.appendChild(link)
      link.click() // Trigger download
      document.body.removeChild(link) // Clean up the link
    },
    async downloadTemplateKc() {
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
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.aoa_to_sheet(data) // Convert array of arrays to sheet
      ws['!cols'] = this.calculateColumnWidths(data)
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1') // Append data to Sheet2
      const excelBlob = new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], {
        type: 'application/octet-stream'
      })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(excelBlob) // Create blob URL
      link.setAttribute('download', '库存模版表.xlsx') // Set file name
      document.body.appendChild(link)
      link.click() // Trigger download
      document.body.removeChild(link) // Clean up the link
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
      link.setAttribute('download', '库存表.xlsx') // Set file name
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
        columnWidths.push({ wch: maxLength + 2 }) // Adding extra padding for clarity
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
  border-collapse: collapse;
}

.el-table {
  border: 2px solid #909399; /* Set table border color and thickness */
  border-radius: 8px; /* Optional: Add rounded corners */
}

table,
th,
td {
  border: 1px solid #909399;
}

.el-table .cell {
  padding: 0 12px;
  overflow: hidden;
  line-height: 23px;
  color: #212121;
  text-overflow: ellipsis;
  white-space: normal;
  box-sizing: border-box;
  overflow-wrap: break-word;
}

.el-table__body .el-table__row .el-table__cell:last-child {
  border-right: none;
}

/* Optional: Remove the last row's bottom border */
.el-table__body .el-table__row:last-child .el-table__cell {
  border-bottom: none;
}

.custom-form-item::v-deep.el-form-item__label {
  font-size: 18px;
  color: #000 !important;
}

.el-table__header-wrapper {
  height: 41px;
  overflow: hidden;
}

.el-dialog__header {
  height: 54px;
  padding: 0;
  margin-right: 0 !important;
  text-align: center;
  border-bottom: 1px solid var(--el-border-color);
}
</style>
