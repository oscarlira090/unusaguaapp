import Vue from 'nativescript-vue'
import Login from './components/Login'
import App from './components/App'
import store from './store/store';
import {TNSFontIcon, fonticon} from 'nativescript-fonticon';
import VueDevtools from 'nativescript-vue-devtools'
import LoginService from '@/services/LoginService'
import _ from "lodash";
import {Folder} from "tns-core-modules/file-system"
const loginService = new LoginService();
//const fileSystemModule = require("tns-core-modules/file-system");
const utilsModule = require("tns-core-modules/utils/utils");
//Icons font awesome
TNSFontIcon.debug = true;
TNSFontIcon.paths = {
  'fa': './assets/fonts/font-awesome.css'
};
TNSFontIcon.loadCss();
Vue.filter('fonticon', fonticon);


if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')
//removes pictures in the files folder 
if(utilsModule.ad.getApplicationContext().getExternalFilesDir(null)!=null){
  let tmpfolder = Folder.fromPath(utilsModule.ad.getApplicationContext().getExternalFilesDir(null).getAbsolutePath())
  tmpfolder.clear().then(function () {
   console.log("Successfully cleared the folder.");
 }, function (error) {
   console.log("Failed to clear the folder.");
  });
}else{
  console.log("External files not available.");
}


new Vue({
  store,
  render: h => {
    loginService.expirarSesion();
    return h('frame', [h(loginService.isLogged()?App:Login)])
  }
}).$start()
