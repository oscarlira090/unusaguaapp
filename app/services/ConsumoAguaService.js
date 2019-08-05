import {request} from 'tns-core-modules/http'
import BackendService from './BackendService'
import { getString } from 'tns-core-modules/application-settings'


const tokenKey = "token";

export default class ConsumoAguaService extends BackendService {

  registrarConsumo(data) {
    console.log(JSON.stringify(data));
    return new Promise((resolve, reject) => {
      request({
        url: this.apiUrlConsumoAgua,
        method: "POST",
        headers: { 
          'Authorization': 'Bearer ' + getString(tokenKey) ,
          "Content-Type": "application/json"
        },
        content: JSON.stringify(data)
      }).then(this.validateCode)
      .then(this.getJson)
      .then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}