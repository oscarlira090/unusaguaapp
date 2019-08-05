<template>
  <Page>
    <ActionBar title="Iniciar Sesión - UNUS" />
    <ScrollView orientation="vertical" col="0" row="0">
      <StackLayout orientation="vertical">
        <GridLayout columns="*" rows="auto,auto,auto,auto,auto,auto,auto" class="main">
          <ActivityIndicator
            :visibility="(autenticando?'visible':'collapse')"
            :busy="autenticando"
            col="0"
            row="0"
          />
          <Image
            @loaded="logoAnimation"
            opacity=0
            col="0"
            row="1"
            src="~/assets/images/unus.png"
            height="90"
            width="250"
            stretch="aspectFit" 
            ref="imgUnus"
          />

          <Label col="0" row="2" class="" >*Usuario</Label>
           <TextField text v-model="usuario.user" col="0" row="3"  class=""/>
           <Label col="0" row="4" class="" >*Contraseña</Label> 
           <TextField text v-model="usuario.password" secure="true" col="0" row="5" class=""/>
           
          <Button
            :isEnabled="!autenticando"
            col="0"
            row="6"
            :text="'fa-check'  | fonticon"
            width="120"
            horizontalAlignment="right"
            @tap="login"
            :class="classBtn"
          />
        </GridLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script >
import { mapActions } from "vuex";
import AppVue from "./App.vue";
import {
  connectionType,
  getConnectionType
} from "tns-core-modules/connectivity";
import { alert } from "tns-core-modules/ui/dialogs";

export default {
  components: {
    AppVue
  },
  data() {
    return {
      usuario: {
        user: "",
        password: ""
      },
      autenticando: false
    };
  },
  computed: {
    classBtn: function() {
      return {
        "btn-desabled": this.autenticando,
        "btn-app": !this.autenticando,
        "btn btn-rounded-sm fa": true
      };
    }
  },
  mounted: function() {
    
  },
  methods: {
    ...mapActions({
      Autenticar: "login/Autenticar"
    }),
    logoAnimation(){
      this.$refs.imgUnus.nativeView
        .animate({
          opacity: 1,
          duration: 2500})
        .then(() => {
        })
    },
    login() {
      let vm = this;
      let validForm = true;

      if (this.usuario.user == "") {
        validForm = false;
      }
      if (this.usuario.password == "") {
        validForm = false;
      }

      if (!validForm) {
        alert("*Faltan Campos obligatorios.");
        return;
      }

      if (getConnectionType() === connectionType.none) {
        alert("Se requiere conexión a Internet.");
        return;
      }
      this.autenticando = true;
      this.Autenticar(this.usuario)
        .then(() => {
          vm.$navigateTo(AppVue, {
            clearHistory: true,
            transitionAndroid: {
              name: "slide",
              duration: 500
            }
          });
          //this.autenticando=false;
        })
        .catch(error => {
          this.autenticando = false;
          console.log("Error al iniciar sesión", error);
          alert("Error al iniciar sesión");
        });
    }
  }
};
</script>


