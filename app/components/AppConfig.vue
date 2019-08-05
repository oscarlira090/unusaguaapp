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
          />
    </StackLayout>
  </Page>
</template>

<script >

import { alert } from "tns-core-modules/ui/dialogs";
import { setString, getString } from 'tns-core-modules/application-settings';

export default {
  components: {
  },
  data() {
    return {
      config:{
        ip:'',
        port:''
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
      setString("IP", this.config.ip);
      setString("PUERTO", this.config.puerto);
    }
  }
};
</script>


