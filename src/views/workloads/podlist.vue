<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Pod Name" min-widthd>
        <template slot-scope="scope">
          {{ scope.row.Name }}
        </template>
      </el-table-column>
      <el-table-column label="NameSpace" min-widthd align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.NameSpace }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Images" min-widthd align="center">
        <template slot-scope="scope">
          {{ scope.row.Images }}
        </template>
      </el-table-column>
      <el-table-column label="所在节点" min-widthd align="center">
        <template slot-scope="scope">
          {{ scope.row.NodeName }}
        </template>
      </el-table-column>
      <el-table-column label="当前状态" min-widthd align="center">
        <template slot-scope="scope">
          {{ scope.row.Phase }}
        </template>
      </el-table-column>
      <el-table-column label="当前IP" min-widthd align="center">
        <template slot-scope="scope">
          {{ scope.row.IP }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-widthd align="center">
        <template slot-scope="scope">
          {{ scope.row.CreateTime }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/pods'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList("default").then(response => {
        this.list = response.data
        this.listLoading = false
      })
    }
  }
}
</script>
