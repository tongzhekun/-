<template>
  <div class="container">
    <el-form :model="formData" ref="formRef">
      <el-row type="flex" justify="center">
        <el-col :span="5" style="text-align: left">
          <!-- <el-form-item label="日期：" prop="selectedDate">
            <el-date-picker v-model="selectedDate" />
          </el-form-item> -->
          <label for="ratio">30级与1级客户分配比例: </label>
        </el-col>
        <el-col :span="3" style="margin-left: -25px; text-align: left">
          <el-input v-model.number="formData.ratio" min="1" />
        </el-col>
        <el-col :span="15" style="margin-left: 20px; text-align: left">
          <!-- <el-button type="primary" round>查询</el-button> -->
          <el-button type="info" round @click="tobacooDialog">卷烟参数上传</el-button>
          <el-button type="danger" round @click="customDialog">档位客户上传</el-button>
          <!-- <el-button type="success" round>确认</el-button> -->
          <el-button type="success" round @click="calculateDistribution">计算分配</el-button>
          <el-button type="warning" round @click="exportToCSV">导出为CSV</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="margin-top: 20px; text-align: center">
          <span style="font-size: 20px; color: #000">档位投放明细</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="margin-top: 20px; text-align: center">
          <el-table :data="allocationResultsPer" style="width: 100%; height: 310px">
            <el-table-column prop="name" fixed label="名称" />
            <el-table-column prop="stockOld" label="可供量" />
            <el-table-column prop="remaining" label="测算值" />
            <el-table-column v-for="level in reversedLevels" :key="level" :label="level + '档'">
              <template v-slot="scope">
                {{ scope.row.allocations[reversedLevels.indexOf(level)] }}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-dialog
        v-model="dialogVisibleTobacco"
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
                @click.prevent="downloadTemplateTobacco"
                style="color: #409eff; text-decoration: underline"
                >烟参数表</a
              >
            </el-col>
          </el-row>
          <el-row style="margin-top: 15px">
            <el-col :span="4">
              <span>上传文件(CSV格式):</span>
            </el-col>
            <el-col :span="5">
              <input
                type="file"
                ref="fileInputTobacco"
                @change="handleFileUploadTobacco"
                accept=".csv"
              />
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col :span="24" style="margin-top: 20px; text-align: center">
            <el-button @click="uploadTobaccoClick" type="primary">提交</el-button>
            <el-button @click="dialogVisibleTobacco = false">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
      <el-dialog
        v-model="dialogVisibleCust"
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
                @click.prevent="downloadTemplateCust"
                style="color: #409eff; text-decoration: underline"
                >客户参数表</a
              >
            </el-col>
          </el-row>
          <el-row style="margin-top: 15px">
            <el-col :span="4">
              <span>上传文件(CSV格式):</span>
            </el-col>
            <el-col :span="5">
              <input type="file" ref="fileInputCust" @change="handleFileUploadCust" accept=".csv" />
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col :span="24" style="margin-top: 20px; text-align: center">
            <el-button @click="uploadCustClick" type="primary">提交</el-button>
            <el-button @click="dialogVisibleCust = false">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>
