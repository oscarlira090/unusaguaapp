<template>
  <Page>
    <ActionBar title="Registro de Agua - UNUS">
      <ActionItem
        text="Refresh"
        @tap="consultarMedidores()"
        android.position="actionBar"
        android.systemIcon="ic_popup_sync"
      />
       <ActionItem
        text="Salir"
        @tap="salir"
        android.position="popup"
      />

    </ActionBar>
    <GridLayout rows="*">
      <ScrollView orientation="vertical" col="0" row="0">
        <StackLayout orientation="vertical">
          <GridLayout columns="*" rows="auto,auto,auto,auto,auto,auto,auto,auto" class="m-b-40 m-r-10">
             

            <GridLayout class="user-title m-b-20" col="0" row="0" columns="auto,*" rows="auto"  >
              <Image :src="user.foto" stretch="aspectFit" height="50" width="50" col="0" row="0" />
              <Label col="1" row="0" class="m-20 h1 fa" verticalAlignment="center">{{user.name}}</Label>
            </GridLayout>

            <StackLayout col="0" row="1" class="card-custom m-b-20">
              <Label
                alignSelf="center"
                text="*Foto del Medidor"
                horizontalAlignment="center"
              ></Label>
              <Image
                class="m-b-20 m-t-10 m-l-10 m-r-10"
                @tap="startCamera"
                horizontalAlignment="center"
                :src="imageSrc"
                :visibility="tookpicture?'visible':'collapsed'"
                :height="previewSize"
                :width="previewSize"
                stretch="aspectFit"
              />
              <Label
                @tap="startCamera"
                :class="classCamara"
                horizontalAlignment="center"
                :visibility="!tookpicture?'visible':'collapsed'"
              >{{'fa-camera' | fonticon}}</Label>
            </StackLayout>

            <ActivityIndicator
              :visibility="(registrando?'visible':'collapse')"
              :busy="registrando"
              col="0"
              row="2"
            />

             <Label
                col="0"
                row="3"
                class="m-t-10 m-b-20 text-error"
                text="Comprueba la conexión de Red."
                horizontalAlignment="center"
                :visibility="(errorRed?'visible':'collapse')"
              ></Label>

            <Button
                :visibility="(errorRed?'visible':'collapse')"
                col="0"
                row="4"
                width="50%"
                text="REINTENTAR"
                @tap="consultarMedidores()"
              />
              
            <GridLayout class="card-custom" col="0" row="5" columns="*" rows="auto,auto,auto">

              <GridLayout  columns="*,auto" rows="auto" class="m-t-10 m-l-10 m-r-10 m-b-20" col="0" row="0" orientation="horizontal">
                <Label   text="*Seleccione un medidor" col="0" row="0" ></Label>
                <Switch  v-model="medidorSelected" col="1" row="0" />
              </GridLayout>
              
              <ListPicker
                :isEnabled = "!medidorSelected"
                :visibility="(!consultandoMedidores?'visible':'collapse')"
                col="0"
                row="1"
                :items="medidoresArray"
                v-model="captura.MedidorIndex"
                
              />
              <ActivityIndicator
                :visibility="(consultandoMedidores?'visible':'collapse')"
                :busy="consultandoMedidores"
                col="0"
                row="1"
              />

              <GridLayout col="0" row="2" columns="*" rows="*,auto">
                <TextField v-model="captura.Lectura" keyboardType="number"  col="0" row="0" hint="*Lectura"/>
                <Label
                  col="0"
                  class="note m-l-10 m-r-10 m-b-20"
                  row="1"
                  text="*Registro de consumo de agua en metros cúbicos"
                ></Label>
              </GridLayout>
            </GridLayout>
            <GridLayout class="m-b-20 m-l-10 m-r-10 m-t-10" col="0" row="6" columns="*" rows="auto">
              <!--<Label  class="op-cancelar m-r-10" col="0" row="0" text="CANCELAR" verticalAlignment="center" @tap="cancelar"></Label>-->
              <Button
                :isEnabled="!registrando"
                col="1"
                row="0"
                text="GUARDAR"
                @tap="guardar"
                :class="classBtn"
              />
            </GridLayout>
          </GridLayout>
        </StackLayout>
      </ScrollView>
    </GridLayout>
  </Page>
</template>

<script >
import { mapGetters, mapActions } from "vuex";
import { alert, confirm } from "tns-core-modules/ui/dialogs";
import LoginService from "@/services/LoginService";
import LoginVue from "./Login.vue";
import { takePicture, requestPermissions } from "nativescript-camera";
import { fromAsset } from "tns-core-modules/image-source";
const application = require("tns-core-modules/application");

import {
  connectionType,
  getConnectionType
} from "tns-core-modules/connectivity";

const loginService = new LoginService();

