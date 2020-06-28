<template>
  <div>
    <el-card class="card-layout">
      <el-button type="primary"  v-if="hasPerm(`vide:add`)" size="small" class="el-icon-plus" style="float: right" round @click="addArticle()">
        添加视频
      </el-button>
      <el-select v-model="id"
                 size="small"
                 placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-input style="width: 250px" type="text" maxlength="10" show-word-limit prefix-icon="el-icon-search" size="small" clearable v-model="search"
                placeholder="请输入搜索内容"/>
    </el-card>
    <el-card class="card-layout">
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
          align="center"
          width="300px"
          label="操作">
          <template slot-scope="props">
            <el-button type="primary" size="small" round @click="editArticle(props.row.id)" v-if="hasPerm(`vide:edit`)">编辑</el-button>
            <el-button type="danger" size="small" v-if="props.row.state===2 && hasPerm(`vide:dele`)" round @click="deleArticle(props.row.id)">
              删除
            </el-button>
            <el-button type="danger" size="small" v-if="props.row.state===1 && hasPerm(`vide:dele`)" disabled round
                       @click="deleArticle(props.row.id)">删除
            </el-button>
            <el-button type="primary" size="small" round @click="view(props.row.id)" v-if="hasPerm(`vide:view`)">查看</el-button>
            <el-button type="primary" size="small" round @click="down(props.row.id,props.row.state)" v-if="hasPerm(`video:on`) && props.row.state===1">
              下架
            </el-button><el-button type="primary" size="small" round @click="down(props.row.id,props.row.state)" v-if="hasPerm(`video:under`) &&props.row.state!==1">
              上架
            </el-button>
          </template>
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
      <el-dialog
        :title="title"
        :visible.sync="Visible"
        :close-on-click-modal="false"
        custom-class="customWidth"
        width="370px"
        :close-on-press-escape="false"
        show-clos="false"
        style="text-align: center;"
        class="dialog-layout"
      >
        <hr/>
        <div v-html="content"/>
        <el-button type="primary" size="small" round @click="content=null,title=null,Visible=false">取消</el-button>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
  import Tinymce from '@/components/Tinymce'
  import {findVideo, deleteVideo, downVideo, upVideo,findHealthThemeAll,findVideoById} from '@/api/health/index'
  export default {
    name: "index",
    components: {Tinymce},
    data() {
      return {
        list: null,
        search: null,
        currentPage: 1,
        total: 0,
        size: 10,
        options: null,
        id: `default`,
        content:null,
        Visible:false,
        title:null
      }
    },
    methods: {
      fetchData() {
        let sort = 'desc'
        let name = 'created_time'
        findVideo(this.id, this.currentPage, '', this.size, name, sort).then(res => {
          if (res.queue.code === 1) {
            this.list = res.data.list
            this.total = res.data.total
          }
        })
      },
      addArticle() {
        this.$router.push({path: '/health/addVideo'})
      },
      editArticle(id) {
        this.$router.push({path: '/health/editVideo',query:{id:id}})
      },
      deleArticle(id) {
        this.$confirm('是否删除此视频?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteVideo(id).then(res => {
            if (res.queue.code === 1) {
              this.mess('删除成功', 'success')
              this.fetchData()
            }
          })
        }).catch(() => {
        })
      },
      view(id) {
        findVideoById(id).then(res=>{
          if(res.queue.code===1){
            this.content=res.data.introduce
            this.title=res.data.name
            this.Visible=true
          }
        })
      },
      down(id, state) {
        if (state === 1) {
          this.$confirm('是否下架此视频?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            downVideo(id).then(res => {
              if (res.queue.code === 1) {
                this.mess('下架成功', 'success')
                this.fetchData()
              }
            })
          }).catch(() => {
          })
        } else {
          this.$confirm('是否上架此视频?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            upVideo(id).then(res => {
              if (res.queue.code === 1) {
                this.mess('上架成功', 'success')
                this.fetchData()
              }
            })
          }).catch(() => {
          })
        }
      }
    },
    created() {
      this.fetchData()
      findHealthThemeAll().then(res => {
        if (res.queue.code === 1) {
          this.options = res.data.list
          this.options.push({id:'default',name:'全部'})
        }
      })
    },
    watch: {
      search(search) {
        if (search !== '' || search !== undefined) {
          this.currentPage = 1
          let sort = 'desc'
          let name = 'created_time'
          findVideo(this.id, this.currentPage, search, this.size, name, sort).then(res => {
            if (res.queue.code === 1) {
              this.list = res.data.list
              this.total = res.data.total
            }
          })
        }
      },
      id(id) {
        if (id !== '' || id !== undefined) {
          this.currentPage = 1
          let sort = 'desc'
          let name = 'name'
          findVideo(id, this.currentPage, '', this.size, name, sort).then(res => {
            if (res.queue.code === 1) {
              this.list = res.data.list
              this.total = res.data.total
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
  .card-layout {
    margin: 8px;
  }
</style>
<style>

</style>
