<template>
  <div>
    <el-card class="card-layout">
      <div>
        <!--<el-date-picker
          v-model="value"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
         size="small">
        </el-date-picker>-->
        <el-radio-group style="margin-left: 42.5%" v-model="health" size="small">
          <el-radio-button :label="1">主题</el-radio-button>
          <el-radio-button :label="2">文章</el-radio-button>
          <el-radio-button :label="3">视频</el-radio-button>
          <el-radio-button :label="4">医生</el-radio-button>
        </el-radio-group>
      </div>
    </el-card>
    <el-card class="card-layout">
      <label-data v-if="health===1"/>
      <article-data v-if="health===2"/>
      <video-data v-if="health===3" :date-time="value"/>
      <doctors-data v-if="health===4"/>
    </el-card>
  </div>
</template>

<script>
  import videoData from './components/video.vue'
  import articleData from './components/article.vue'
  import doctorsData from './components/doctors.vue'
  import labelData from './components/label.vue'

  export default {
    name: "index",
    components: {
      videoData,
      articleData,
      doctorsData,
      labelData
    },
    data() {
      return {
        health: 1,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value: [new Date(2020, 2, 1, 0, 0), new Date(2020, 2, 7, 24, 0)],
      }
    },
  }
</script>

<style scoped>
  .card-layout {
    margin: 8px;
  }
</style>