export default {
  components: {
    LoginVue,
  },
  data() {
    return {
      pressCamara: false,
      captura: {
        MedidorIndex: 0,
        MedidorId: 0,
        Lectura: "",
        FechaCaptura: "",
        UsuarioId: "",
        Foto: ""
      },
      imageSrc: "",
      previewSize: "300",
      thumbSize: 80,
      thumbSize: null,
      tookpicture: false,
      registrando: false,
      consultandoMedidores: false,
      errorRed:false,
      medidorSelected:false,
      countResumeEvent:0
    };
  },
  //start the app, first time
  mounted: function() {
    let vm = this;
    this.SetUser();
    this.consultarMedidores();
      // App was reopened.../second time
      application.on(application.resumeEvent, function (args) {
        if (args.android) {
          vm.consultarMedidores();
          vm.countResumeEvent++;  
          console.log("Resume: " +vm.countResumeEvent,  args.android);
        } 
    });

  },
  computed: {
    ...mapGetters({
      getUser: "login/getUser",
      getMedidoresArray: "medidor/getMedidoresArray",
      getMedidores: "medidor/getMedidores"
    }),
    user: function() {
      return this.getUser;
    },
    medidoresArray: function() {
      return this.getMedidoresArray;
    },
    medidores: function() {
      return this.getMedidores;
    },
    classCamara: function() {
      return {
        fa: true,
        "camara-default": !this.pressCamara,
        "camara-hover": this.pressCamara
      };
    },
    classBtn: function() {
      return {
        "btn-desabled": this.registrando,
        "btn-app": !this.registrando,
        "btn btn-rounded-sm fa": true
      };
    },
  },
  methods: {
    ...mapActions({
      SetUser: "login/SetUser",
      SetMedidores: "medidor/SetMedidores",
      Registrar: "captura/Registrar"
    }),
    consultarMedidores(){
      let vm=this;
      vm.consultandoMedidores = true;
      vm.errorRed=false;
      if (getConnectionType() === connectionType.none) {
          vm.errorRed=true;
          return;
      }
      vm.SetMedidores().then(result => {
          vm.consultandoMedidores = false;
          vm.errorRed = false;
          }).catch(e => {
            vm.consultandoMedidores = false;
            alert("Error al consultar medidores.");
            });
    },
    startCamera() {
      this.pressCamara = true;
      let vm = this;
      requestPermissions()
        .then(() => {
          takePicture({
            width: 300,
            height: 300,
            keepAspectRatio: true,
            saveToGallery: false
          })
            .then(imageAsset => {
              vm.tookpicture = true;
              vm.imageSrc = imageAsset;
              fromAsset(imageAsset)
                .then(res => {
                  let myImageSource = res;
                  var base64 = myImageSource.toBase64String("jpeg", 100);
                  vm.captura.Foto = base64 + "";
                })
                .catch(e => {
                  console.log("error from asset:", e);
                });
            })
            .catch(e => {
              vm.pressCamara = false;
              console.log("error:", e);
            });
        })
        .catch(e => {
          console.log("Error requesting permission");
        });
    },
    salir() {
      let vm = this;
      confirm({
        title: "Confirmación",
        message: "¿Desea Cerrar Sesión?",
        okButtonText: "Sí",
        cancelButtonText: "No"
      }).then(result => {
        if (result) {
          loginService.logout();
          vm.$navigateTo(LoginVue, {
            clearHistory: true,
            transitionAndroid: {
              name: "slide",
              duration: 500
            }
          });
        }
      });
    },
    guardar() {
      let vm = this;
      let isValid = true;

      if (this.captura.Lectura.length == 0 || this.captura.Lectura <= 0) {
        isValid = false;
      }

      if (this.captura.Foto == "") {
        isValid = false;
      }
      if (!isValid) {
        alert("*Faltan Campos obligatorios.");
        return;
      }

      let medidor = this.medidores.find(function(m, index) {
        return index == vm.captura.MedidorIndex;
      });
      if (medidor != undefined) {
        vm.captura.MedidorId = medidor.MedidorId;
      }
      //return;
      this.captura.UsuarioId = this.user.id;
      this.captura.FechaCaptura = "1999-01-01 07:00:00";

      
      confirm({
        title: "Confirmación",
        message: "Medidor: " + medidor.Nombre+'&'+medidor.Ubicacion + "\nLectura: " +vm.captura.Lectura + "\n\n¿La información es correcta?",
        okButtonText: "Sí",
        cancelButtonText: "No",
        cancelable: false
      }).then(result => {
        if (result) {
          if (getConnectionType() === connectionType.none) {
            alert("Se requiere conexión a Internet.");
            return;
          }
          vm.registrando = true;
          vm.Registrar(vm.captura)
            .then(data => {
              vm.cancelar();
              
              alert({
                title: "Info",
                message: "El registro fue satisfactorio",
                okButtonText: "Ok"
              }).then(() => {
                console.log("Alert dialog closed");
                vm.registrando = false;
              });
            })
            .catch(error => {
              console.error(
                "Error al registrar consumo de Agua",
                error,
                JSON.stringify(vm.captura)
              );
              vm.registrando = false;
              alert("Error al registrar consumo de Agua.");
            });
        }
      });
    },
    cancelar() {
      this.captura.FechaCaptura = "";
      this.captura.Foto = "";
      this.captura.Lectura = "";
      this.pressCamara = false;
      this.tookpicture = false;
      this.captura.MedidorIndex = 0;
      this.captura.MedidorId = 0;
      this.medidorSelected=false;
    },
  }
};
</script>


