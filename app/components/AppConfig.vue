<template>
  <Page>
    <ActionBar title="Configuración - UNUS" />
    <StackLayout orientation="vertical" class="m-20">
       <Label  class="" >*IP</Label>
       <TextField v-model="config.ip"/>
       <Label >*Puerto</Label> 
       <TextField v-model="config.puerto"/>
        <Button
            :text="'fa-check'  | fonticon"
            width="120"
            horizontalAlignment="right"
            class="fa btn-app btn btn-rounded-sm"
            @tap="guardar"
          />
    </StackLayout>
  </Page>
</template>

<script >

import { alert } from "tns-core-modules/ui/dialogs";
import { setString, getString } from 'tns-core-modules/application-settings';
import LoginVue from "./Login.vue";

export default {
  components: {
     LoginVue
  },
  data() {
    return {
      config:{
        ip:'',
        puerto:''
      }
    };
  },
  computed: {
    
  },
  mounted: function() {
     this.config.ip = getString("IP","");
     this.config.puerto = getString("PUERTO","");
  },
  methods: {
    guardar(){
      var vm = this;
      setString("IP", this.config.ip);
      setString("PUERTO", this.config.puerto);
      alert("Configuración guardada.").then(() => {
        vm.$navigateTo(LoginVue, {
            clearHistory: true,
            transitionAndroid: {
              name: "slide",
              duration: 500
            }
          });
        });
    }
  }
};
</script>


