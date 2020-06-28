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
            :src="props.row.coverUrl"
            :preview-src-list="[props.row.coverUrl]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="视频URL">
        <template slot-scope="props">
          <el-popover
            placement="top-start"
            title="URL"
            trigger="hover"
            :content="props.row.url">
            <el-button slot="reference" type="text" style="color:#606266;">视频播放地址</el-button>
          </el-popover>
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
  import {findVideo} from '@/api/data/index'

  export default {
    name: "videoData",
    data() {
      return {
        list: null,
        currentPage: 1,
        total: 0,
        size: 10,
        id: `default`,
      }
    },
    methods: {
      fetchData() {
        let sort = 'desc'
        let name = 'created_time'
        findVideo(this.currentPage, '', this.size, name, sort).then(res => {
          if (res.queue.code === 1) {
            res.data.list.forEach(item => {
                item.id=item.video.id
                item.name=item.video.name
                item.url=item.video.url
                item.introduce=item.video.introduce
                item.healthThemeId=item.video.healthThemeId
                item.createdTime=item.video.createdTime
                item.state=item.video.state
                item.doctorName=item.video.doctorName
                item.department=item.video.department
                item.coverUrl=item.video.coverUrl
                item.num=item.num
            })
            this.list = res.data.list
            this.total = res.data.total
          }
        })
      }
    },
    created() {
      this.fetchData()
    },
  }
</script>

<style scoped>

</style>
