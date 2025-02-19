<template>
  <div class="container">
    <el-form :model="form" ref="formRef" :rules="formRules" label-width="150px">
      <el-row type="flex" justify="center" style="margin-top: -15px; text-align: left">
        <el-col :span="9">
          <el-form-item label="客户名称：" prop="custom_name">
            <el-autocomplete
              @change="inputName"
              v-model="form.custom_name"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入客户名称"
              style="width: 85%; height: 40px"
              @select="handleSelect"
            />
          </el-form-item>
          <el-form-item label="终端层级：" prop="terminal_level">
            <el-input
              class="inputClass"
              v-model="form.terminal_level"
              :disabled="true"
              style="width: 85%; height: 40px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="许可证号：" prop="custom_license">
            <el-input
              class="inputClass"
              v-model="form.custom_license"
              :disabled="true"
              style="width: 85%; height: 40px"
            />
          </el-form-item>
          <el-form-item label="经营者电话：" prop="operator_telephone">
            <el-input
              class="inputClass"
              v-model="form.operator_telephone"
              :disabled="true"
              style="width: 85%; height: 40px"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" style="margin-top: 5px">
        <el-col :span="24">
          <el-table
            :data="form.loanData"
            :header-cell-style="{ color: '#212121' }"
            style="width: 99%; height: 200px; margin-top: 5px; text-align: center"
          >
            <el-table-column
              prop="material_code"
              header-align="center"
              fixed
              align="center"
              label="物料编号"
              width="auto"
            />
            <el-table-column
              prop="material_name"
              header-align="center"
              fixed
              align="center"
              label="物料名称"
              width="auto"
            />
            <el-table-column
              prop="qr_code"
              align="center"
              header-align="center"
              label="物料二维码编号"
              width="auto"
            />
            <el-table-column
              prop="project"
              align="center"
              header-align="center"
              label="操作"
              width="auto"
            >
              <template #default="scope">
                <el-button round type="success" size="small" @click.prevent="editClick(scope.row)"
                  >修改
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-dialog
        v-model="dialogVisible"
        title="物料信息"
        width="800px"
        style="height: 500px; overflow: auto"
        class="centered-dialog custom-width-dialog"
      >
        <el-row type="flex" justify="center" style="margin-top: 5px">
          <el-col :span="12">
            <el-form-item label="物料编码：" prop="material_code">
              <el-input
                v-model="formDialog.material_code"
                :disabled="true"
                style="width: 85%; height: 40px"
                placeholder="请输入物料编码"
              />
            </el-form-item>
            <el-form-item label="二维码：" prop="qr_code">
              <el-input
                v-model="formDialog.qr_code"
                style="width: 85%; height: 40px"
                placeholder="请输入二维码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物料名称：" prop="material_name">
              <el-input
                v-model="formDialog.material_name"
                :disabled="true"
                style="width: 85%; height: 40px"
                placeholder="请输入物料名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align: center">
            <el-button type="primary" @click="submitClick">提交</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import { searchQrCode, updateQrCode, searchCustList, userMessage } from '@/api/login'
import * as XLSX from 'xlsx'
import { useUserStore } from '@/store/modules/user'
export default {
  name: 'GpsInformation',
  data() {
    return {
      dialogVisible: false,
      materialCodeArray: [],
      materialNameArray: [],
      qrCodeArray: [],
      materialCodeString: '',
      materialNameString: '',
      qrCodeString: '',
      customArray: [],
      userId: '',
      formDialog: {
        material_code: '',
        material_name: '',
        qr_code: '',
        id: ''
      },
      form: {
        loanData: [],
        inst_code: '',
        inst_name: '',
        user_id: '',
        user_name: '',
        telephone: '',
        custom_name: '',
        terminal_level: '',
        custom_license: '',
        operator_telephone: ''
      },
      formRules: {}
    }
  },
  async created() {
    const userStore = useUserStore()
    const loginInfo = userStore.getUserInfo
    this.userId = loginInfo.userId
    this.form.user_id = loginInfo.userId
    const response = await userMessage({ userId: this.userId })
    this.form.user_name = response.data.data[0].employee_name
    this.form.inst_code = response.data.data[0].inst_code
    this.form.inst_name = response.data.data[0].inst_name
    this.form.telephone = response.data.data[0].telephone
  },
  methods: {
    async submitClick() {
      const updateResponse = await updateQrCode({
        id: this.formDialog.id,
        qr_code: this.formDialog.qr_code
      })
      this.$message.success(updateResponse.data.message)
      this.dialogVisible = false
      const qrResponse = await searchQrCode({ custom_license: this.form.custom_license })
      this.form.loanData = qrResponse.data.data
    },
    async editClick(row) {
      this.dialogVisible = true
      this.formDialog.material_code = row.material_code
      this.formDialog.material_name = row.material_name
      this.formDialog.qr_code = row.qr_code
      this.formDialog.id = row.id
    },
    async querySearchAsync(queryString, cb) {
      const responseResult = await searchCustList({
        custom_name: queryString,
        user_id: this.form.user_id
      })
      this.customArray = []
      responseResult.data.data.forEach((item) => {
        this.customArray.push({
          value: item.custom_name,
          custom_name: item.custom_name,
          terminal_level: item.terminal_level,
          custom_license: item.custom_license,
          operator_telephone: item.operator_telephone,
          id: item.id
        })
      })
      cb(this.customArray)
    },
    async handleSelect(item) {
      this.form.custom_name = item.custom_name
      this.form.terminal_level = item.terminal_level
      this.form.custom_license = item.custom_license
      this.form.operator_telephone = item.operator_telephone
      const qrResponse = await searchQrCode({ custom_license: item.custom_license })
      this.form.loanData = qrResponse.data.data
      this.$forceUpdate()
    },
    inputName() {
      this.form.terminal_level = ''
      this.form.custom_license = ''
      this.form.operator_telephone = ''
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
:deep(.el-input__wrapper) {
  height: 40px;
  align-items: center;
  background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
  background-image: none;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
  cursor: text;
  display: inline-flex;
  flex-grow: 1;
  justify-content: center;
  padding: 1px 11px;
  transform: translateZ(0);
  transition: var(--el-transition-box-shadow);
}
</style>
