<template>
  <div class="container">
    <el-form :model="form" ref="formRef" :rules="formRules">
      <el-row type="flex" justify="center" style="margin-top: -15px">
        <el-col :span="9">
          <el-form-item label="表名：" prop="tableName">
            <el-select
              v-model="form.tableName"
              placeholder="请选择表名"
              @change="tableNameChange"
              style="width: 85%; height: 30px"
            >
              <el-option
                v-for="item in tableNameOptions"
                :key="item.tableName"
                :label="item.tableName"
                :value="item.tableName"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="机构名称：" v-if="form.tableName === '机构表'" prop="instName">
            <el-input
              v-model="form.instName"
              placeholder="请输入机构表，支持模糊查询"
              style="width: 85%; height: 40px"
            />
          </el-form-item>
          <el-form-item label="员工姓名：" v-if="form.tableName === '员工表'" prop="empName">
            <el-input
              v-model="form.empName"
              placeholder="请输入员工姓名，支持模糊查询"
              style="width: 85%; height: 40px"
            />
          </el-form-item>
          <el-form-item label="客户姓名：" v-if="form.tableName === '客户信息表'" prop="tableName">
            <el-input
              v-model="form.custName"
              placeholder="请输入客户姓名，支持模糊查询"
              style="width: 85%; height: 40px"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="9" style="text-align: center">
          <el-button type="primary" @click="searchClick">查询</el-button>
          <el-button type="info" @click="exportClick">导出数据</el-button>
          <el-button type="success" @click="importClick">导入数据</el-button>
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
            v-if="form.tableName === '机构表'"
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-svg-view-box="-10, -10, 50, 50"
            element-loading-background="rgba(122, 122, 122, 0.8)"
            :header-cell-style="{ color: '#212121' }"
            style="width: 97%; height: 325px; margin-top: 5px"
          >
            <el-table-column
              prop="inst_code"
              header-align="center"
              align="center"
              label="机构编码"
              width="100px"
            />
            <el-table-column
              prop="inst_name"
              header-align="center"
              label="机构名称"
              align="center"
              width="auto"
            />
            <el-table-column
              prop="up_inst_code"
              header-align="center"
              label="上级机构"
              align="center"
              width="100px"
            />
            <el-table-column
              prop="up_inst_name"
              header-align="center"
              align="center"
              label="上级机构名称"
              width="auto"
            />
            <el-table-column
              prop="start_time"
              align="center"
              header-align="center"
              label="创建时间"
              width="120px"
            />
            <el-table-column
              prop="end_time"
              align="center"
              header-align="center"
              label="撤销时间"
              width="120px"
            />
          </el-table>
          <el-table
            :data="form.loanData"
            border
            v-if="form.tableName === '员工表'"
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-svg-view-box="-10, -10, 50, 50"
            element-loading-background="rgba(122, 122, 122, 0.8)"
            :header-cell-style="{ color: '#212121' }"
            style="width: 97%; height: 325px; margin-top: 5px"
          >
            <el-table-column
              prop="employee_name"
              header-align="center"
              label="员工姓名"
              align="center"
              width="100px"
            />
            <el-table-column
              prop="employee_code"
              header-align="center"
              align="center"
              label="员工编号"
              width="100px"
            />
            <el-table-column
              prop="type"
              header-align="center"
              label="权限类型（岗位性质）"
              align="center"
              width="auto"
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
              label="联系电话"
              width="120px"
            />
            <el-table-column
              prop="status"
              align="center"
              header-align="center"
              label="员工状态"
              width="100px"
            />
            <el-table-column
              prop="gender"
              align="center"
              header-align="center"
              label="员工性别"
              width="100px"
            />
            <el-table-column
              prop="age"
              align="center"
              header-align="center"
              label="员工年龄"
              width="100px"
            />
          </el-table>
          <el-table
            :data="form.loanData"
            border
            v-if="form.tableName === '客户信息表'"
            v-loading="loading"
            element-loading-text="加载中"
            element-loading-svg-view-box="-10, -10, 50, 50"
            element-loading-background="rgba(122, 122, 122, 0.8)"
            :header-cell-style="{ color: '#212121' }"
            style="width: 97%; height: 325px; margin-top: 5px"
          >
            <el-table-column
              prop="custom_name"
              header-align="center"
              fixed
              label="客户（企业）名称"
              align="center"
              width="200px"
            />
            <el-table-column
              prop="custom_code"
              header-align="center"
              label="客户编码"
              width="170px"
            />
            <el-table-column
              prop="manager_code"
              header-align="center"
              label="客户经理编码"
              align="center"
              width="130px"
            />
            <el-table-column
              prop="custom_license"
              header-align="center"
              align="center"
              label="许可证号"
              width="170px"
            />
            <el-table-column
              prop="terminal_level"
              align="center"
              header-align="center"
              label="客户终端层级"
              width="110px"
            />
            <el-table-column
              prop="custom_classification"
              align="center"
              header-align="center"
              label="客户分类"
              width="100px"
            />
            <el-table-column
              prop="credit_rating"
              align="center"
              header-align="center"
              label="信用等级"
              width="100px"
            />
            <el-table-column
              prop="business_status"
              align="center"
              header-align="center"
              label="经营状态"
              width="100px"
            />
            <el-table-column
              prop="market_type"
              align="center"
              header-align="center"
              label="市场类型"
              width="100px"
            />
            <el-table-column
              prop="quota_standard"
              align="center"
              header-align="center"
              label="定额标准"
              width="100px"
            />
            <el-table-column
              prop="remain_standard"
              align="center"
              header-align="center"
              label="剩余定额标准"
              width="120px"
            />
            <el-table-column
              prop="custom_address"
              align="center"
              header-align="center"
              label="客户经营地址"
              width="200px"
            />
            <el-table-column
              prop="longitude"
              align="center"
              header-align="center"
              label="GIS经度"
              width="100px"
            />
            <el-table-column
              prop="latitude"
              align="center"
              header-align="center"
              label="GIS纬度"
              width="100px"
            />
            <el-table-column
              prop="starting_time"
              align="center"
              header-align="center"
              label="开始经营时间"
              width="110px"
            />
            <el-table-column
              prop="ending_time"
              align="center"
              header-align="center"
              label="结束经营时间"
              width="110px"
            />
            <el-table-column
              prop="long_term_non_delivery"
              align="center"
              header-align="center"
              label="是否长期不要货"
              width="130px"
            />
            <el-table-column
              prop="operator_name"
              align="center"
              header-align="center"
              label="负责人姓名"
              width="100px"
            />
            <el-table-column
              prop="operator_telephone"
              align="center"
              header-align="center"
              label="经营者联系电话"
              width="130px"
            />
            <el-table-column
              prop="region"
              align="center"
              header-align="center"
              label="所属区域"
              width="100px"
            />
            <el-table-column
              prop="whitelist_customer"
              align="center"
              header-align="center"
              label="是否白名单客户（1是0否）"
              width="130px"
            />
          </el-table>
        </el-col>
      </el-row>
      <el-dialog
        v-model="dialogVisibleTable"
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
                @click.prevent="downloadTemplateTable"
                style="color: #409eff; text-decoration: underline"
                >{{ templateLabel }}</a
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
            <el-button @click="uploadTableClick" type="primary">提交</el-button>
            <el-button @click="dialogVisibleTable = false">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>
