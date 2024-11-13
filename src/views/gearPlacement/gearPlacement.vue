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
          <el-button type="info" round @click="decayRuleDialog">衰减速率规则上传</el-button>
          <!-- <el-button type="success" round>确认</el-button> -->
          <el-button type="success" round @click="calculateDistribution">计算分配</el-button>
          <el-button type="warning" round @click="exportToCSV">导出为CSV</el-button>
          <!-- <el-button type="danger" round @click="exportToCSV">手工更新</el-button> -->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="margin-top: 30px; text-align: center">
          <span style="font-size: 20px; color: #000">档位投放明细</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="margin-top: 20px; margin-bottom: 10px; text-align: center">
          <el-table :data="allocationResults" style="width: 100%; height: 330px">
            <el-table-column prop="name" fixed label="名称" />
            <el-table-column prop="stockOld" label="销售量" />
            <el-table-column prop="remaining" label="可供量" />
            <el-table-column v-for="level in reversedLevels" :key="level" :label="level + '档'">
              <template v-slot="scope">
                <el-input
                  v-if="scope.row.edit"
                  v-model="scope.row.allocations[reversedLevels.indexOf(level)]"
                  size="small"
                  @blur="handleInputBlur(scope.row)"
                >
                </el-input>

                <span v-else> {{ scope.row.allocations[reversedLevels.indexOf(level)] }}</span>
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
      <el-dialog
        v-model="dialogVisibleDecayRule"
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
                @click.prevent="downloadTemplateDecayRule"
                style="color: #409eff; text-decoration: underline"
                >衰减速率规则表</a
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
                ref="fileInputDecayRule"
                @change="handleFileUploadDecayRule"
                accept=".csv"
              />
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col :span="24" style="margin-top: 20px; text-align: center">
            <el-button @click="uploadDecayRuleClick" type="primary">提交</el-button>
            <el-button @click="dialogVisibleDecayRule = false">取消</el-button>
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
  dowloadCust,
  uploadDecayRule,
  downloadDecayRule,
  queryDecayRules
} from '@/api/login'
import { useForm } from '@/hooks/web/useForm'
const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose, setValues } = formMethods
export default {
  data() {
    return {
      downTobaccoArray: [],
      baccoArray: [],
      downCustArray: [],
      downDecayRuleArray: [],
      PATH_URL: import.meta.env.VITE_API_BASE_PATH,
      dialogVisibleTobacco: false,
      dialogVisibleCust: false,
      dialogVisibleDecayRule: false,
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
      decayRules: [],
      skus: [],
      skusArray: [],
      decayRulesArray: [],
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
    //上传附件把把烟的参数表存入临时表内
    async uploadDecayRuleClick() {
      for (let i = this.decayRulesArray.length - 1; i >= 0; i--) {
        if (this.decayRulesArray[i].stocks === '') {
          this.decayRulesArray.splice(i, 1) // 删除该对象
        }
      }
      try {
        const payload = {
          decayRules: this.decayRules
        }
        const response = await uploadDecayRule(payload) // 调用 upload 函数并传入 payload
        if (response.data.code == 200) {
          this.$message.success(response.data.data.message)
          this.dialogVisibleDecayRule = false // 关闭弹窗
        } else {
          this.$message.error(response.data.data.message)
        }
      } catch (error) {
        this.$message.error('上传失败')
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

    //衰减速率规则上传
    decayRuleDialog() {
      this.$nextTick(() => {
        if (this.$refs.fileInputDecayRule !== undefined) {
          this.$refs.fileInputDecayRule.value = null
        }
      })
      this.dialogVisibleDecayRule = true
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

    //处理速率规则表上传
    handleFileUploadDecayRule(event) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        const lines = e.target.result.split('\n').slice(1)
        this.decayRules = lines.map((line) => {
          const [stocks, lev30Num, decayRate, remark] = line.split(',')
          return {
            stocks,
            lev30Num,
            decayRate,
            remark
          }
        })
        this.decayRulesArray = lines.map((line) => {
          const [stocks, lev30Num, decayRate, remark] = line.split(',')
          return {
            stocks,
            lev30Num,
            decayRate,
            remark
          }
        })
      }
      reader.readAsText(file, 'UTF-8')
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

    //按照挡位进行分配
    async calculateDistribution() {
      const payload = {}
      //查询所有的速率数据
      const response = await queryDecayRules(payload) // 调用 upload 函数并传入 payload
      if (response.data.code == 200) {
        this.tobaccoArrays = response.data.data.list
      } else {
        this.$message.error(response.data.data.message)
      }
      // 初始化数组含30个0
      const allocations = Array(this.customerLevels).fill(0)
      //得到总客户数
      const totalCustomers = this.customers.reduce((sum, num) => sum + num, 0)
      this.allocationResults = this.skus
        .map((sku) => {
          // 烟的条数
          let remainingStock = sku.stock
          const remainingStockBox = sku.stock / 250 //可供量（箱数）

          const entry = this.tobaccoArrays.find(
            (item) => remainingStockBox >= item.stocks[0] && remainingStockBox <= item.stocks[1]
          )
          const Reduceratio = 1 - entry.decayRate
          for (let level = this.customerLevels - 1; level >= 0 && remainingStock > 0; level--) {
            //从高到低每一档的客户数
            const levelCustomers = this.customers[level] //客户数
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
    //下载衰减速率规则模板
    async downloadTemplateDecayRule() {
      try {
        const payload = {}
        const response = await downloadDecayRule(payload) // 调用 upload 函数并传入 payload
        if (response.data.code == 200) {
          let csv = 'stocks,lev30Num,decayRate,remark' + '\n'
          this.downDecayRuleArray = response.data.data.list
          if (this.downDecayRuleArray.length > 0) {
            this.downDecayRuleArray.forEach((result, index) => {
              csv += `${result.stocks},${result.lev30Num.toString()},${result.decayRate.toString()},${result.remark}\n`
            })
          }
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.setAttribute('download', '衰减速率定量规则表.csv')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          this.$message.success(response.data.data.message)
          this.dialogVisibleDecayRule = false // 关闭弹窗
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
