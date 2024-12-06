<template>
  <el-dialog
    v-model="dialogVisible"
    title="消息提醒"
    width="1000px"
    class="centered-dialog custom-width-dialog"
  >
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
    </el-table>
  </el-dialog>
</template>

<script>
import { searchHistoryCk } from '@/api/login'
import * as XLSX from 'xlsx'
import { useUserStore } from '@/store/modules/user'
export default {
  data() {
    return {
      dialogVisible: false,
      loading: false,
      total: 0, // 总记录数
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页记录数
      userId: '',
      form: {
        instCode: '',
        materialName: '',
        loanData: []
      },
      formRules: {}
    }
  },
  mounted() {
    const userStore = useUserStore()
    const loginInfo = userStore.getUserInfo
    this.userId = loginInfo.userId
    this.searchClick()
  },
  created() {},
  methods: {
    async fetchData() {
      this.loading = true
      const payload = {
        page: this.currentPage,
        pageSize: this.pageSize,
        instCode: '100001',
        materialName: ''
      }
      const response = await searchHistoryCk(payload) // 调用 upload 函数并传入 payload
      if (response.data.code == 200) {
        this.form.loanData = response.data.data
        this.total = response.data.total
      } else {
        this.$message.error(response.data.data.message)
      }
      this.loading = false
    },
    async searchClick() {
      this.currentPage = 1
      this.fetchData()
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
