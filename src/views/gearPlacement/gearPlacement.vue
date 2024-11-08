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
          <el-table :data="allocationResults" style="width: 100%; height: 310px">
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
      tobaccoArray: [
        {
          range: [0, 30],
          ratio: 0
        },
        {
          range: [31, 50],
          ratio: 0
        },
        {
          range: [51, 100],
          ratio: 0.15
        },
        {
          range: [101, 150],
          ratio: 0.15
        },
        {
          range: [151, 200],
          ratio: 0.1
        },
        {
          range: [201, 250],
          ratio: 0.1
        },
        {
          range: [251, 300],
          ratio: 0.1
        },
        {
          range: [301, 350],
          ratio: 0.1
        },
        {
          range: [351, 400],
          ratio: 0.1
        },
        {
          range: [401, 450],
          ratio: 0.1
        },
        {
          range: [451, 500],
          ratio: 0.1
        },
        {
          range: [401, 450],
          ratio: 0.1
        },
        {
          range: [451, 500],
          ratio: 0.1
        },

        {
          range: [501, 550],
          ratio: 0.05
        },
        {
          range: [551, 600],
          ratio: 0.05
        },
        {
          range: [601, 650],
          ratio: 0.05
        },
        {
          range: [651, 700],
          ratio: 0.05
        },
        {
          range: [701, 750],
          ratio: 0.05
        },
        {
          range: [751, 800],
          ratio: 0.05
        },
        {
          range: [801, 850],
          ratio: 0.1
        },
        {
          range: [851, 900],
          ratio: 0.05
        },
        {
          range: [901, 950],
          ratio: 0.05
        },
        {
          range: [951, 1000],
          ratio: 0.05
        },
        {
          range: [1001, 1200],
          ratio: 0.04
        },
        {
          range: [1201, 1400],
          ratio: 0.05
        },
        {
          range: [1401, 1600],
          ratio: 0.04
        },
        {
          range: [1601, 1800],
          ratio: 0.05
        },
        {
          range: [1801, 2000],
          ratio: 0.04
        },
        {
          range: [2001, 2200],
          ratio: 0.04
        },
        {
          range: [1801, 2000],
          ratio: 0.04
        },
        {
          range: [2001, 2200],
          ratio: 0.04
        },
        {
          range: [2201, 2400],
          ratio: 0.04
        },
        {
          range: [2401, 2600],
          ratio: 0.04
        },
        {
          range: [2601, 2800],
          ratio: 0.04
        },
        {
          range: [2801, 3000],
          ratio: 0.04
        },
        {
          range: [3001, 3200],
          ratio: 0.04
        },
        {
          range: [3201, 3400],
          ratio: 0.04
        },
        {
          range: [3401, 3600],
          ratio: 0.04
        }
      ],
      downTobaccoArray: [],
      baccoArray: [],
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
      allocationResults: []
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
    calculateDistribution() {
      // 初始化数组含30个0
      const allocations = Array(this.customerLevels).fill(0)
      //得到总客户数
      const totalCustomers = this.customers.reduce((sum, num) => sum + num, 0)
      this.allocationResults = this.skus
        .map((sku) => {
          // 烟的条数
          let remainingStock = sku.stock
          const remainingStockBox = sku.stock / 250
          const entry = this.tobaccoArray.find(
            (item) => remainingStockBox >= item.range[0] && remainingStockBox <= item.range[1]
          )
          const Reduceratio = 1 - entry.ratio
          for (let level = this.customerLevels - 1; level >= 0 && remainingStock > 0; level--) {
            //从高到低每一档的客户数
            const levelCustomers = this.customers[level]
            if (level == 29) {
              allocations[level] = sku.stock30
              remainingStock -= allocations[level] * levelCustomers
            } else {
              if (sku.stock1 > 0) {
                //得到当前档位之后的数组
                const customersWithout = this.customers.filter((_, index) => index < level + 1)
                // 计算剩下档位的客户数依次乘以固定值后相加
                const totalSum = customersWithout.reduce(
                  (sum, customer) => sum + customer * sku.stock1,
                  0
                )
                //当前档位总数乘和大于成剩余的档位数，重复循坏，除非等于最小档数，退出循环
                if (totalSum >= remainingStock) {
                  remainingStock -= allocations[level] * levelCustomers
                  for (let i = level; i >= 0; i--) {
                    allocations[i] = sku.stock1 // 赋值为固定值
                  }
                  break // 退出循环
                } else {
                  for (let j = 1; j <= 999; j++) {
                    allocations[level] = Math.round(
                      allocations[29] * (Reduceratio ** (29 - level)) ** j
                    )
                    const remainNext = remainingStock - allocations[level] * this.customers[level]
                    const customersWithoutNext = this.customers.filter((_, index) => index < level)
                    // 计算剩下的客户数依次乘以固定值后相加
                    const totalSumNext = customersWithoutNext.reduce(
                      (sum, customer) => sum + customer * sku.stock1,
                      0
                    )
                    //分配完后剩余档数和最小条数乘和大于烟的剩余，重复循坏，除非等于最小档数，退出循环
                    if (totalSumNext >= remainNext) {
                      if (allocations[level] <= sku.stock1) {
                        remainingStock -= allocations[level] * levelCustomers
                        for (let i = level; i >= 0; i--) {
                          this.allocations[i] = sku.stock1 // 赋值为固定值
                        }
                        break
                      }
                    } else {
                      if (allocations[level] < sku.stock1) {
                        allocations[level] = sku.stock1
                      }
                      remainingStock -= allocations[level] * levelCustomers
                      break
                    }
                  }
                }
              } else {
                if (remainingStock > 0) {
                  allocations[level] = sku.stock30
                  remainingStock -= allocations[level] * levelCustomers
                } else {
                  for (let i = level; i >= 0; i--) {
                    this.allocations[i] = sku.stock1 // 赋值为固定值
                  }
                }
              }
            }
          }
          const totalSumFinal = allocations.reduce((sum, value, index) => {
            return sum + value * this.customers[index] // 相乘并累加
          }, 0)
          return {
            sku: sku.sku,
            stockOld: sku.stockOld,
            stock: sku.stock,
            name: sku.name,
            allocations,
            remaining: totalSumFinal / 250
          }
        })
        .filter((result) => result.sku !== '')
      this.allocationResults.forEach((item) => {
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
      this.allocationResults.forEach((result) => {
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
