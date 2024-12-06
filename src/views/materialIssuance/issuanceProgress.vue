<template>
  <div class="container">
    <el-form :model="form" ref="formRef" :rules="formRules">
      <el-row type="flex" justify="center" style="margin-top: -15px">
        <el-col :span="9">
          <el-form-item label="发起人：" prop="userName">
            <el-input
              v-model="form.userName"
              style="width: 85%; height: 40px"
              placeholder="请输入发起人"
            />
          </el-form-item>
          <el-form-item label="客户名称：" prop="userName">
            <el-input
              v-model="form.userName"
              style="width: 85%; height: 40px"
              placeholder="请输入客户名称"
            />
          </el-form-item>
          <el-form-item label="负责人：" prop="userName">
            <el-input
              v-model="form.userName"
              style="width: 85%; height: 40px"
              placeholder="请输入负责人"
            />
          </el-form-item>
          <el-form-item label="经营地址：" prop="telephone">
            <el-input
              v-model="form.telephone"
              style="width: 85%; height: 40px"
              placeholder="请输入经营地址"
            />
          </el-form-item>
          <el-form-item label="终端层级：" prop="telephone">
            <el-input
              v-model="form.telephone"
              style="width: 85%; height: 40px"
              placeholder="请输入终端层级"
            />
          </el-form-item>
          <el-form-item label="物料名称：" prop="telephone">
            <el-input
              v-model="form.telephone"
              style="width: 85%; height: 40px"
              placeholder="请输入物料名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="联系电话：" prop="telephone">
            <el-input
              v-model="form.telephone"
              style="width: 85%; height: 40px"
              placeholder="请输入联系电话"
            />
          </el-form-item>
          <el-form-item label="许可证号：" prop="telephone">
            <el-input
              v-model="form.telephone"
              style="width: 85%; height: 40px"
              placeholder="请输入许可证号"
            />
          </el-form-item>
          <el-form-item label="经营者电话：" prop="telephone">
            <el-input
              v-model="form.telephone"
              style="width: 85%; height: 40px"
              placeholder="请输入经营者电话"
            />
          </el-form-item>
          <el-form-item label="客户经理：" prop="telephone">
            <el-input
              v-model="form.telephone"
              style="width: 85%; height: 40px"
              placeholder="请输入客户经理"
            />
          </el-form-item>
          <el-form-item label="申请物料类型：" prop="telephone">
            <el-input
              v-model="form.telephone"
              style="width: 85%; height: 40px"
              placeholder="请输入申请物料类型"
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
          <el-button type="danger" @click="allocateClick">库存分配</el-button>
          <el-button type="warning" @click="historyClick">移送历史库存</el-button>
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
            border
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-svg-view-box="-10, -10, 50, 50"
            element-loading-background="rgba(122, 122, 122, 0.8)"
            style="width: 97%; height: 325px; margin-top: 5px"
          >
            <el-table-column
              prop="material_name"
              header-align="center"
              fixed
              label="物料名称"
              width="auto"
            />
            <el-table-column
              prop="end_time"
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
            <el-table-column
              prop="project"
              align="center"
              header-align="center"
              label="操作"
              v-if="role === '1'"
              width="100px"
            >
              <template #default="scope">
                <el-button
                  round
                  type="danger"
                  size="small"
                  @click.prevent="deleteKcClick(scope.row)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
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
                >物料库存模版表</a
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
                >库存分配模版表</a
              >
            </el-col>
          </el-row>
          <el-row style="margin-top: 15px">
            <el-col :span="4">
              <span>上传文件（xlsx格式）:</span>
            </el-col>
            <el-col :span="5">
              <input type="file" ref="fileInput1" id="file-input1" accept=".csv" />
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
      <el-dialog
        v-model="dialogVisibleHistory"
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
                @click.prevent="downloadTemplateHistory"
                style="color: #409eff; text-decoration: underline"
                >移送历史库存模版表</a
              >
            </el-col>
          </el-row>
          <el-row style="margin-top: 15px">
            <el-col :span="4">
              <span>上传文件（xlsx格式）:</span>
            </el-col>
            <el-col :span="5">
              <input type="file" ref="fileInput2" id="file-input2" accept=".csv" />
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col :span="24" style="margin-top: 20px; text-align: center">
            <el-button @click="uploadHistoryClick" type="primary">提交</el-button>
            <el-button @click="dialogVisibleHistory = false">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>
