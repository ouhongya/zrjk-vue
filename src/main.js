import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import store from './store'
import router from './router'
import VueQuillEditor from 'vue-quill-editor'
import VueCropper from 'vue-cropper'
import VueClipboard from 'vue-clipboard2'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/styles/index.scss' // global css
import '@/icons' // icon
import '@/permission'
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}
import 'default-passive-events'
import 'element-ui/lib/theme-chalk/index.css';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import moment from 'moment'
Vue.use(VueQuillEditor);
Vue.use(VueCropper)
import {hasPermission,message} from '@/utils/validate'
Vue.prototype.hasPerm=hasPermission;
Vue.prototype.mess=message;
Vue.use(ElementUI,);
Vue.use(VueClipboard)
Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})
Date.prototype.format = function(fmt) {
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt)) {
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  for(var k in o) {
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return fmt;
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
