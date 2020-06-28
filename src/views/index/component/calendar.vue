<!--
<template>
  <div>
    <el-card shadow="hover" class="el-card-c" style="width: 410px;margin: 8px;padding: 0px">
      <Calendar
        :choseDay="clickDay"
        :changeMonth="changeDate"
        :isToday="clickToday"
        class="calendar-layout"
      />
    </el-card>
  </div>
</template>

<script>
  import Calendar from 'vue-calendar-component'

  export default {
    name: "calendar",
    components: {
      Calendar
    },
    data() {
      return {
        arr: [{date: '2018/4/1', className: "mark1"}, {date: '2018/4/13', className: "mark2"}]
      }
    },
    methods: {
      clickDay(data) {
        console.log(data); //选中某天
      },
      changeDate(data) {
        console.log(data); //左右点击切换月份
      },
      clickToday(data) {
        console.log(data); //跳到了本月
      },

    }
  }

</script>

<style lang="scss">
  //#f2f8fe
  @media screen and (min-width: 460px) {
    .wh_item_date[data-v-2ebcbc83]:hover {
      background: #f2f8fe;
      cursor: pointer
    }
  }

  [data-v-2ebcbc83] {
    margin: 0;
    padding: 0
  }

  .wh_container[data-v-2ebcbc83] {
    max-width: 410px;
    margin: auto
  }

  li[data-v-2ebcbc83] {
    list-style-type: none
  }

  .wh_top_changge[data-v-2ebcbc83] {
    display: flex
  }

  .wh_top_changge li[data-v-2ebcbc83] {
    cursor: pointer;
    display: flex;
    color: #777;
    font-size: 18px;
    flex: 1;
    justify-content: center;
    align-items: center;
    height: 47px
  }

  .wh_top_changge .wh_content_li[data-v-2ebcbc83] {
    cursor: auto;
    flex: 2.5
  }

  .wh_content_all[data-v-2ebcbc83] {
    font-family: -apple-system, BlinkMacSystemFont, PingFang SC, Helvetica Neue, STHeiti, Microsoft Yahei, Tahoma, Simsun, sans-serif;
    background-color: #ffffff;
    width: 100%;
    overflow: hidden;
    padding-bottom: 8px
  }

  .wh_content[data-v-2ebcbc83] {
    display: flex;
    flex-wrap: wrap;
    padding: 0 3%;
    width: 100%
  }

  .wh_content:first-child .wh_content_item[data-v-2ebcbc83],
  .wh_content:first-child .wh_content_item_tag[data-v-2ebcbc83] {
    color: #888888;
    font-size: 16px
  }

  .wh_content_item[data-v-2ebcbc83], wh_content_item_tag[data-v-2ebcbc83] {
    font-size: 15px;
    width: 13.4%;
    text-align: center;
    color: #777;
    position: relative
  }

  .wh_content_item[data-v-2ebcbc83] {
    height: 40px
  }

  .wh_item_date[data-v-2ebcbc83], .wh_top_tag[data-v-2ebcbc83] {
    width: 40px;
    height: 40px;
    line-height: 40px;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center
  }

  .wh_jiantou1[data-v-2ebcbc83] {
    width: 12px;
    height: 12px;
    border-top: 2px solid #777;
    border-left: 2px solid #777;
    transform: rotate(-45deg)
  }

  .wh_jiantou1[data-v-2ebcbc83]:active, .wh_jiantou2[data-v-2ebcbc83]:active {
    border-color: #ddd
  }

  .wh_jiantou2[data-v-2ebcbc83] {
    width: 12px;
    height: 12px;
    border-top: 2px solid #777;
    border-right: 2px solid #777;
    transform: rotate(45deg)
  }

  .wh_content_item > .wh_isMark[data-v-2ebcbc83] {
    margin: auto;
    border-radius: 100px;
    background: blue;
    z-index: 2
  }

  .wh_content_item .wh_other_dayhide[data-v-2ebcbc83], .wh_content_item
  .wh_want_dayhide[data-v-2ebcbc83] {
    color: #bfbfbf
  }

  .wh_content_item .wh_isToday[data-v-2ebcbc83] {
    background: #f2f8fe;
    border-radius: 100px
  }

  .wh_content_item .wh_chose_day[data-v-2ebcbc83] {
    background: #1989fa;
    border-radius: 100px
  }

  .el-card-c .el-card__body {
    padding: 0px;
  }
</style>
-->
