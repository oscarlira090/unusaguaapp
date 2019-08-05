import {request} from 'tns-core-modules/http';
import BackendService from './BackendService'
import { getString,setString,hasKey,getNumber,clear,setNumber } from 'tns-core-modules/application-settings'
import * as moment from "moment/moment";
const userId = "userId";
const tokenKey = "token";
const fechaLogin = "fechaLogin";
const userNombre = "userNombre";
const userFoto = "userFoto";

export default class LoginService extends BackendService {

  login(user_) {
    return request({
      url: this.apiUrlToken,
      method: "POST",
      headers: {
          'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'
      },
      content: `grant_type=password&username=${user_.user}&password=${user_.password}`
    })
    .then(this.validateCode)
    .then(this.getJson)
    .then(data => {

        let jsonData= JSON.parse(data.data); 
        setString(tokenKey, data.access_token);
        setString(fechaLogin, moment().format());
        setString(userNombre, jsonData.Nombre);
        setNumber(userId, jsonData.UsuarioId);
        setString(userFoto, jsonData.Foto);
    })
  }

  logout() {
    clear();
  }

  getUserNombre(){
    const userNombreExists = hasKey(userNombre);
    if(userNombreExists){
      return getString(userNombre);
    }
    return undefined;
  }

  getTokenKey(){
    const tokenKeyExists = hasKey(tokenKey);
    if(tokenKeyExists){
      return getString(tokenKey);
    }
    return undefined;
  }

  getFechaLogin(){
    const fechaLoginExists = hasKey(fechaLogin);
    if(fechaLoginExists){
      return getString(fechaLogin);
    }
    return undefined;
  }

  getUserId(){
    const userIdExists = hasKey(userId);
    if(userIdExists){
      return getNumber(userId);
    }
    return undefined;
  }

  getUserFoto(){
    const userFotoExists = hasKey(userFoto);
    if(userFotoExists){
      return getString(userFoto);
    }
    return undefined;
  }

  isLogged(){
    return this.getUserNombre()!=undefined&&this.getTokenKey()!=undefined&&this.getUserId()!=undefined;
  }

  expirarSesion(){
    const fechaLoginExists = hasKey(fechaLogin);
    if(fechaLoginExists){
      let fechaA =  moment(getString(fechaLogin));
      let diffMinutes= moment().diff(fechaA, 'minutes');
      if(diffMinutes > 30){
        this.logout();
      }
      console.log("Fecha de login",fechaA);
      console.log("diferencia",diffMinutes);
    }
  }

  getCommonHeaders() {
    return {
      "Content-Type": "application/json",
      "Authorization": this.appUserHeader,
    }
  }
}