<template>
  <div>
    {{dateTime}}
    <el-table
      :data="list"
      style="width: 100%"
      :default-sort="{prop: 'createdTime', order: 'desc'}"
      @sort-change="fetchData"
    >
      <el-table-column
        prop="createdTime"
        label="日期"
        sortable
        align="center"
      >
        <template slot-scope="props">
          {{ props.row.createdTime | dateformat(`YYYY-MM-DD HH:mm`) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        sortable
        label="标签"
      >
        <template slot-scope="props">
          <el-tag
            v-if="props.row.name!==``"
          >{{ props.row.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="url"
        align="center"
        sortable
        label="图片"
      >
        <template slot-scope="props">
          <img :src="props.row.url" v-if="props.row.url!==``" width="80px" height="80px" style="border-radius: 50%"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="num"
        align="center"
        sortable
        label="被关注数"
      >
      </el-table-column>
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
  import {findHealthTheme} from '@/api/data/index'
  export default {
    name: "labelData",
    props:['dateTime'],
    data() {
      return {
        list: [],
        currentPage: 1,
        size: 5,
        total: 0,
        isReady:false
      }
    },
    methods: {
      fetchData(val) {
        let sort = 'desc'
        let name = 'created_time'
        if (val !== undefined && val.prop === `createdTime`) {
          if (val.order === undefined) {
            name = 'created_time'
            sort = 'desc'
          }
          if (val.order === `descending`) {
            name = 'created_time'
            sort = 'desc'
          }
          if (val.order === `ascending`) {
            name = 'created_time'
            sort = 'asc'
          }
        }
        findHealthTheme(this.currentPage, '', this.size, name, sort).then(res => {
          if (res.queue.code === 1) {
            this.list = res.data.list
            res.data.list.forEach(item=>{
              item.id=item.healthTheme.id
              item.name=item.healthTheme.name
              item.url=item.healthTheme.url
              item.createdTime=item.healthTheme.createdTime
              item.num=item.num
            })
            this.total = res.data.total
          }
        })
      }
    },
    mounted() {

      this.fetchData()
    },
  }
</script>

<style scoped>

</style>
