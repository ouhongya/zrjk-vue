<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column
        prop="createdTime"
        label="上传时间"
        align="center"
      >
        <template slot-scope="props">
          {{ props.row.createdTime | dateformat('YYYY-MM-DD HH:mm') }}
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="标题"
        align="center">
      </el-table-column>
      <el-table-column
        prop="url"
        align="center"
        label="缩略图">
        <template slot-scope="props">
          <el-image
            style="width: 100px; height: 100px"
            :src="props.row.url"
            :preview-src-list="[props.row.url]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="doctorName"
        align="center"
        label="医生名称">
      </el-table-column>
      <el-table-column
        prop="department"
        align="center"
        label="职位名称">
      </el-table-column>
      <el-table-column
        prop="department"
        align="center"
        label="状态">
        <template slot-scope="props">
          {{props.row.state===1?'上架':'下架'}}
        </template>
      </el-table-column>

      <el-table-column
        prop="num"
        align="center"
        sortable
        label="被关注数"
      />
    </el-table>
    <el-pagination
      :current-page.sync="currentPage"
      :page-size="size"
      layout="total, prev, pager, next"
      :total="total"
      style="text-align: center"
      @size-change="fetchData"
      @current-change="fetchData"
    />
  </div>
</template>

<script>
  import {findArticle} from '@/api/data/index'
  export default {
    name: "articleData",
    data() {
      return {
        list: null,
        search: null,
        currentPage: 1,
        total: 0,
        size: 10,
        id: 'default',
      }
    },
    methods: {
      fetchData(val) {
        let sort = 'desc'
        let name = 'created_time'
        findArticle(this.currentPage, '', this.size, name, sort).then(res => {
          if (res.queue.code === 1) {
            res.data.list.forEach(item=>{
              item.id=item.article.id
              item.name=item.article.name
              item.url=item.article.url
              item.content=item.article.content
              item.createdTime=item.article.createdTime
              item.state=item.article.state
              item.doctorName=item.article.doctorName
              item.department=item.article.department
              item.num=item.num
            })
            this.list = res.data.list
            this.total = res.data.total
          }
        })
      },
    },
    created() {
      this.fetchData()
    },
  }
</script>

<style scoped>

</style>