import { uploadTobacco, dowloadTobacco, uploadCust, dowloadCust } from '@/api/login'
import { useForm } from '@/hooks/web/useForm'
const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose, setValues } = formMethods
export default {
  data() {
    return {
      downTobaccoArray: [],
      downCustArray: [],
      PATH_URL: import.meta.env.VITE_API_BASE_PATH,
      dialogVisibleTobacco: false,
      dialogVisibleCust: false,
      formData: {
        ratio: 5,
        selectedDate: ''
      },
      formRules: {
        selectedDate: [{ required: true, message: '日期不能为空', trigger: 'blur' }]
      },
      selectedDate: '',
      reversedLevels: '',
      levels: Array.from({ length: 30 }, (_, index) => index + 1),
      customerLevels: 30,
      // customers: Array(30).fill(100),
      customers: [],
      skus: [],
      skusArray: [],
      // ratio: 5,
      allocationResults: [],
      allocationResultsPer: []
    }
  },
  created() {
    this.reversedLevels = this.levels.slice().reverse()
  },
  methods: {
    //上传附件把把烟的参数表存入临时表内
    async uploadTobaccoClick() {
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
          this.dialogVisibleTobacco = false // 关闭弹窗
        } else {
          this.$message.error(response.data.data.message)
        }
      } catch (error) {
        this.$message.error('上传失败')
      }
    },
    //上传附件把把客户的数量表存入临时表内
    async uploadCustClick() {
      try {
        const payload = {
          customers: this.customers
        }
        const response = await uploadCust(payload) // 调用 upload 函数并传入 payload
        if (response.data.code == 200) {
          this.$message.success(response.data.data.message)
          this.dialogVisibleCust = false // 关闭弹窗
        } else {
          this.$message.error(response.data.data.message)
        }
      } catch (error) {
        this.$message.error(response.data.data.message)
      }
    },
    //点击卷烟参数上传
    tobacooDialog() {
      this.$nextTick(() => {
        if (this.$refs.fileInputTobacco !== undefined) {
          this.$refs.fileInputTobacco.value = null
        }
      })
      this.dialogVisibleTobacco = true
    },
    customDialog() {
      this.$nextTick(() => {
        if (this.$refs.fileInputCust !== undefined) {
          this.$refs.fileInputCust.value = null
        }
      })
      this.dialogVisibleCust = true
    },
    handleFileUploadCust(event) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        const lines = e.target.result.split('\n').slice(1)
        this.customers = lines
          .map((line) => {
            const [_, num] = line.split(',')
            return Number(num)
          })
          .slice(0, 30)
      }
      reader.readAsText(file, 'UTF-8')
    },
    handleFileUploadTobacco(event) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        const lines = e.target.result.split('\n').slice(1)
        this.skus = lines.map((line) => {
          const [sku, name, stock] = line.split(',')
          return {
            sku,
            name,
            stockOld: parseInt(stock, 10) || 0,
            stock: (parseInt(stock, 10) || 0) * 250
          }
        })
        this.skusArray = lines.map((line) => {
          const [sku, name, stock] = line.split(',')
          return {
            sku,
            name,
            stock: parseInt(stock, 10) || 0
          }
        })
      }
      reader.readAsText(file, 'UTF-8')
    },
    calculateDistribution() {
      // 计算总客户数
      console.log(this.customers, this.skus, 'this.skusthis.skus')
      const totalCustomers = this.customers.reduce((sum, num) => sum + num, 0)
      this.allocationResults = this.skus
        .map((sku) => {
          // 烟的条数
          let remainingStock = sku.stock
          // 初始化数组含30个0
          const allocations = Array(this.customerLevels).fill(0)
          //如果烟的条数大于客户总数
          if (sku.stock > totalCustomers) {
            for (let level = this.customerLevels - 1; level >= 0 && remainingStock > 0; level--) {
              //从高到低每一档的客户数
              const levelCustomers = this.customers[level]
              //如果客户数大于0
              if (levelCustomers > 0) {
                //分配当前级别的客户数作为烟的条数
                allocations[level] = levelCustomers
                remainingStock -= allocations[level]
              }
            }
            for (let i = 1; i <= 999; i++) {
              for (let level = this.customerLevels - 1; level >= 0 && remainingStock > 0; level--) {
                const levelCustomers = this.customers[level]
                if (level === this.customerLevels - 1 && sku.stock >= totalCustomers * 1.5) {
                  const lv30Number =
                    allocations[this.customerLevels - 1] / this.customers[this.customerLevels - 1]
                  const lv1Number = allocations[0] / this.customers[0]
                  const needAddFive =
                    this.customers[this.customerLevels - 1] *
                    (lv1Number * this.formData.ratio - lv30Number)
                  if (
                    lv30Number / lv1Number < this.formData.ratio &&
                    remainingStock >= needAddFive
                  ) {
                    remainingStock -= needAddFive
                    allocations[this.customerLevels - 1] += needAddFive
                  }
                } else if (level === this.customerLevels - 1 && sku.stock < totalCustomers * 1.5) {
                  if (remainingStock > 0) {
                    allocations[level] += levelCustomers
                    remainingStock -= levelCustomers
                  }
                } else if (levelCustomers > 0 && remainingStock >= levelCustomers) {
                  if (sku.stock >= totalCustomers * 1.5) {
                    if (
                      level > 0 ||
                      remainingStock >=
                        this.customers[0] +
                          this.customers[this.customerLevels - 1] * this.formData.ratio
                    ) {
                      allocations[level] += levelCustomers
                      remainingStock -= levelCustomers
                    }
                  } else {
                    allocations[level] += levelCustomers
                    remainingStock -= levelCustomers
                  }
                }
              }
            }
          } else {
            for (let level = this.customerLevels - 1; level >= 0 && remainingStock > 0; level--) {
              const levelCustomers = this.customers[level]
              // if (levelCustomers > 0 && remainingStock >= levelCustomers) {
              if (remainingStock > 0) {
                allocations[level] = levelCustomers
                remainingStock -= allocations[level]
              }
              // }
            }
            for (let level = this.customerLevels - 1; level >= 0 && remainingStock > 0; level--) {
              const levelCustomers = this.customers[level]
              if (levelCustomers > 0 && remainingStock >= levelCustomers) {
                if (
                  level === this.customerLevels - 1 ||
                  allocations[level + 1] / this.customers[level + 1] >
                    allocations[level] / this.customers[level]
                ) {
                  allocations[level] = levelCustomers
                  remainingStock -= allocations[level]
                }
              }
            }
          }
          allocations.push(remainingStock)
          return {
            sku: sku.sku,
            stockOld: sku.stockOld,
            stock: sku.stock,
            name: sku.name,
            allocations,
            remaining: (sku.stock - remainingStock) / 250
          }
        })
        .filter((result) => result.sku !== '')
      this.allocationResultsPer = this.allocationResults.map((result) => {
        const perCustomerAllocations = result.allocations.slice(0, -1).map((allocation, index) => {
          const customerCount = this.customers[index]
          return customerCount > 0 ? allocation / customerCount : 0
        })

        return {
          sku: result.sku,
          name: result.name,
          stockOld: result.stockOld,
          stock: result.stock,
          allocations: perCustomerAllocations,
          remaining: result.remaining
        }
      })
      this.allocationResults.forEach((item) => {
        item.allocations = item.allocations.slice().reverse()
      })
      this.allocationResultsPer.forEach((item) => {
        item.allocations = item.allocations.slice().reverse()
      })
    },
    //下载模版(把临时表里面的最新数据)
    async downloadTemplateTobacco() {
      try {
        const payload = {}
        const response = await dowloadTobacco(payload) // 调用 upload 函数并传入 payload
        if (response.data.code == 200) {
          let csv = 'SKU,name,Stock' + '\n'
          this.downTobaccoArray = response.data.data.list
          if (this.downTobaccoArray.length > 0) {
            this.downTobaccoArray.forEach((result, index) => {
              csv += `${result.sku},${result.name},${result.stock.toString()}\n`
            })
          }
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.setAttribute('download', '烟参数表.csv')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.$message.success(response.data.data.message)
          this.dialogVisibleTobacco = false // 关闭弹窗
        } else {
          this.$message.error(response.data.data.message)
        }
      } catch (error) {
        this.$message.error('下载失败')
      }
    },
    async downloadTemplateCust() {
      try {
        const payload = {}
        const response = await dowloadCust(payload) // 调用 upload 函数并传入 payload
        if (response.data.code == 200) {
          let csv = 'gear,num' + '\n'
          this.downCustArray = response.data.data.list
          if (this.downCustArray.length > 0) {
            this.downCustArray.forEach((result, index) => {
              csv += `${result.gear},${result.num.toString()}\n`
            })
          }
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.setAttribute('download', '客户参数表.csv')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.$message.success(response.data.data.message)
          this.dialogVisibleCust = false // 关闭弹窗
        } else {
          this.$message.error(response.data.data.message)
        }
      } catch (error) {
        this.$message.error('下载失败')
      }
    },
    exportToCSV() {
      let csv =
        '编码,名称,可供量,预测值,' +
        Array.from({ length: this.customerLevels }, (_, i) => `${30 - i}档`).join(',') + // 从 30 开始递减到 1
        '\n' // 继续添加表头，最后添加换行符
      this.allocationResultsPer.forEach((result) => {
        csv += `${result.sku},${result.name},${result.stockOld},${result.remaining},${result.allocations.join(',')}\n`
      })
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', '档位投放表.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
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

table,
th,
td {
  border: 1px solid black;
}

th,
td {
  padding: 8px;
  text-align: center;
}

.el-table thead th {
  font-weight: 600;
  color: #000;
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
