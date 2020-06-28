  <template>
    <div>
      <el-card class="card-layout">
        <el-button type="primary" size="small" v-if="hasPerm(`file:down`)" class="el-icon-plus" style="float: right" round
                   @click="downsImage">
          上传文件
        </el-button>
        <el-button type="primary" @click="log" v-if=" hasPerm(`file:log`)" size="small" round class="el-icon-date"
                   style="float: right">&nbsp;&nbsp;日志查询
        </el-button>
        <el-input style="width: 300px" type="text" maxlength="10" show-word-limit prefix-icon="el-icon-search"
                  size="small" clearable v-model="search"
                  placeholder="请输入搜索内容"/>
      </el-card>
      <el-card class="card-layout">
        <div v-show="flag===true">
          <el-table
            :data="fileList"
            style="width: 100%">
            <el-table-column
              :render-header="renderHeader1"
              width="100px">
              <template slot-scope="props">
                <svg-icon icon-class="wja" v-if='props.row.type==="1"'/>
                <svg-icon icon-class="wj" v-if='props.row.type==="2"'/>
              </template>
            </el-table-column>
            <el-table-column
              prop="folderName"
              label="文件名称"
              align="center">
              <template slot-scope="props">
                <el-button type="text" v-if="props.row.type==='1'" @click="files(props.row.id,props.row.folderName)">
                  {{props.row.folderName}}
                </el-button>
                <el-button type="text" v-if="props.row.type==='2'" @click="image(props.row.id,props.row.folderName)">
                  {{props.row.folderName}}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="createdTime"
              align="center"
              label="上传日期">
              <template slot-scope="props">
                {{ props.row.createdTime | dateformat('YYYY-MM-DD HH:mm') }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作">
              <template slot-scope="props">
                <el-button type="primary" size="small" round v-if="props.row.type==='1'"
                           @click="files(props.row.id,props.row.folderName)">详情
                </el-button>
                <el-button type="primary" size="small" round v-if="props.row.type==='2'"
                           @click="image(props.row.id,props.row.name)">详情
                </el-button>
                <el-button type="primary" size="small" round v-if="props.row.type==='2'"
                           @click="downs(props.row.downUrl)">下载
                </el-button>
                <el-button type="primary" size="small" round v-if="props.row.type==='1'" disabled
                           @click="downs(props.row.downUrl)">下载
                </el-button>
                <el-button type="danger" size="small" v-if="props.row.type===`1`&& hasPerm(`file:dele`)" round
                           @click="deleInformation(props.row.id)">删除
                </el-button>
                <el-button type="danger" size="small" v-if="props.row.type===`2` && hasPerm(`file:delet`)" round
                           @click="deleFile(props.row.id)">
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
        </div>
        <div v-show="flag===false">
          <el-table
            ref="multipleTable"
            tooltip-effect="dark"
            :data="list"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="30">
            </el-table-column>
            <el-table-column
              :render-header="renderHeader"
              align="center"
              width="100px">
              <svg-icon icon-class="wj"/>
            </el-table-column>
            <el-table-column
              prop="folderName"
              label="名称"
              align="center">
              <template slot-scope="props">
                <el-button type="text" @click="image(props.row.id)">{{props.row.fileName}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="date"
              align="center"
              label="上传日期">
              <template slot-scope="props">
                {{ props.row.createdTime | dateformat('YYYY-MM-DD HH:mm') }}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作">
              <template slot-scope="props">
                <el-button type="primary" size="small" round @click="image(props.row.id)">详情</el-button>
                <el-button type="primary" size="small" round @click="downs(props.row.downUrl)">下载</el-button>
                <el-button type="danger" size="small" v-if="hasPerm(`file:delet`)" round
                           @click="deleFile01(props.row.id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="hasPerm(`file:delet`)">
            <el-select v-if="multipleSelection.length===0" disabled v-model="value"
                       style="float: left;padding-top: 4px"
                       size="mini" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="value" v-if="multipleSelection.length!==0"
                       style="float: left;padding-top: 4px"
                       size="mini"
                       placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <dev v-else>
            <el-select v-model="value" v-if="multipleSelection.length===0" disabled
                       style="float: left;padding-top: 4px"
                       size="mini" placeholder="请选择">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="value" v-if="multipleSelection.length!==0"
                       style="float: left;padding-top: 4px"
                       size="mini"
                       placeholder="请选择">
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </dev>
          <el-pagination
            :current-page.sync="currentPageObj"
            :page-size="sizeObj"
            layout="total, prev, pager, next"
            :total="totalObj"
            style="text-align: center"
            @size-change="fetchDataObj"
            @current-change="fetchDataObj"
          />
        </div>
        <el-drawer
          title="详情"
          :visible.sync="drawer"
          class="drawer"
          size="40%"
          direction="rtl">
          <hr/>
          <div style="padding-left: 10px;padding-right: 10px;height: 80%;overflow-x: hidden">
            <div class="file">
              当前格式不支持预览。
            </div>
            <el-form ref="form" label-position="left" :model="img" label-width="80px">
              <el-form-item label="文件名：">
                <div class="divBorder">{{img.name}}</div>
              </el-form-item>
              <el-form-item label="类型：">
                <div class="divBorder">{{img.type}}</div>
              </el-form-item>
              <el-form-item label="大小：">
                <div class="divBorder">{{img.size}}</div>
              </el-form-item>
              <el-form-item label="URL：" style="margin: 0px">
                <div
                  style="padding: 8px;line-height: 1.4; border: 1px solid #dedede; white-space: normal;word-break: break-all;word-wrap: break-word;">
                  {{img.url}}
                </div>
              </el-form-item>
              <el-form-item style="">
                <el-button type="text" @click="downs(img.url,img.name)">下载文件</el-button>
                <el-button type="text">
                   <span class="copy-btn" v-clipboard:copy="img.url" v-clipboard:success="onCopy">复制文件URL</span>
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-drawer>
        <el-drawer
          title="上传文件"
          :visible.sync="visible"
          class="drawer"
          size="45%"
          direction="rtl">
          <hr/>
          <div style="padding-left: 10px;padding-right: 10px;height: 80%;overflow-x: hidden">
            <el-form ref="form" label-position="left" :model="upImage" label-width="80px">
              <el-form-item label="上传位置:" style="margin-bottom: 10px">
                <!--<el-radio v-model="up" label="1" border size="small">默认文件夹</el-radio>
                <el-radio v-model="up" label="2" border size="small">指定文件夹</el-radio>
                <div v-show="up==='1'">
                  <div style="height: 20px;color: #888;font-size: 14px;line-height: 1.5;">oss://test/fileList/</div>
                </div>
                <div v-show="up==='2'">
                  <el-input v-model="fileName" size="small" placeholder="请输入文件夹名称"/>
                  <div class="next-form-item-extra">
                    <div class="oss-intl-lines">
                      <p style="padding: 4px;margin: 4px">目录命名规范:</p>
                      <ol>
                        <li>不允许使用表情符，请使用符合要求的 UTF-8 字符；</li>
                        <li><code class="code">/</code>用于分割路径，可快速创建子目录，但不要以<code class="code">/</code> 或 <code
                          class="code">\</code> 开头，不要出现连续的 <code class="code">/</code>；
                        </li>
                        <li>不允许出现名为 <code class="code">..</code> 的子目录；</li>
                        <li>总长度控制在 1-254 个字符。</li>
                      </ol>
                    </div>
                  </div>
                </div>-->
                <div style="height: 100%;color: #888;font-size: 14px;line-height: 1.5;padding-top: 10px">{{location}}
                </div>
              </el-form-item>
              <el-form-item label="上传文件:">
                <div v-if="flag===true">
                  <el-upload
                    class="upload-demo"
                    drag
                    :data="fileData"
                    name="salaryBill"
                    multiple
                    :on-success="fileSuccess"
                    :on-remove="handleRemove"
                    action="/server/file/fileUpload/">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <!--<div class="el-upload__tip" slot="tip">只能上传jpg/png文件</div>-->
                  </el-upload>
                </div>
                <div v-if="flag===false">
                  <el-upload
                    class="upload-demo"
                    drag
                    :data="fileDataid"
                    name="salaryBill"
                    multiple
                    :on-success="fileSuccessId"
                    :before-remove="handleRemove"
                    action="/server/file/fileUpload/">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <!--<div class="el-upload__tip" slot="tip">只能上传jpg/png文件</div>-->
                  </el-upload>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </el-drawer>
        <el-drawer
          title="日志信息"
          :visible.sync="visibleLog"
          class="drawer"
          size="45%"
          direction="rtl">
          <hr/>
          <div style="padding-left: 10px;padding-right: 10px;overflow-x: hidden;height: 700px">
            <el-timeline v-for="item in logs">
              <el-timeline-item :timestamp="item.createdTime" placement="top">
                <el-card>
                  <h4>{{item.sentence}}</h4>
                  <p>{{item.username}} 提交于 {{item.createdTime|dateformat(`YYYY-MM-DD HH:mm`)}}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
            <el-pagination
              :current-page.sync="currentPageLog"
              :page-size="sizeLog"
              layout="total, prev, pager, next"
              :total="totalLog"
              style="text-align: center"
              @size-change="fetchDataLog"
              @current-change="fetchDataLog"
            />
          </div>
        </el-drawer>
        <el-dialog
          title="新建目录"
          :visible.sync="Visible"
          :close-on-click-modal="false"
          custom-class="customWidth"
          width="30%"
          :close-on-press-escape="false"
          show-clos="false"
          style="text-align: center;"
        >
          <el-form :model="tag" ref="tag" label-width="80px" style="width: 80%;margin:auto">
            <el-form-item label="名称:" prop="name" :rules="[{ required: true, message: '目录名称不能为空'}]">
              <el-input v-model="tag.name" placeholder="请输入目录名称"/>
            </el-form-item>
          </el-form>
          <el-button type="primary" size="small" round @click="QX">取消</el-button>
          <el-button type="primary" size="small" round @click="onSubmit(`tag`)">确认</el-button>
        </el-dialog>
      </el-card>
    </div>
  </template>

  <script>
    import {
      addFolder,
      deleteFile,
      findFile,
      findJournal,
      findFolder,
      downloadFile,
      findFileData
    } from '@/api/FilePicture/file'

    export default {
      name: "index",
      data() {
        return {
          list: null,
          fileList: null,
          search: null,
          currentPage: 1,
          total: 0,
          size: 10,
          currentPageObj: 1,
          totalObj: 0,
          sizeObj: 10,
          currentPageLog: 1,
          totalLog: 0,
          sizeLog: 10,
          drawer: false,
          item: [
            '该文件不支持在线预览'
          ],
          img: {
            name: '8fd5056b-95dc-4cee-8281-6fe8af68b24f_img.jpg',
            type: 'image/jpeg',
            url: 'https://chengchengcode.oss-cn-shanghai.aliyuncs.com/brand/8fd5056b-95dc-4cee-8281-6fe8af68b24f_img.jpg',
            size: '暂时没有'
          },
          multipleSelection: [],
          visible: false,
          upImage: {},
          name: '1',
          up: '1',
          fileName: 'fileList/',
          fileUrl: "这是测试名称",
          options: [
            {
              value: '0',
              label: '批量操作'
            }, {
              value: '1',
              label: '下载'
            }, {
              value: '2',
              label: '删除'
            }],
          options1: [
            {
              value: '0',
              label: '批量操作'
            }, {
              value: '1',
              label: '下载'
            }],
          value: "0",
          visibleLog: false,
          flag: true,
          locationUrl: null,
          tag: {
            name: ''
          },
          Visible: false,
          location: null,
          fileData: {
            folderId: '1',
          },
          fileDataid: {
            folderId: '',
          },
          logs: null,
        }
      },
      methods: {
        handleRemove(file, fileList) {
          if (this.flag === true) {
            this.fileList.forEach(item => {
              if (item.folderName === file.name) {
                let obj = {
                  ids: [item.id],
                  state: `2`
                }
                deleteFile(obj).then(res => {
                  if (res.queue.code === 1) {
                    this.fetchData()
                  }
                })
              }
            })
          } else {
            this.list.forEach(item => {
              if (item.fileName === file.name) {
                let obj = {
                  ids: [item.id],
                  state: `2`
                }
                deleteFile(obj).then(res => {
                  if (res.queue.code === 1) {
                    this.fetchDataObj()
                  }
                })
              }
            })
          }
        },
        fileSuccess(res, file) {
          if (res.queue.code === 1) {
            this.mess('上传成功', 'success')
            this.fetchData()
          } else {
            this.mess(res.queue.message, 'success')
          }
        },
        fileSuccessId(res, file) {
          if (res.queue.code === 1) {
            this.mess('上传成功', 'success')
            this.fetchDataObj()
          } else {
            this.mess(res.queue.message, 'success')
          }
        },
        QX() {
          this.tag.name = ''
          this.Visible = false
        },
        files(id, fname) {
          this.fileDataid.folderId = id
          this.currentPageObj = 1
          this.locationUrl = fname
          this.fetchDataObj()
          this.flag = false
        },
        renderHeader(h) {
          let _this = this
          let a = [h('el-button', {
            props: {
              size: 'small',
              type: 'text',
              icon: 'el-icon-back',
              margin: 'margin: 10px 0px 10px',
            },
            on: {
              click: () => {
                _this.flag = true
              }
            }
          }), _this.locationUrl]
          return h(`div`, a)
        },
        renderHeader1(h, {column}) {
          let _this = this
          let a = [h('el-button', {
            props: {
              size: 'small',
              type: 'text',
              icon: 'el-icon-folder-add',
              margin: 'margin: 10px 0px 10px;',
            },
            on: {
              click: () => {
                this.Visible = true
              }
            }
          }), `新建目录`]
          return h(`div`, a)
        },
        onSubmit() {
          if(this.tag.name===''){
            this.mess('请输入文件名','warning')
          }else{
            addFolder(this.tag.name, 1).then(res => {
              if (res.queue.code === 1) {
                this.mess('新建成功', 'success')
                this.Visible = false
                this.fetchData()
                this.tag.name = null
              } else {
                this.mess(res.queue.message, 'warning')
              }
            })
          }
        },
        fetchData() {
          let sort = 'desc'
          let name = 'created_time'
          if (this.currentPage === 1) {
            findFolder("", '1').then(res => {
              if (res.queue.code === 1) {
                res.data.forEach(item => {
                  item.type = '1'
                })
                this.fileList = res.data
              }
            })
            findFileData(this.currentPage, '', 5, name, sort, '1').then(res => {
              if (res.queue.code === 1) {
                res.data.list.forEach(item => {
                  item.type = '2'
                  item.folderName = item.fileName
                })
                res.data.list.forEach(item => {
                  this.fileList.push(item)
                })
                this.total = res.data.total
              }
            })
          } else {
            findFileData(this.currentPage, '', 5, name, sort, '1').then(res => {
              if (res.queue.code === 1) {
                res.data.list.forEach(item => {
                  item.type = '2'
                  item.folderName = item.fileName
                })
                this.fileList = res.data.list
                this.total = res.data.total
              }
            })
          }
        },
        fetchDataLog() {
          let sort = 'desc'
          let name = 'created_time'
          findJournal(this.currentPageLog, this.sizeLog, name, sort, '1').then(res => {
            if (res.queue.code === 1) {
              this.logs = res.data.list
              this.logs.forEach(item => {
                if (item.types === 1) {
                  let name = item.fname.substring(0, item.fname.indexOf('/'))
                  if (name === 'video') {
                    item.sentence = item.username + ":在视频管理" + '上传了' + item.fname.substring(item.fname.indexOf('/') + 1, item.fname.length)
                  }
                  if (name === 'file') {
                    item.sentence = item.username + ":在文件管理" + '上传了' + item.fname.substring(item.fname.indexOf('/') + 1, item.fname.length)
                  }
                  if (name === 'image') {
                    item.sentence = item.username + ":在图片管理" + '上传了' + item.fname.substring(item.fname.indexOf('/') + 1, item.fname.length)
                  }
                }
                if (item.types === 2) {
                  let name = item.fname.substring(0, item.fname.indexOf('/'))
                  if (name === 'video') {
                    item.sentence = item.username + ":在视频管理" + '下载了' + item.fname.substring(item.fname.indexOf('/') + 1, item.fname.length)
                  }
                  if (name === 'file') {
                    item.sentence = item.username + ":在文件管理" + '下载了' + item.fname.substring(item.fname.indexOf('/') + 1, item.fname.length)
                  }
                  if (name === 'image') {
                    item.sentence = item.username + ":在图片管理" + '下载了' + item.fname.substring(item.fname.indexOf('/') + 1, item.fname.length)
                  }
                }
                if (item.types === 3) {
                  let name = item.fname.substring(0, item.fname.indexOf('/'))
                  if (name === 'video') {
                    item.sentence = item.username + ":在视频管理" + '创建了' + item.fname.substring(item.fname.indexOf('/') + 1, item.fname.length) + '文件夹'
                  }
                  if (name === 'file') {
                    item.sentence = item.username + ":在文件管理" + '创建了' + item.fname.substring(item.fname.indexOf('/') + 1, item.fname.length) + '文件夹'
                  }
                  if (name === 'image') {
                    item.sentence = item.username + ":在图片管理" + '创建了' + item.fname.substring(item.fname.indexOf('/') + 1, item.fname.length) + '文件夹'
                  }
                }
              })
              this.totalLog = res.data.total
            }
          })
        },
        fetchDataObj() {
          let sort = 'desc'
          let name = 'created_time'
          findFile(this.fileDataid.folderId, this.currentPage, '', this.size, name, sort, '').then(res => {
            if (res.queue.code === 1) {
              this.list = res.data.list
              this.totalObj = res.data.total
            }
          })
        },
        downsImage() {
          if (this.flag === true) {
            this.location = '文件管理/'
          } else {
            this.location = '文件管理/' + this.locationUrl + '/'
          }
          this.visible = true
        },
        deleInformation(id) {
          this.$confirm('是否删除此文件夹?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let obj = {
              ids: [id],
              state: `1`
            }
            deleteFile(obj).then(res => {
              if (res.queue.code === 1) {
                this.mess('删除成功', 'success')
                this.fetchData()
              }
            })
          }).catch(() => {

          })
        },
        deleFile(id) {
          this.$confirm('是否删除此文件?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let obj = {
              ids: [id],
              state: `2`
            }
            deleteFile(obj).then(res => {
              if (res.queue.code === 1) {
                this.mess('删除成功', 'success')
                this.fetchData()
              }
            })
          }).catch(() => {

          })
        },
        deleFile01(id) {
          this.$confirm('是否删除此文件?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let obj = {
              ids: [id],
              state: `2`
            }
            deleteFile(obj).then(res => {
              if (res.queue.code === 1) {
                this.mess('删除成功', 'success')
                this.fetchDataObj()
              }
            })
          }).catch(() => {

          })
        },
        image(id) {
          if (this.flag === true) {
            this.fileList.forEach(item => {
              if (item.id === id) {
                this.img.name = item.fileName
                this.img.type = item.fileName.substring(item.fileName.indexOf('.') + 1, item.fileName.length)
                this.img.url = item.downUrl
              }
            })
          }
          if (this.flag === false) {
            this.list.forEach(item => {
              if (item.id === id) {
                this.img.name = item.fileName
                this.img.type = item.fileName.substring(item.fileName.indexOf('.') + 1, item.fileName.length)
                this.img.url = item.downUrl
              }
            })
          }
          this.drawer = true
        },
        downs(url) {
          window.location.href = url; // 本窗口打开下载
        },
        handleSelectionChange(val) {
          this.multipleSelection = val;
        },
        onCopy(e) {
          this.mess('内容已复制到剪切板！', 'success')
        },
        batch() {
          let mess = ''
          if (this.value === `1`) {
            mess = '您确定要批量下载这些文件吗?'
            this.$confirm(mess, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.multipleSelection.forEach(item => {
                setTimeout(() => {
                  downloadFile(item.downUrl)
                }, 1000);
              })
              this.value = "0"
            }).catch(() => {
              this.value = "0"
            })
          }
          if (this.value === `2`) {
            mess = '您确定要批量删除这些文件吗?'
            this.$confirm(mess, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let arr = []
              this.multipleSelection.forEach(item => {
                arr.push(item.id)
              })
              let obj = {
                ids: arr,
                state: `2`
              }
              deleteFile(obj).then(res => {
                if (res.queue.code === 1) {
                  this.mess('删除成功', 'success')
                  this.fetchDataObj()
                }
              })
              this.value = "0"
            }).catch(() => {
              this.value = "0"
            })
          }
        },
        log() {
          this.fetchDataLog();
          this.visibleLog = true
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
            if (this.flag === true) {
              if (this.currentPage === 1) {
                findFolder(search, '1').then(res => {
                  if (res.queue.code === 1) {
                    res.data.forEach(item => {
                      item.type = '1'
                    })
                    this.fileList = res.data
                  }
                })
                findFileData(this.currentPage, search, 5, name, sort, '1').then(res => {
                  if (res.queue.code === 1) {
                    res.data.list.forEach(item => {
                      item.type = '2'
                      item.folderName = item.fileName
                    })
                    res.data.list.forEach(item => {
                      this.fileList.push(item)
                    })
                    this.total = res.data.total
                  }
                })
              } else {
                findFileData(this.currentPage, '', 5, name, sort, '1').then(res => {
                  if (res.queue.code === 1) {
                    res.data.list.forEach(item => {
                      item.type = '2'
                      item.folderName = item.downUrl
                    })
                    this.fileList = res.data.list
                    this.total = res.data.total
                  }
                })
              }
            } else {
              let sort = 'desc'
              let name = 'created_time'
              findFile(this.fileDataid.folderId, this.currentPage, search, this.size, name, sort, '').then(res => {
                if (res.queue.code === 1) {
                  this.list = res.data.list
                  this.totalObj = res.data.total
                }
              })
            }
          }
        },
        value(value) {
          if (value !== '0') {
            this.batch();
          }
        },
        multipleSelection(multipleSelection) {
          if (multipleSelection.length === 0) {
            this.value = '0'
          }
        }
      }
    }
  </script>
  <style scoped>
    .file {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 360px;
      background-color: #f5f5f5;
      color: #888;
    }

    .drawer {
      top: 50px;
    }

    .divBorder {
      border-bottom: 1px solid #DCDFE6;
    }

    .divBorder:hover {
      border-bottom: 1px solid #409eff;
    }

    .divBorder div {
      border-bottom: 1px solid #409eff;
      transition: 0.1s;
    }

    .upload-demo .el-upload-dragger {
      width: 100%;
    }

    .el-upload {
      width: 100%;
    }

    li {
      display: list-item;
      text-align: -webkit-match-parent;
    }

    .oss-intl-lines p, .oss-intl-lines ul, .oss-intl-lines ol {
      margin-top: 8px;
      margin-bottom: 8px;
      line-height: inherit !important;
    }

    .next-form-item-extra {
      margin-top: 8px;
      color: #888;
      font-size: 14px;
      line-height: 1.5;
    }

    .code {
      color: #f25c7f;
      padding: 0 4px;
      font-family: monospace, monospace;
    }

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
  <style>
    .el-drawer .el-drawer__header {
      margin-bottom: 10px;
    }
  </style>
