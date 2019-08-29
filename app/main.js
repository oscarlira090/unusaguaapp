import Vue from 'nativescript-vue';
import Login from './components/Login';
import App from './components/App';
import store from './store/store';
import VueDevtools from 'nativescript-vue-devtools';
import LoginService from '@/services/LoginService';
import {Folder} from "tns-core-modules/file-system";
import {TNSFontIcon, fonticon} from 'nativescript-fonticon';
import { LocalNotifications } from "nativescript-local-notifications";
import FCMTokenService from '@/services/FCMTokenService';
import { messaging } from "nativescript-plugin-firebase/messaging";

const loginService = new LoginService();
const utilsModule = require("tns-core-modules/utils/utils");
const fcmTokenService = new FCMTokenService();

TNSFontIcon.debug = true;
TNSFontIcon.paths = {
  'fa': './assets/fonts/font-awesome.css'
};
TNSFontIcon.loadCss();

Vue.filter('fonticon', fonticon);
// Prints Vue logs when --env.production is *NOT* set while building
if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
Vue.config.silent = (TNS_ENV === 'production')

messaging.registerForPushNotifications({
  onPushTokenReceivedCallback: (token) => {
    fcmTokenService.registrarToken({Token:token});
    console.log("Firebase push token: " + token);
  },
  onMessageReceivedCallback: (message) => {
    console.log("Push message received: " , message);
    LocalNotifications.schedule(
      [{
        //id: 1,
        title: message.data.title,
        //subtitle: 'This poster is awesome!',
        body: message.data.body,
        bigTextStyle: true, // Allow more than 1 row of the 'body' text on Android, but setting this to true denies showing the 'image'
        //color: new Color("green"),
        //image: "https://images-na.ssl-images-amazon.com/images/I/61mx-VbrS0L.jpg",
        thumbnail: false,
        forceShowWhenInForeground: true,
        channel: "vue-channel",
        //ticker: "Special ticker text for Vue (Android only)",
        //at: new Date(new Date().getTime() + (5 * 1000)), // 5 seconds from now
        icon: 'res://ic_stat_unus',
        sound:'default',
        ongoing:false
      }]).then(
        function(scheduledIds) {
          console.log("Notification id(s) scheduled: " + JSON.stringify(scheduledIds));
        },
        function(error) {
          console.log("scheduling error: " + error);
        }
    )
  },

  // Whether you want this plugin to automatically display the notifications or just notify the callback. Currently used on iOS only. Default true.
  showNotifications: false,

  // Whether you want this plugin to always handle the notifications when the app is in foreground. Currently used on iOS only. Default false.
  showNotificationsWhenInForeground: true
}).then(() => console.log("Registered for push"));





//removes pictures in the files folder 

try{
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
}catch(e){
  console.log(e);
}


new Vue({
  store,
  render: h => {
    loginService.expirarSesion();
    return h('frame', [h(loginService.isLogged()?App:Login)])
  }
}).$start()
