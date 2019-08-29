import Vue from 'vue';
import Vuex from 'vuex';
import LoginService from '@/services/LoginService';
import MedidorService from '@/services/MedidorService';
import ConsumoAguaService from '@/services/ConsumoAguaService';

const loginService = new LoginService();
const medidorService = new MedidorService();
const consumoAguaService = new ConsumoAguaService();

Vue.use(Vuex);

const LoginModule = {
  namespaced: true,
  state: { 
    user:{
      id:'',
      name:'',
      tokenKey:'',
      foto:''
    },
   },
   mutations: {  
    SET_USER(state, data) {
      state.user = data;
    },
  },
  actions:{
    Autenticar({commit },data) {
      return new Promise((resolve, reject) => {
        loginService.login(data)
        .then(data => {
          commit('SET_USER', {'id':loginService.getUserId(),'name':loginService.getUserNombre(),'tokenKey':loginService.getTokenKey(),'foto':loginService.getUserFoto()});
          resolve();
        }).catch(error => {
          console.error(`Error for authenticate from the backend: ${error}.`)        
          reject(error);
        })
      })
    },
    SetUser({ commit }){
      commit('SET_USER', {'id':loginService.getUserId(),'name':loginService.getUserNombre(),'tokenKey':loginService.getTokenKey(),'foto':loginService.getUserFoto()});
    }
  },
  getters:{
    getUser(state) {
      return state.user;
    },
  }
}

const MedidorModule = {
  namespaced: true,
  state: { 
    medidores:[],
    medidoresArray:[]
   },
   mutations: {  
    SET_MEDIDORES(state, data) {
      state.medidores = data;
      let opciones =state.medidores.map(function(m){
        return  m.Nombre+'&'+m.Ubicacion;
      });
      state.medidoresArray = opciones;
    },
  },
  actions:{
    SetMedidores({ commit }) {
      return new Promise((resolve, reject) => {
        
        medidorService.gets()
        .then(data => {
          commit('SET_MEDIDORES', data);
          resolve(data);
        }).catch(error => {
          console.error(`Error for get Medidores from the backend: ${error}.`)        
          reject(error);
        })
      })
    },
  },
  getters:{
    getMedidores(state) {
      return state.medidores;
    },
    getMedidoresArray(state) {
      return state.medidoresArray;
    },
  }
}


const CapturaModule = {
  namespaced: true,
  state: { 
   },
   mutations: {  
  },
  actions:{
    Registrar({},data) {
      return new Promise((resolve, reject) => {
        consumoAguaService.registrarConsumo(data)
        .then(data => {
          resolve();
        }).catch(error => {
          console.error(`Error for add Captura from the backend: ${error}.`)        
          reject(error);
        })
      })
    },
  },
  getters:{
  }
}


const AppSyncModule = {
  namespaced: true,
  state: { 
    updating:false,
    updatingText:''
   },
   mutations: {  
    SET_SYNC_ESTATUS(state, data) {
      state.updating = data;
    },
    SET_SYNC_ESTATUS_TEXT(state, data) {
      state.updatingText = data;
    },
  },
  actions:{
    setSyncEstatus({commit},data) {
      commit('SET_SYNC_ESTATUS', data);
    },
    setSyncEstatusText({commit},data) {
      commit('SET_SYNC_ESTATUS_TEXT', data);
    },
  },
  getters:{
    getSyncEstatus(state) {
      return state.updating;
    },
    getSyncEstatusText(state) {
      return state.updatingText;
    },
  }
}

export default new Vuex.Store({
  modules: {
    login:LoginModule,
    medidor:MedidorModule,
    captura:CapturaModule,
    appSyncU:AppSyncModule
  },
});
