import {request} from 'tns-core-modules/http'
import BackendService from './BackendService'
import { getString } from 'tns-core-modules/application-settings'

const tokenKey = "token";

export default class MedidorService extends BackendService {

  gets() {
    return new Promise((resolve, reject) => {
      request({
        url: this.apiUrlMedidorAgua,
        method: "GET",
        headers: { 
          'Authorization': 'Bearer ' + getString(tokenKey) ,
          "Content-Type": "application/json"
        },
        timeout:5000,
        content: {}
      }).then(this.validateCode)
      .then(this.getJson)
      .then(data => {
        resolve(data)
      })
    })
  }
}