import {request} from 'tns-core-modules/http'
import BackendService from './BackendService'
import { getString } from 'tns-core-modules/application-settings'


const tokenKey = "token";

export default class FCMTokenService extends BackendService {

  registrarToken(data) {
    request({
      url: this.apiUrlFCMTokenAgua,
      method: "POST",
      headers: { 
        'Authorization': 'Bearer ' + getString(tokenKey) ,
        "Content-Type": "application/json"
      },
      content: JSON.stringify(data)
    }).then(this.validateCode)
    .then(this.getJson)
    .then(data => {
    }).catch(error => {
    })
  }
}