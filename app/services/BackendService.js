
/**
 * Parent service class. Has common configs and methods.
 */
import { getString } from 'tns-core-modules/application-settings'

export default class BackendService {
  constructor() {
    /*
     -Local
    
    this.apiUrlToken = "http://adaeac4e.ngrok.io/token";
    this.apiUrlMedidorAgua = "http://adaeac4e.ngrok.io/api/MedidorAgua";
    this.apiUrlConsumoAgua = "http://adaeac4e.ngrok.io/api/ConsumoAgua";
     */
    /*Desarrollo
     this.apiUrlToken = "http://189.254.227.52:8080/unus/token";
     this.apiUrlMedidorAgua = "http://189.254.227.52:8080/unus/api/MedidorAgua";
     this.apiUrlConsumoAgua = "http://189.254.227.52:8080/unus/api/ConsumoAgua";
    */

    /*Produccion 
    this.apiUrlToken = "http://189.254.227.53:8080/unus/token";
    this.apiUrlMedidorAgua = "http://189.254.227.53:8080/unus/api/MedidorAgua";
    this.apiUrlConsumoAgua = "http://189.254.227.53:8080/unus/api/ConsumoAgua";
    */
     //estable ip y puerto de desarrollo por default
     this.baseIP = "http://" +getString("IP",'189.254.227.52') +":" +getString("PUERTO",'8080')+"/unus/";
     this.apiUrlToken = this.baseIP +"token";
     this.apiUrlMedidorAgua = this.baseIP +"api/MedidorAgua";
     this.apiUrlConsumoAgua = this.baseIP +"api/ConsumoAgua";
    
  }

  validateCode(response) {
    return new Promise((resolve, reject) => {
      if (response.statusCode >= 200 && response.statusCode < 300) {
        resolve(response)
      }
      console.log('Response with code: ' + response.statusCode +
        '\nContent: ' + response.content.toString())
      reject('Response with code: ' + response.statusCode +
        '\nContent: ' + response.content.toString())
    })
  }

  getJson(response) {
    return new Promise((resolve, reject) => {
      console.info('Content: ' + response.content.toString())
      resolve(response.content.toJSON())
    })
      .catch(e => {
        console.error('Error parsing JSON response: ' + e)
        throw 'Error parsing JSON response: ' + e
      })
  }
}