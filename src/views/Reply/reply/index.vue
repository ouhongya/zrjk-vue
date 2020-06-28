<template>
  <div>
    <el-card class="card-layout">
      <el-input style="width: 250px" type="text" maxlength="10" show-word-limit prefix-icon="el-icon-search"
                size="small" clearable v-model="search"
                placeholder="请输入搜索内容"/>
    </el-card>
    <el-card class="card-layout">
      <el-table
        :data="list"
        style="width: 100%">
        <el-table-column
          label="日期"
          align="center">
          <template slot-scope="props">
            {{ props.row.createdTime | dateformat('YYYY-MM-DD HH:mm') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="questionsContent"
          label="问题"
          align="center">
        </el-table-column>
        <el-table-column
          prop="healthThemeName"
          align="center"
          label="主题名称">
        </el-table-column>
        <el-table-column
          prop="doctorName"
          align="center"
          label="医生名称">
        </el-table-column>
        <el-table-column
          prop="nickName"
          align="center"
          label="提问者">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="props">
            <el-button type="primary" size="small" v-if="hasPerm(`doct:dele`) " round @click="dialogue(props.row.id)">
              回复
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
      :title="title"
      :visible.sync="VisibleDialogue"
      :close-on-click-modal="false"
      :before-close="closeLoading"
      custom-class="customWidth"
      width="50%"
      :close-on-press-escape="false"
      show-clos="false"
      class="loading-padding"
      align="center"
      :style="{padding:'0px'}"
    >
      <div class="ChatBackground">


        <div>
          <div v-show="answer.urls.length!==0" style="font-size: 16px;font-weight: initial;;text-align: left;margin-left: 20px">
             病因:
          </div>
          <div v-if="answer.urls!==[]">
            <el-image
              v-for="item in answer.urls"
              style="width: 100px; height: 100px;overflow-y: hidden;white-space: nowrap;padding: 2px;"
              :src="item"
              :preview-src-list="[item]">
            </el-image>
          </div>
          <el-row :gutter="10">
            <el-col :span="24" class="Dialogue-layout">
              <div class="Dialogue-message-time-left">
                {{Dialogue.time|dateformat(`MM-DD HH:mm`)}}
              </div>
              <div class="Dialogue-message-left">
                {{title}}问:&nbsp;&nbsp; {{Dialogue.tok}}
              </div>
            </el-col>
            <div v-for="item in tok">
              <el-col :span="24" style="padding-bottom: 10px">
                <div>
                  <div class="Dialogue-message-time-right">
                    {{item.createdTime|dateformat(`MM-DD HH:mm`)}}
                  </div>
                  <div class="Dialogue-message-right">
                    {{item.answersContent}}&nbsp;&nbsp;<code style="font-weight: initial;float: right">:回复</code>
                  </div>
                </div>
              </el-col>

            </div>
          </el-row>
        </div>
      </div>
      <div>
        <code style="float: left;font-size: 16px; color: #888;;line-height: 1.7">留言回复:</code>
        <el-input type="textarea" :row="4" style="width: 75%" maxlength="100" show-word-limit
                  v-model="answer.answersContent" placeholder="请输入标签名"/>
        <el-button type="primary" size="mini" @click="onSubmitEdit">发送</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchData, answering, findAnswerByQid, findAnswerById} from "../../../api/reply/index";

  export default {
    name: "index",
    data() {
      return {
        list: null,
        search: null,
        currentPage: 1,
        total: 0,
        size: 10,
        VisibleDialogue: false,
        Dialogue: {
          title: '',
          time: '',
          tok: ''
        },
        answer: {
          urls: [],
          answersContent: '',
          questionsId: '',
          nickName: '',
          questionsContent: '',
          healthThemeName: '',
        },
        title: '',
        tok: null,
        ids: window.localStorage.getItem('doctors'),
        id: ''
      }
    },
    methods: {
      fetchData() {
        let sort = 'desc'
        let name = 'created_time'
        let dids = [1, 2, 3, 4]
        fetchData(dids, this.currentPage, '', this.size, name, sort).then(res => {
          if (res.queue.code === 1) {
            this.list = res.data.list
          }
        })
      },
      onSubmitEdit() {
        if (this.answer.answersContent !== ``) {
          answering(this.answer).then(res => {
            if (res.queue.code === 1) {
              this.answer.answersContent = ''
              this.mess('回复成功', 'success')
              this.list.forEach(item => {
                if (item.id === this.id) {
                  findAnswerByQid(this.id).then(res => {
                    if (res.queue.code === 1) {
                      this.tok = res.data
                      this.title = item.nickName
                      this.Dialogue.time = item.createdTime
                      this.Dialogue.tok = item.questionsContent
                    }
                  })
                }
              })
            }
          })
        }
      },
      deleInformation(id) {
        this.$confirm('是否删除此回答?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

        }).catch(() => {
        })
      },
      dialogue(id) {
        this.id = id
        this.list.forEach(item => {
          if (item.id === id) {
            this.answer.questionsId = item.id
            this.answer.urls = item.urls
            this.answer.nickName = item.nickName
            this.answer.questionsContent = item.questionsContent
            this.answer.healthThemeName = item.healthThemeName
            findAnswerByQid(id).then(res => {
              if (res.queue.code === 1) {
                this.tok = res.data
                this.title = item.nickName
                this.Dialogue.time = item.createdTime
                this.Dialogue.tok = item.questionsContent
                this.VisibleDialogue = true
              }
            })
          }
        })
      },
      closeLoading(){
        this.answer.urls=[];
        this.VisibleDialogue=false
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
          let dids = [1, 2, 3, 4]
          fetchData(dids, this.currentPage, search, this.size, name, sort,).then(res => {
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

  .Dialogue-layout {
    height: 60px;
    padding: 8px 10px 8px 10px;
  }

  .Dialogue-message-left {
    float: left;
    margin-top: 4px;
    font-size: 16px;
    font-weight: initial;
    margin-left: 20px;
  }

  .Dialogue-message-right {
    float: right;
    margin-top: 4px;
    font-size: 16px;
    font-weight: initial;
    margin-right: 20px;
    width: 50%;
    text-align: right;
  }

  .Dialogue-message-time-left {
    margin-right: 83.5%;
    width: 100px;
    margin-top: 2px;
    font-size: 8px;
    line-height: 1.0;
    color: #888;
  }

  .Dialogue-message-time-right {
    font-size: 8px;
    line-height: 1.0;
    margin-top: 2px;
    width: 100px;
    color: #888;
    margin-left: 83.5%;
  }

  .ChatBackground {
    height: 400px;
    overflow-x: hidden;
  }
</style>
