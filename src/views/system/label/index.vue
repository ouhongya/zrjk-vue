<template>
  <div>
    <el-card class="card-layout">
      <el-button type="primary" size="small" v-if="hasPerm(`lab:add`)" class="el-icon-plus" style="float: right" round
                 @click="Visible=true">添加标签
      </el-button>
      <el-input style="width: 300px" prefix-icon="el-icon-search" size="small" v-model="search" placeholder="请输入搜索内容"
                clearable/>
    </el-card>
    <el-card class="card-layout">
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
              close-transition
            >{{ props.row.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="props">
            <el-button type="primary" size="small" v-if="hasPerm(`lab:edit`)" class="el-icon-edit" round
                       @click="updateTag(props.row.id)">修改
            </el-button>
            <el-button class="el-icon-delete" v-if="hasPerm(`lab:dele`)" type="danger" round size="small"
                       @click="deleteTag(props.row.id)">
              删除
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
    </el-card>
    <el-dialog
      title="添加标签"
      :visible.sync="Visible"
      :close-on-click-modal="false"
      custom-class="customWidth"
      width="30%"
      :close-on-press-escape="false"
      show-clos="false"
      style="text-align: center;"
    >
      <el-form :model="tag" ref="tag" label-width="80px" style="width: 80%;margin:auto">
        <el-form-item label="名称:" prop="name" :rules="[{ required: true, message: '名称不能为空'}]">
          <el-input v-model="tag.name" placeholder="请输入标签名"/>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" round @click="tag.name='',Visible=false">取消</el-button>
      <el-button type="primary" size="small" round @click="onSubmit(`tag`)">确认</el-button>
    </el-dialog>
    <el-dialog
      title="修改标签"
      :visible.sync="VisibleEdit"
      :close-on-click-modal="false"
      custom-class="customWidth"
      width="30%"
      :close-on-press-escape="false"
      show-clos="false"
      style="text-align: center;"
    >
      <el-form :model="tagEdit" ref="tagEdit" label-width="80px" style="width: 80%;margin:auto">
        <el-form-item label="名称:" prop="name" :rules="[{ required: true, message: '名称不能为空'}]">
          <el-input v-model="tagEdit.name" placeholder="请输入标签名"/>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" round @click="tagEdit.name='',VisibleEdit=false">取消</el-button>
      <el-button type="primary" size="small" round @click="onSubmitEdit(`tagEdit`)">确认</el-button>
    </el-dialog>
  </div>
</template>
<script>
  import {fetchDataPage, addTag, editTag, deleTag} from '@/api/gather/lable'
  export default {
    name: 'index',
    data() {
      return {
        list: [],
        currentPage: 1,
        size: 5,
        total: 0,
        search: '',
        Visible: false,
        VisibleEdit: false,
        tag: {
          name: ''
        },
        tagEdit: {
          id: '',
          name: ''
        }
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
        if (val !== undefined && val.prop === `name`) {
          if (val.order === undefined) {
            name = 'name'
            sort = 'desc'
          }
          if (val.order === `descending`) {
            name = 'created_time'
            sort = 'desc'
          }
          if (val.order === `ascending`) {
            name = 'name'
            sort = 'asc'
          }
        }
        fetchDataPage(this.currentPage, '', this.size, name, sort).then(res => {
          if (res.queue.code === 1) {
            this.list = res.data.list
            this.total = res.data.total
          }
        })
      },
      deleteTag(id) {
        this.$confirm('是否删除此标签', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleTag(id).then(res => {
            if (res.queue.code === 1) {
              this.mess(`删除成功`, 'success')
              this.fetchData()
            }
          })
        }).catch(() => {
        })
      },
      updateTag(id) {
        this.list.forEach(item => {
          if (item.id === id) {
            this.tagEdit.id = item.id
            this.tagEdit.name = item.name
          }
        })
        this.VisibleEdit = true
      },
      onSubmit(tag) {
        this.$refs[tag].validate((valid) => {
          if (valid) {
            let formData = new FormData;
            formData.append(`name`, this.tag.name)
            addTag(formData).then(res => {
              if (res.queue.code === 1) {
                this.mess('添加成功', 'success')
                this.tag.name = ''
                this.Visible = false
                this.fetchData()
              }
            })
          } else {
            return false;
          }
        })

      },
      onSubmitEdit(tagEdit) {
        this.$refs[tagEdit].validate((valid) => {
          if (valid) {
            var formdata = new FormData();
            formdata.append('tid', this.tagEdit.id)
            formdata.append('tname', this.tagEdit.name)
            editTag(formdata).then(res => {
              this.fetchData()
              this.mess('修改成功', 'success')
              this.VisibleEdit = false;
              this.tagEdit.id = ''
              this.tagEdit.name = ''
            })
          }
        })
      },
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
          fetchDataPage(this.currentPage, search, this.size, name, sort).then(res => {
            if (res.queue.code === 1) {
              this.list = res.data.list
              this.total = res.data.total
            }
          })
        }
      }
    },
  }
</script>
<style scoped>
  .card-layout {
    margin: 8px;
  }

  .el-card__body {
    padding: 8px;
  }

  .el-dialog__title {
    line-height: 24px;
    font-size: 25px;
    color: #bfcbd9;
    font-family: Avenir;
    font-weight: bold;
  }
</style>
