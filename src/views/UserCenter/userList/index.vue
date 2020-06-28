<template>
  <div>
    <el-card class="card-layout">
      <el-popover
        placement="right"
        v-if="hasPerm(`user:dele`)"
        trigger="click">
        <el-table :data="columnList">
          <el-table-column width="150" prop="name" label="列名"/>
          <el-table-column width="150" label="操作">
            <template slot-scope="props">
              <el-button size="small" @click="deleteColumnList(props.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button slot="reference" style="float: right" size="small" round type="primary">删除列</el-button>
      </el-popover>

      <el-button type="primary" size="small" class="el-icon-plus" style="float: right" round
                 v-if="hasPerm(`user:add`)"
                 @click="columnVisible=true">
        添加列
      </el-button>

      <el-input style="width: 250px" type="text" maxlength="10" show-word-limit prefix-icon="el-icon-search"
                size="small" clearable v-model="search"
                placeholder="请输入搜索内容"/>
    </el-card>
    <el-card class="card-layout">
      <el-table
        :data="list"
        style="width: 100%">
        <el-table-column
          prop=""
          label="日期"
          align="center">
          <template slot-scope="props">
            {{ props.row.createdTime | dateformat(`YYYY-MM-DD HH:mm`) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="nickName"
          label="昵称"
          align="center">
          <template slot-scope="props">
            {{props.row.nickName===''?'暂无':props.row.nickName}}
          </template>
        </el-table-column>
        <el-table-column
          prop="nickName"
          label="姓名"
          align="center">
          <template slot-scope="props">
            {{props.row.trueName===''?'暂无':props.row.trueName}}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="住址"
          align="center">
          <template slot-scope="props">
          {{props.row.address===''?'暂无':props.row.address}}
          </template>
        </el-table-column>
        <el-table-column
          label="头像"
          align="center">
          <template slot-scope="props">
            <img :src="props.row.coverUrl" v-if="props.row.coverUrl!==``" width="80px" height="80px"
                 style="border-radius: 50%"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="phoneNum"
          align="center"
          label="电话">
        </el-table-column>
        <el-table-column
          align="center"
          v-for="(key,index) in columnListName"
          :key="key.prop"
          :prop="key.prop"
          :label="key.val">
          <template slot-scope="props">
            <div v-if="hasPerm(`user:edit`)">
              <el-button type="text" size="small" round @click="columnEdit(props.row.columns[index].id)">

                {{props.row.columns[index].content
                === null ?'暂无':props.row.columns[index].content}}
              </el-button>
            </div>
            <div v-else>
              {{props.row.columns[index].content === null ?'暂无':props.row.columns[index].content}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="200"
          label="操作">
          <template slot-scope="props">
            <p>
              <el-button type="primary" size="small" round @click="doctors(props.row.id)">关注医生</el-button>
              <el-button type="primary" size="small" round @click="label(props.row.id)">关注主题</el-button>
            </p>
            <p>
              <el-button type="primary" size="small" round @click="article(props.row.id)">收藏文章</el-button>
              <el-button type="primary" size="small" round @click="video(props.row.id)">收藏视频</el-button>
            </p>
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
    </el-card>
    <el-dialog
      title="关注的医生列表"
      :visible.sync="doctorsVisible"
      width="70%"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      align="center">
      <el-table
        :data="doctorsList"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="出诊医院">
                <span>{{ props.row.hospitalName }}</span>
              </el-form-item>
              <el-form-item label="擅长主治">
                <span>{{ props.row.adeptDisease }}</span>
              </el-form-item>
              <el-form-item label="医院地址">
                <span>{{ props.row.address}}</span>
              </el-form-item>
              <el-form-item label="个人简介">
                <span>{{ props.row.introduce }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
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
          label="姓名"
          align="center">
        </el-table-column>
        <el-table-column
          prop="url"
          align="center"
          label="医生头像">
          <template slot-scope="props">
            <el-image
              style="width: 80px; height: 80px;border-radius: 50%"
              :src="props.row.url"
              :preview-src-list="[props.row.url]">
            </el-image>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="doctorsCurrentPage"
        :page-size="doctorsSize"
        layout="total, prev, pager, next"
        :total="doctorsTotal"
        style="text-align: center"
        @size-change="doctorsData"
        @current-change="doctorsData"
      />
    </el-dialog>
    <el-dialog
      title="关注的文章列表"
      :visible.sync="articleVisible"
      width="70%"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      align="center">
      <el-table
        :data="articleList"
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
      </el-table>
      <el-pagination
        :current-page.sync="articleCurrentPage"
        :page-size="articleSize"
        layout="total, prev, pager, next"
        :total="articleTotal"
        style="text-align: center"
        @size-change="articleData"
        @current-change="articleData"
      />
    </el-dialog>
    <el-dialog
      title="关注的视频列表"
      :visible.sync="videoVisible"
      width="70%"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      align="center">
      <el-table
        :data="videoList"
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
      </el-table>
      <el-pagination
        :current-page.sync="videoCurrentPage"
        :page-size="videoSize"
        layout="total, prev, pager, next"
        :total="videoTotal"
        style="text-align: center"
        @size-change="videoData"
        @current-change="videoData"
      />
    </el-dialog>
    <el-dialog
      title="关注的主题列表"
      :visible.sync="labelVisible"
      width="70%"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      align="center">
      <el-table
        :data="labelList"
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
      </el-table>
      <el-pagination
        :current-page.sync="labelCurrentPage"
        :page-size="labelSize"
        layout="total, prev, pager, next"
        :total="labelTotal"
        style="text-align: center"
        @size-change="labelData"
        @current-change="labelData"
      />
    </el-dialog>
    <el-dialog
      title="添加列"
      :visible.sync="columnVisible"
      width="30%"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      align="center">
      <el-form :model="column" ref="column" label-width="80px" style="width: auto;margin:auto">
        <el-form-item label="列名:" prop="name" :rules="[{ required: true, message: '列名不能为空'}]">
          <el-input size="small" v-model="column.name" style="width: 250px" type="text" maxlength="10" show-word-limit
                    placeholder="请输入标签名"/>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" round @click="QX">取消</el-button>
      <el-button type="primary" size="small" round @click="onSubmit(`column`)">确认</el-button>
    </el-dialog>
    <el-dialog
      title="修改列"
      :visible.sync="columnVisibleEdit"
      width="30%"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      align="center">
      <el-form :model="columns" ref="columns" label-width="80px" style="width: 80%;margin:auto">
        <el-form-item :label="columns.name" prop="name">
          <el-input v-model="columns.content" size="small" style="width: 250px" type="text" maxlength="10"
                    show-word-limit placeholder="请输入类容"/>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" round @click="qx">取消</el-button>
      <el-button type="primary" size="small" round @click="onSubmitEdit(`column`)">确认</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import {
    findWXUser,
    findFollowVideo,
    findFollowHealthTheme,
    findFollowDoctor,
    findFollowArticle,
    addColumn,
    deleteColumn,
    findColumn,
    addColumnContent
  } from '@/api/userCenter/index'

  export default {
    name: "index",
    data() {
      return {
        list: null,
        search: null,
        currentPage: 1,
        total: 0,
        size: 10,
        doctorsCurrentPage: 1,
        doctorsTotal: 0,
        doctorsSize: 10,
        articleCurrentPage: 1,
        articleTotal: 0,
        articleSize: 10,
        videoCurrentPage: 1,
        videoTotal: 0,
        videoSize: 10,
        labelCurrentPage: 1,
        labelTotal: 0,
        labelSize: 10,
        doctorsVisible: false,
        articleVisible: false,
        videoVisible: false,
        labelVisible: false,
        doctorsId: null,
        articleId: null,
        videoId: null,
        labelId: null,
        doctorsList: null,
        articleList: null,
        videoList: null,
        labelList: null,
        columnVisible: false,
        columnVisibleEdit: false,
        column: {
          name: null
        },
        columnList: null,
        columnListName: [],
        columns: {
          cid: null,
          content: null,
          uid: null,
          name: null
        },
      }
    },
    methods: {
      fetchData() {
        this.columnListName = []
        let sort = 'desc'
        let name = 'created_time'
        findWXUser(this.currentPage, '', this.size, name, sort).then(res => {
          if (res.queue.code === 1) {
            this.list = res.data.list
            this.list.forEach(item => {
              item.columns.forEach(key => {
                item[key.id] = key.content
                item.parentId=item.id
              })
            })
            this.fetchDataColumn()
            this.total = res.data.total
          }
        })
      },
      doctors(id) {
        this.doctorsId = id
        this.doctorsData()
        this.doctorsVisible = true
      },
      article(id) {
        this.articleId = id
        this.articleData()
        this.articleVisible = true
      },
      video(id) {
        this.videoId = id
        this.videoData()
        this.videoVisible = true
      },
      label(id) {
        this.labelId = id
        this.labelData()
        this.labelVisible = true
      },
      doctorsData() {
        let sort = 'desc'
        let name = 'created_time'
        findFollowDoctor(this.doctorsId, this.doctorsCurrentPage, '', this.doctorsSize, name, sort).then(res => {
          if (res.queue.code === 1) {
            this.doctorsList = res.data.list
            this.doctorsTotal = res.data.size
          }
        })
      },
      articleData() {
        let sort = 'desc'
        let name = 'created_time'
        findFollowArticle(this.articleId, this.articleCurrentPage, '', this.articleSize, name, sort).then(res => {
          if (res.queue.code === 1) {
            this.articleList = res.data.list
            this.articleTotal = res.data.size
          }
        })
      },
      videoData() {
        let sort = 'desc'
        let name = 'created_time'
        findFollowVideo(this.videoId, this.videoCurrentPage, '', this.videoSize, name, sort).then(res => {
          if (res.queue.code === 1) {
            this.videoList = res.data.list
            this.videoTotal = res.data.size
          }
        })
      },
      labelData() {
        let sort = 'desc'
        let name = 'created_time'
        findFollowHealthTheme(this.labelId, this.labelCurrentPage, '', this.labelSize, name, sort).then(res => {
          if (res.queue.code === 1) {
            this.labelList = res.data.list
            this.labelTotal = res.data.size
          }
        })
      },
      onSubmit(column) {
        this.$refs[column].validate((valid) => {
          if (valid) {
            addColumn(this.column.name).then(res => {
              if (res.queue.code === 1) {
                this.mess('添加成功', 'success')
                this.columnListName = []
                this.fetchData()
                this.QX()
              }
            })
          } else {
            return false;
          }
        })
      },
      fetchDataColumn() {
        findColumn().then(res => {
          if (res.queue.code === 1) {
            this.columnList = []
            this.columnList = res.data
            this.columnList.forEach(item => {
              this.columnListName.push({prop: item.id, val: item.name})
            })
            /*let arr = []
            this.columnList = res.data
            this.list.forEach(item=>{
              arr.push({prop: key.id, val: key.name,parentId:item.id,columns:[]})
              item.columns.forEach(key=>{

              })
            })
            this.columnListName=arr*/
          }
        })
      },
      deleteColumnList(id) {
        this.$confirm('是否删除此列', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteColumn(id).then(res => {
            if (res.queue.code === 1) {
              this.mess('删除成功', 'success')
              this.fetchData()
            }
          })
        }).catch(() => {
        })
      },
      QX() {
        this.columnVisible = false
        this.column.name = null
      },
      qx() {
        this.columnVisibleEdit = false
        this.columns.cid = null
        this.columns.content = null
        this.columns.uid = null
        this.columns.name = null
      },
      onSubmitEdit() {
        addColumnContent(this.columns.cid, this.columns.content, this.columns.uid).then(res => {
          if (res.queue.code === 1) {
            this.mess('编辑成功', 'success')
            this.fetchData()
            this.qx()
          }
        })
      },
      columnEdit(id) {
        this.list.forEach(item => {
          item.columns.forEach(key => {
            if (key.id === id) {
              this.columnVisibleEdit = true
              this.columns = {cid: key.id, content: key.content, uid: item.id, name: key.name}
            }
          })
        })
      }
    },
    created() {
      this.fetchData()
    },
    watch: {
      search(search) {
        if (search !== '' || search !== undefined) {
          this.currentPage = 1
          let sort = 'desc'
          let name = 'created_time'
          findWXUser(this.currentPage, search, this.size, name, sort).then(res => {
            if (res.queue.code === 1) {
              this.list = res.data.list;
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

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