import {
  uploadCust,
  importKc,
  exportCust,
  exportEmp,
  exportInst,
  importCust,
  importEmp,
  importInst,
  searchCust,
  searchEmp,
  searchInst
} from '@/api/login'
import * as XLSX from 'xlsx'
import { useUserStore } from '@/store/modules/user'
export default {
  data() {
    return {
      downloadData: [],
      templateLabel: '',
      stashData: [],
      tableNameOptions: [
        {
          tableName: '机构表'
        },
        {
          tableName: '员工表'
        },
        {
          tableName: '客户信息表'
        }
      ],
      loading: false,
      total: 0, // 总记录数
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页记录数
      userId: '',
      dialogVisibleTable: false,
      form: {
        tableName: '机构表',
        loanData: [],
        instName: '',
        custName: '',
        empName: ''
      },
      formRules: {
        tableName: [{ required: true, message: '请选择表格名称', trigger: 'blur' }]
      }
    }
  },
  async created() {
    const userStore = useUserStore()
    const loginInfo = userStore.getUserInfo
    this.userId = loginInfo.userId
  },
  methods: {
    tableNameChange() {
      this.currentPage = 1
      this.form.loanData = []
      this.form.instName = ''
      this.form.custName = ''
      this.form.empName = ''
    },
    //导入新的库存
    async uploadTableClick() {
      try {
        // 确保文件已上传并处理完成
        await this.handleFileUploadTable() // 等待文件处理完成
        if (this.uploadArray.length === 0) {
          this.$message.warning('没有数据可以提交！')
          return
        }
        if (this.form.tableName === '机构表') {
          const payload = {
            data: this.uploadArray,
            userId: this.userId
          }
          const response = await importInst(payload) // 调用 upload 函数并传入 payload
          if (response.data.code === 200) {
            this.$message.success(response.data.data.message)
            this.dialogVisibleTable = false // 关闭弹窗
          } else {
            this.$message.error(response.data.data.message)
          }
        } else if (this.form.tableName === '员工表') {
          const payload = {
            data: this.uploadArray,
            userId: this.userId
          }
          const response = await importEmp(payload) // 调用 upload 函数并传入 payload
          if (response.data.code === 200) {
            this.$message.success(response.data.data.message)
            this.dialogVisibleTable = false // 关闭弹窗
          } else {
            this.$message.error(response.data.data.message)
          }
        } else if (this.form.tableName === '客户信息表') {
          const payload = {
            data: this.uploadArray,
            userId: this.userId
          }
          const response = await importCust(payload) // 调用 upload 函数并传入 payload
          if (response.data.code === 200) {
            this.$message.success(response.data.data.message)
            this.dialogVisibleTable = false // 关闭弹窗
          } else {
            this.$message.error(response.data.data.message)
          }
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

          if (this.form.tableName === '机构表') {
            const payload = {
              page: this.currentPage,
              pageSize: this.pageSize,
              instName: this.form.instName
            }
            const response = await searchInst(payload) // 调用 upload 函数并传入 payload
            if (response.data.code == 200) {
              this.form.loanData = response.data.data
              this.total = response.data.total
            } else {
              this.$message.error(response.data.data.message)
            }
          } else if (this.form.tableName === '员工表') {
            const payload = {
              page: this.currentPage,
              pageSize: this.pageSize,
              empName: this.form.empName
            }
            const response = await searchEmp(payload) // 调用 upload 函数并传入 payload
            if (response.data.code == 200) {
              this.form.loanData = response.data.data
              this.total = response.data.total
            } else {
              this.$message.error(response.data.data.message)
            }
          } else if (this.form.tableName === '客户信息表') {
            const payload = {
              page: this.currentPage,
              pageSize: this.pageSize,
              custName: this.form.custName
            }
            const response = await searchCust(payload) // 调用 upload 函数并传入 payload
            if (response.data.code == 200) {
              this.form.loanData = response.data.data
              this.total = response.data.total
            } else {
              this.$message.error(response.data.data.message)
            }
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
          this.$nextTick(() => {
            if (this.$refs.fileInput !== undefined) {
              this.$refs.fileInput.value = null
            }
          })
          this.dialogVisibleTable = true
          if (this.form.tableName === '机构表') {
            this.templateLabel = '机构模版表'
          } else if (this.form.tableName === '员工表') {
            this.templateLabel = '员工模版表'
          } else if (this.form.tableName === '客户信息表') {
            this.templateLabel = '客户信息模版表'
          }
        }
      }, 200)
    },
    handleFileUploadTable(event) {
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
          this.uploadArray = []
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
            this.uploadArray.push(rowObject)
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
    async downloadTemplateTable() {
      this.downloadData = []
      if (this.form.tableName === '机构表') {
        this.downloadData.push([
          '机构编码',
          '机构名称',
          '上级机构',
          '上级机构名称',
          '创建时间',
          '撤销时间'
        ])
      } else if (this.form.tableName === '员工表') {
        this.downloadData.push([
          '员工编号',
          '员工姓名',
          '权限类型（岗位性质）',
          '所属机构编码',
          '所属机构名称',
          '联系电话',
          '员工状态',
          '员工性别',
          '员工年龄'
        ])
      } else if (this.form.tableName === '客户信息表') {
        this.downloadData.push([
          '客户编码',
          '许可证号',
          '客户经理编码',
          '客户（企业）名称',
          '客户经营地址',
          'GIS经度',
          'GIS纬度',
          '开始经营时间',
          '结束经营时间',
          '客户终端层级',
          '客户分类（档位）',
          '信用等级',
          '经营状态',
          '是否长期不要货',
          '负责人姓名',
          '经营者联系电话',
          '市场类型（城网、农网）',
          '定额标准',
          '剩余定额标准',
          '所属区域',
          '是否白名单客户（1是0否）'
        ])
      }
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.aoa_to_sheet(this.downloadData) // Convert array of arrays to sheet
      ws['!cols'] = this.calculateColumnWidths(this.downloadData)
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1') // Append data to Sheet2
      const excelBlob = new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], {
        type: 'application/octet-stream'
      })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(excelBlob) // Create blob URL
      if (this.form.tableName === '机构表') {
        link.setAttribute('download', '机构模版表.xlsx') // Set file name
      } else if (this.form.tableName === '员工表') {
        link.setAttribute('download', '员工模版表.xlsx') // Set file name
      } else if (this.form.tableName === '客户信息表') {
        link.setAttribute('download', '客户信息模版表.xlsx') // Set file name
      }
      document.body.appendChild(link)
      link.click() // Trigger download
      document.body.removeChild(link) // Clean up the link
    },
    async exportClick() {
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
          if (this.form.tableName === '机构表') {
            this.stashData = []
            this.stashData.push([
              '机构编码',
              '机构名称',
              '上级机构',
              '上级机构名称',
              '创建时间',
              '撤销时间'
            ])
            const response = await exportInst({}) // 调用 upload 函数并传入 payload
            if (response.data.code == 200) {
              const loanData1 = response.data.data
              loanData1.forEach((result) => {
                this.stashData.push([
                  result.inst_code,
                  result.inst_name,
                  result.up_inst_code,
                  result.up_inst_name,
                  result.start_time,
                  result.end_time
                ])
              })
            } else {
              this.$message.error(response.data.data.message)
            }
          } else if (this.form.tableName === '员工表') {
            this.stashData = []
            this.stashData.push([
              '员工编号',
              '员工姓名',
              '权限类型（岗位性质）',
              '所属机构编码',
              '所属机构名称',
              '联系电话',
              '员工状态',
              '员工性别',
              '员工年龄'
            ])
            const response = await exportEmp({}) // 调用 upload 函数并传入 payload
            if (response.data.code == 200) {
              const loanData1 = response.data.data
              loanData1.forEach((result) => {
                this.stashData.push([
                  result.employee_code,
                  result.employee_name,
                  result.type,
                  result.inst_code,
                  result.inst_name,
                  result.telephone,
                  result.status,
                  result.gender,
                  result.age
                ])
              })
            } else {
              this.$message.error(response.data.data.message)
            }
          } else if (this.form.tableName === '客户信息表') {
            this.stashData = []
            this.stashData.push([
              '客户编码',
              '许可证号',
              '客户经理编码',
              '客户（企业）名称',
              '客户经营地址',
              'GIS经度',
              'GIS纬度',
              '开始经营时间',
              '结束经营时间',
              '客户终端层级',
              '客户分类（档位）',
              '信用等级',
              '经营状态',
              '是否长期不要货',
              '负责人姓名',
              '经营者联系电话',
              '市场类型（城网、农网）',
              '定额标准',
              '剩余定额标准',
              '所属区域',
              '是否白名单客户（1是0否）'
            ])
            const response = await exportCust({}) // 调用 upload 函数并传入 payload
            if (response.data.code == 200) {
              const loanData1 = response.data.data
              loanData1.forEach((result) => {
                this.stashData.push([
                  result.custom_code,
                  result.custom_license,
                  result.manager_code,
                  result.custom_name,
                  result.custom_address,
                  result.longitude,
                  result.latitude,
                  result.starting_time,
                  result.ending_time,
                  result.terminal_level,
                  result.custom_classification,
                  result.credit_rating,
                  result.business_status,
                  result.long_term_non_delivery,
                  result.operator_name,
                  result.operator_telephone,
                  result.market_type,
                  result.quota_standard,
                  result.remain_standard,
                  result.region,
                  result.whitelist_customer
                ])
              })
            } else {
              this.$message.error(response.data.data.message)
            }
          }
          const wb = XLSX.utils.book_new()
          const ws = XLSX.utils.aoa_to_sheet(this.stashData) // Convert array of arrays to sheet
          ws['!cols'] = this.calculateColumnWidths(this.stashData)
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1') // Append data to Sheet2
          const excelBlob = new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], {
            type: 'application/octet-stream'
          })
          const link = document.createElement('a')
          link.href = URL.createObjectURL(excelBlob) // Create blob URL
          if (this.form.tableName === '机构表') {
            link.setAttribute('download', '机构表.xlsx') // Set file name
          } else if (this.form.tableName === '员工表') {
            link.setAttribute('download', '员工表.xlsx') // Set file name
          } else if (this.form.tableName === '客户信息表') {
            link.setAttribute('download', '客户信息表.xlsx') // Set file name
          }
          document.body.appendChild(link)
          link.click() // Trigger download
          document.body.removeChild(link) // Clean up the link
        }
      }, 200)
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

:deep(.el-select__wrapper) {
  position: relative;
  display: flex;
  min-height: 40px !important;
  padding: 4px 12px;
  font-size: 14px;
  line-height: 40px !important;
  text-align: left;
  cursor: pointer;
  background-color: var(--el-fill-color-blank);
  border-radius: var(--el-border-radius-base);
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
  box-sizing: border-box;
  transition: var(--el-transition-duration);
  align-items: center;
  gap: 6px;
}
</style>
