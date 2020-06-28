<template>
  <div>
    <el-card class="card-layout">
      <div id="divLeft" align="center">
        <el-button type="primary" size="small" v-if="hasPerm(`are:add`)" round @click="editArea(1)">添加市</el-button>
        <el-button type="primary" size="small" v-if="hasPerm(`are:edit`)" round @click="editArea(2)">编辑市</el-button>
        <div style="overflow:scroll; width:100%; height:150px;border: 1px solid #EBEEF5">
          <div class="RadioStyle">
            <div v-for="(val) in care" class="Block PaddingL">
              <input :id="val.id" type="radio" name="Storage" :value="val.id" @click="OnfetchData(val.id)">
              <label :id="val.id" :for="val.id">{{ val.name }}</label>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <div id="divRight" align="center">
      <el-card class="card-layout">
        <el-table
          :data="careList"
          style="width: 100%;"
          :render-header="renderHeader"
        >
          <el-table-column
            prop="createdTime"
            label="日期"
            sortable
            align="center"
          >
            <template slot-scope="props">
              {{ props.row.createdTime|dateformat(`YYYY-MM-DD HH:mm`) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="won"
            align="center"
            label="所属市"
          />
          <el-table-column
            prop="name"
            sortable
            label="名称"
            align="center"
          />
          <el-table-column
            label="操作"
            align="center"
            :render-header="renderHeader"
          >
            <template slot-scope="props">
              <el-button type="primary" size="small" v-if="hasPerm(`cit:edit`)" round @click="deit(props.row.id,props.row.name,props.row.won)">编辑区
              </el-button>
              <el-button type="danger" size="small" v-if="hasPerm(`cit:dele`)" round @click="dele(props.row.id)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

    </div>
    <el-dialog
      :title="id===``?'添加区':`编辑区`"
      :visible.sync="Visible"
      width="30%"
      :close-on-click-modal="false"
      :before-close="colose"
      :close-on-press-escape="false"
      style="text-align: center"
    >
      <el-form id="classForm" ref="form" :model="form" style="margin: auto" label-width="80px" align="center">
        <el-form-item label="所属市:">
          <el-input v-model="form.own" disabled/>
        </el-form-item>
        <el-form-item label="区名称:" prop="name" :rules="[{ required: true, message: '请输入市的名称'}]"  >
          <el-input v-model="form.name"/>
        </el-form-item>
      </el-form>
      <span>
        <el-button type="primary" size="small" round @click="colose">取消</el-button>
        <el-button type="primary" size="small" round @click="addCity(`form`)">添加</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="num===1?'添加市':'编辑市'"
      :visible.sync="CityVisible"
      width="30%"
      :close-on-click-modal="false"
      :before-close="colose"
      :close-on-press-escape="false"
      style="text-align: center"
    >
      <el-form id="classForm1" ref="formCity" :model="formCity" label-width="60px" style="margin: auto;width: 90%">
        <el-form-item label="名称:" prop="name" :rules="[{ required: true, message: '请输入市的名称'}]" >
          <el-input v-model="formCity.name"/>
        </el-form-item>
      </el-form>
      <span>
        <el-button type="primary" size="small" round @click="colose">取消</el-button>
        <el-button type="primary" size="small" round @click="adjunction(`formCity`)">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    addCity,
    addArea,
    deleteArea,
    deleteCity,
    findCity,
    updateArea,
    updateCity,
    findArea
  } from '@/api/gather/index'

  export default {
    data() {
      return {
        care: null,
        id: '',
        form: {
          own: null,
          name: null,
          id: null
        },
        formCity: {
          id: null,
          own: '',
          name: ''
        },
        CityVisible: false,
        Visible: false,
        num: null,
        careList: null,
        areaId: null,
      }
    },
    methods: {
      fetchData() {
        findCity().then(res => {
          if (res.queue.code === 1) {
            this.care = res.data.list
          }
        })
      },
      OnfetchData(id) {
        let sort = 'desc'
        let name = 'created_time'
        this.areaId = id
        findArea(id, 1, '', 100, name, sort).then(res => {
          if (res.queue.code === 1) {
            this.careList = res.data.list
            this.care.forEach(item => {
              if (item.id === id) {
                this.careList.forEach(key => {
                  key.won = item.name
                })
              }
            })
          }
        })
      },
      adjunction(formCity) {
        this.$refs[formCity].validate((valid) => {
          if(valid){
            if (this.formCity.id === `` || this.formCity.id === undefined) {
              addCity(this.formCity.name).then(res => {
                if (res.queue.code === 1) {
                  this.mess('添加成功', 'success')
                  this.CityVisible = false
                  this.fetchData()
                }
              })
            }
            if (this.formCity.id !== `` || this.formCity.id !== undefined) {
              const obj = {
                cname: this.formCity.name,
                cid: this.areaId
              }
              var formdata = new FormData();
              formdata.append("cname", this.formCity.name);
              formdata.append("cid", this.areaId);
              updateCity(formdata).then(res => {
                if (res.queue.code === 1) {
                  this.mess('更新成功', 'success')
                  this.CityVisible = false
                  this.fetchData()
                }
              })
            }
          }else{
            return false
          }
        })
      },
      addCity(form) {
        this.$refs[form].validate((valid) => {
          if(valid){
            if (this.id === ``) {
              const arr = {
                name: this.form.name,
                cityId: this.areaId
              }
              addArea(arr).then(res => {
                if (res.queue.code === 1) {
                  this.colose()
                  this.OnfetchData(this.areaId)
                  this.mess('添加成功', 'success')
                }
              })
            }
            if (this.id !== ``) {
              let formdata = new FormData();
              formdata.append("aid", this.form.id);
              formdata.append("aname", this.form.name);
              updateArea(formdata).then(res => {
                if (res.queue.code === 1) {
                  this.OnfetchData(this.areaId, 1, '', 100, 'name', 'desc')
                  this.colose()
                  this.mess('修改成功','success')
                }
              })
            }
          }else{
            return false;
          }
        })
      },
      colose() {
        this.Visible = false
        this.CityVisible = false
        this.formCity.name = ''
        this.formCity.id = ''
        this.form.won = ''
        this.form.name = ''
        this.id = ''
      },
      editArea(num) {
        this.num = num
        if (num === 1) {
          this.CityVisible = true
        }
        if (num === 2) {
          if (this.areaId === null || this.areaId === undefined) {
            this.$message({
              type: 'warning',
              message: '请选择一个市'
            })
            return
          }
          this.care.forEach(item => {
            if (item.id === this.areaId) {
              this.formCity.id = item.id
              this.formCity.name = item.name
            }
          })
          this.CityVisible = true
        }
      },
      deit(id, trueName, own) {
        this.id = id
        this.Visible = true
        this.form.id = id
        this.form.own = own
        this.form.name = trueName
      },
      test() {
        if (this.areaId === `` || this.areaId === undefined) {
          this.$message({
            type: 'warning',
            message: '请选择一个市'
          })
          return
        }
        this.care.forEach(item => {
          if (item.id === this.areaId) {
            this.form.own = item.cityName
          }
        })
        this.Visible = true
      },
      dele(id) {
        this.$confirm('是否删除此区域', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteArea(id).then(res => {
            if (res.queue.code === 1) {
              this.mess(`删除成功`, 'success')
              this.OnfetchData(this.areaId)
            }
          })
        }).catch(() => {
        })
      },
      renderHeader(h) {
        let _this = this
        let a = [h('el-button', {
          props: {
            size: 'small',
            type: 'text',
            icon: 'el-icon-circle-plus-outline',
            margin: 'margin: 10px 0px 10px',
          },
          on: {
            click: () => {
              _this.Visible = true
              _this.care.forEach(item => {
                if (item.id === _this.areaId) {
                  _this.form.own = item.name
                  _this.form.id = item.id
                }
              })
            }
          }
        }), '操作']
        return h(`div`, a)
      },
    },
    created() {
      this.fetchData()
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
<style lang="scss">

  #addFrom.el-form {
    width: 300px;
    margin: 0px 200px 0px 0px;
  }

  .cardClass {
    width: 100%;
    height: 150px;
  }

  .tableCard {
    padding: 5px;
  }

  .RadioStyle label {
    border: 1px solid #00a4ff;
    padding: 2px 10px 2px 5px;
    line-height: 28px;
    min-width: 80px;
    text-align: center;
    float: left;
    margin: 15px 0px 15px 20px;
    border-radius: 4px
  }

  .RadioStyle input {
    display: none
  }

  .RadioStyle input:checked + label {
    background: url(yes.svg) no-repeat right bottom;
    background-size: 21px 21px;
    color: #00a4ff
  }

  .el-table__expanded-cell[class*=cell] {
    padding: 0px 0px 30px 50px;
  }

  .buttonClass {
    margin: 8px 0px 0px 10px;
    font-size: 16px;
  }

  #colorClass.m-colorPicker .colorBtn[data-v-11842410] {
    width: 250px;
    height: 35px;
    float: left;
  }

  #colorId {
    width: 180%;
  }

</style>
