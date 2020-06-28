<template>
  <div>
    <el-card class="card-layout">
      <el-button type="primary" v-if="hasPerm(`rtic:add`)" size="small" class="el-icon-plus" style="float: right" round @click="addArticle()">
        添加文章
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
      <!--<el-row :gutter="45">
        <el-col :span="5">
          <el-input style="width: 90%;padding-bottom: 16px;padding-top: 16px;float: right" prefix-icon="el-icon-search"
                    size="small"
                    clearable
                    v-model="search"
                    placeholder="请输入搜索内容"/>
        </el-col>
        <el-col :span="16">
          <div class="card-div-layout" ref="target">
            <img v-for="item in start" v-if="start!==null" :src='item.avatar'
                 :style="{border:(item.id===id?color:defaultColor)}" @click="imgClick(item.id)" height="60" width="80"
                 class="el-image-layout"/>
          </div>
        </el-col>
        <el-col :span="3" style="padding-bottom: 16px;padding-top: 16px">
          <el-button type="primary" size="small" class="el-icon-plus" round
                     v-if="hasPerm(`com:add`)"
                     @click="addCommodity">
            添加商品
          </el-button>
        </el-col>
      </el-row>-->
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
          align="center"
          width="300px"
          label="操作">
          <template slot-scope="props">
            <el-button type="primary" size="small" v-if="hasPerm(`rtic:edit`)" round @click="editArticle(props.row.id)">编辑</el-button>
            <el-button type="danger" size="small" v-if="props.row.state===2 && hasPerm(`rtic:dele`)" round @click="deleArticle(props.row.id)">
              删除
            </el-button>
            <el-button type="danger" size="small" v-if="props.row.state===1 && hasPerm(`rtic:dele`)" disabled round
                       @click="deleArticle(props.row.id)">删除
            </el-button>
            <el-button type="primary" size="small" round @click="view(props.row.id)" v-if="hasPerm(`rtic:view`)">查看</el-button>
            <el-button type="primary" size="small" round @click="down(props.row.id,props.row.state)" v-if="hasPerm(`rtic:on`) &&props.row.state===1">
              下架
            </el-button><el-button type="primary" size="small" round @click="down(props.row.id,props.row.state)" v-if="hasPerm(`rtic:under`) && props.row.state!==1">
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
        class="dialog-layout"
      >
        <hr/>
        <div v-html="content"/>
        <div align="center">
          <el-button type="primary" style="margin:  auto;"  size="small" round @click="content=null,title=null,Visible=false">取消</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import {findArtcle, findHealthThemeAll, deleteArtcle, downArtcle, upArtcle, findArtcleById} from '@/api/health/index'

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
        id: 'default',
        content: null,
        Visible: false,
        title: null,
      }
    },
    methods: {
      fetchData(val) {
        let sort = 'desc'
        let name = 'created_time'
        findArtcle(this.id, this.currentPage, '', this.size, name, sort).then(res => {
          if (res.queue.code === 1) {
            this.list = res.data.list
            this.total = res.data.total
          }
        })
      },
      addArticle() {
        this.$router.push({path: '/health/addArticle'})
      },
      editArticle(id) {
        this.$router.push({path: '/health/editArticle', query: {id: id}})
      },
      deleArticle(id) {
        this.$confirm('是否删除此文章?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteArtcle(id).then(res => {
            if (res.queue.code === 1) {
              this.mess('删除成功', 'success')
              this.fetchData()
            }
          })
        }).catch(() => {
        })
      },
      view(id) {
        findArtcleById(id).then(res => {
          if (res.queue.code === 1) {
            this.content = res.data.content
            this.title = res.data.name
            this.Visible = true
          }
        })
      },
      down(id, state) {
        if (state === 1) {
          this.$confirm('是否下架此文章?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            downArtcle(id).then(res => {
              if (res.queue.code === 1) {
                this.mess('下架成功', 'success')
                this.fetchData()
              }
            })
          }).catch(() => {
          })
        } else {
          this.$confirm('是否上架此文章?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            upArtcle(id).then(res => {
              if (res.queue.code === 1) {
                this.mess('上架成功', 'success')
                this.fetchData()
              }
            })
          }).catch(() => {
          })
        }
      },
    },
    created() {
      this.fetchData()
      findHealthThemeAll().then(res => {
        if (res.queue.code === 1) {
          this.options = res.data.list
          this.options.push({id: 'default', name: '全部'})
        }
      })
    },
    watch: {
      search(search) {
        if (search !== '' || search !== undefined) {
          this.currentPage = 1
          let sort = 'desc'
          let name = 'created_time'
          findArtcle(this.id, this.currentPage, search, this.size, name, sort).then(res => {
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
          findArtcle(id, this.currentPage, '', this.size, name, sort).then(res => {
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
  .el-image-layout{
    border-radius: 50%;
  }
</style>
<style>

</style>