import {
  uploadCust,
  tree,
  treeSc,
  searchCk,
  importKc,
  wzType,
  alloateKc,
  givehistoryKc,
  exportCk,
  deleteCk,
  userRole
} from '@/api/login'
import * as XLSX from 'xlsx'
import { useUserStore } from '@/store/modules/user'
export default {
  data() {
    return {
      role: '0', //1是本部库存管理员
      loading: false,
      total: 0, // 总记录数
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页记录数
      wzOptions: [],
      userId: '',
      uploadArrayKc: [],
      uploadArrayAllocate: [],
      uploadArrayHistory: [],
      instCodeOptions: [],
      instCodeScOptions: [],
      dialogVisibleKc: false,
      dialogVisibleAllocate: false,
      dialogVisibleHistory: false,
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
    const loginInfo = userStore.getUserInfo
    this.userId = loginInfo.userId
    if (useUserStore().getRole.indexOf('yc001') > -1) {
      this.role = '1'
    }
    const responseWzType = await wzType({})
    this.wzOptions = responseWzType.data.data
  },
  methods: {
    async deleteKcClick(row) {
      const payload = {
        materialCode: row.material_code,
        instCode: '100001'
      }
      const response = await deleteCk(payload) // 调用 upload 函数并传入 payload
      if (response.data.code == 200) {
        this.$message.success(response.data.message)
        this.fetchData()
      } else {
        this.$message.error(response.data.message)
      }
    },
    allocateClick() {
      this.$nextTick(() => {
        if (this.$refs.fileInput1 !== undefined) {
          this.$refs.fileInput1.value = null
        }
      })
      this.dialogVisibleAllocate = true
    },
    historyClick() {
      this.$nextTick(() => {
        if (this.$refs.fileInput2 !== undefined) {
          this.$refs.fileInput2.value = null
        }
      })
      this.dialogVisibleHistory = true
    },
    //导入新的库存
    async uploadKcClick() {
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
    async uploadAllocateClick() {
      try {
        // 确保文件已上传并处理完成
        await this.handleFileUploadAllocate() // 等待文件处理完成
        if (this.uploadArrayAllocate.length === 0) {
          this.$message.warning('没有数据可以提交！')
          return
        }
        const payload = {
          data: this.uploadArrayAllocate,
          userId: this.userId,
          allocateCode: '100001'
        }
        const response = await alloateKc(payload) // 调用 upload 函数并传入 payload
        if (response.data.code === 200) {
          this.$message.success(response.data.data.message)
          this.dialogVisibleAllocate = false // 关闭弹窗
        } else {
          this.$message.error(response.data.data.message)
        }
      } catch (error) {
        this.$message.error('上传失败')
      }
    },
    async uploadHistoryClick() {
      try {
        // 确保文件已上传并处理完成
        await this.handleFileUploadHistory() // 等待文件处理完成
        if (this.uploadArrayHistory.length === 0) {
          this.$message.warning('没有数据可以提交！')
          return
        }
        const payload = {
          data: this.uploadArrayHistory,
          userId: this.userId
        }
        const response = await givehistoryKc(payload) // 调用 upload 函数并传入 payload
        if (response.data.code === 200) {
          this.$message.success(response.data.data.message)
          this.dialogVisibleHistory = false // 关闭弹窗
        } else {
          this.$message.error(response.data.data.message)
        }
      } catch (error) {
        this.$message.error('上传失败')
      }
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
            materialName: this.form.materialName
          }
          const response = await searchCk(payload) // 调用 upload 函数并传入 payload
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
    async searchClick() {
      this.currentPage = 1
      this.fetchData()
    },
    importClick() {
      this.$nextTick(() => {
        if (this.$refs.fileInput !== undefined) {
          this.$refs.fileInput.value = null
        }
      })
      this.dialogVisibleKc = true
    },
    handleFileUploadAllocate(event) {
      const fileInput1 = document.getElementById('file-input1')
      const file = fileInput1.files[0] // 获取用户选择的文件
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
          // 获取名为 '库存分配模版表' 的工作表
          const sheet = workbook.Sheets['库存分配模版表']
          // 如果 'Sheet1' 不存在，提醒用户
          if (!sheet) {
            alert('没有找到名为 "库存分配模版表" 的工作表')
            reject('没有找到工作表')
            return
          }
          // 使用 aoa_to_sheet 方法将工作表转化为数据数组
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) // header: 1 表示第一行是表头
          // 初始化一个空数组，存储处理后的数据对象
          this.uploadArrayAllocate = []
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
            this.uploadArrayAllocate.push(rowObject)
          }
          resolve() // 确保数据已更新
        }
        reader.onerror = (err) => {
          reject(err)
        }
        // 读取文件
        reader.readAsArrayBuffer(file)
      })
    },
    handleFileUploadHistory(event) {
      const fileInput2 = document.getElementById('file-input2')
      const file = fileInput2.files[0] // 获取用户选择的文件
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
          const sheet = workbook.Sheets['移送库存模版表']
          if (!sheet) {
            alert('没有找到名为 "移送库存模版表" 的工作表')
            reject('没有找到工作表')
            return
          }
          // 使用 aoa_to_sheet 方法将工作表转化为数据数组
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) // header: 1 表示第一行是表头
          // 初始化一个空数组，存储处理后的数据对象
          this.uploadArrayHistory = []
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
            this.uploadArrayHistory.push(rowObject)
          }
          resolve() // 确保数据已更新
        }
        reader.onerror = (err) => {
          reject(err)
        }
        // 读取文件
        reader.readAsArrayBuffer(file)
      })
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
          resolve() // 确保数据已更新
        }
        reader.onerror = (err) => {
          reject(err)
        }
        // 读取文件
        reader.readAsArrayBuffer(file)
      })
    },
    async downloadTemplateAllocate() {
      const responseWzType = await wzType({})
      this.wzOptions = responseWzType.data.data
      const data = []
      data.push(['物料编码', '物料名称', '分配市场部编码', '分配市场部名称', '分配数量'])
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.aoa_to_sheet(data) // Convert array of arrays to sheet
      ws['!cols'] = this.calculateColumnWidths(data)
      XLSX.utils.book_append_sheet(wb, ws, '库存分配模版表') // Append data to workbook

      const dataSc = []
      dataSc.push(['市场部编码', '市场部名称'])
      this.instCodeScOptions.forEach((result) => {
        dataSc.push([result.inst_code, result.inst_name])
      })
      const wsSc = XLSX.utils.aoa_to_sheet(dataSc) // Convert array of arrays to sheet
      wsSc['!cols'] = this.calculateColumnWidths(dataSc)
      XLSX.utils.book_append_sheet(wb, wsSc, '市场部基础表') // Append data to the same workbook

      const dataWz = []
      dataWz.push(['物料编码', '物料名称', '物料数量'])
      this.wzOptions.forEach((result) => {
        dataWz.push([result.material_code, result.material_name, result.inventory_quantity])
      })
      const wsWz = XLSX.utils.aoa_to_sheet(dataWz) // Convert array of arrays to sheet
      wsWz['!cols'] = this.calculateColumnWidths(dataWz)
      XLSX.utils.book_append_sheet(wb, wsWz, '物料基础表') // Append data to the same workbook

      // Export the workbook
      const excelBlob = new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], {
        type: 'application/octet-stream'
      })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(excelBlob) // Create blob URL
      link.setAttribute('download', '库存分配模版表.xlsx') // Set file name
      document.body.appendChild(link)
      link.click() // Trigger download
      document.body.removeChild(link) // Clean up the link
    },
    //下载移送库存模版表
    async downloadTemplateHistory() {
      const responseWzType = await wzType({})
      this.wzOptions = responseWzType.data.data
      const data = []
      data.push(['物料编码', '物料名称'])
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.aoa_to_sheet(data) // Convert array of arrays to sheet
      ws['!cols'] = this.calculateColumnWidths(data)
      XLSX.utils.book_append_sheet(wb, ws, '移送库存模版表') // Append data to workbookk

      const dataWz = []
      dataWz.push(['物料编码', '物料名称', '物料数量'])
      this.wzOptions.forEach((result) => {
        dataWz.push([result.material_code, result.material_name, result.inventory_quantity])
      })
      const wsWz = XLSX.utils.aoa_to_sheet(dataWz) // Convert array of arrays to sheet
      wsWz['!cols'] = this.calculateColumnWidths(dataWz)
      XLSX.utils.book_append_sheet(wb, wsWz, '物料基础表') // Append data to the same workbook

      // Export the workbook
      const excelBlob = new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], {
        type: 'application/octet-stream'
      })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(excelBlob) // Create blob URL
      link.setAttribute('download', '移送库存模版表.xlsx') // Set file name
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
        '延期时间',
        '物料发放时间',
        '物料发放结束时间'
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
      link.setAttribute('download', '物料库存模版表.xlsx') // Set file name
      document.body.appendChild(link)
      link.click() // Trigger download
      document.body.removeChild(link) // Clean up the link
    },
    async exportClick() {
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
        '延期时间',
        '物料发放时间',
        '物料发放结束时间'
      ])
      const payload = {
        instCode: this.form.instCode,
        materialName: this.form.materialName
      }
      const response = await exportCk(payload) // 调用 upload 函数并传入 payload
      if (response.data.code == 200) {
        const loanData1 = response.data.data
        loanData1.forEach((result) => {
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
            result.delay_time,
            result.release_time,
            result.end_time
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
</style>
