<template>
  <Page>
    <ActionBar title="" />
    <StackLayout width="100%" height="25%">
      <ActivityIndicator :busy="estatus" horizontalAlignment="center" verticalAlignment="center" class="m-t-10"/>
      <Label :text = "estatusText" horizontalAlignment="center" verticalAlignment="center"/>
    </StackLayout>
  </Page>
</template>

<script >

import { mapGetters, mapActions } from "vuex";
import {
  connectionType,
  getConnectionType
} from "tns-core-modules/connectivity";
import { alert } from "tns-core-modules/ui/dialogs";
var AppSync = require("nativescript-app-sync").AppSync;
var InstallMode = require("nativescript-app-sync").InstallMode;
var SyncStatus = require("nativescript-app-sync").SyncStatus;

export default {
  components: {
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters({
      estatus: "appSyncU/getSyncEstatus",
      estatusText: "appSyncU/getSyncEstatusText",
    }),
  },
  mounted: function() {
       //sync for updates
       var vm = this;
       vm.SetEstatus(true);
    AppSync.sync({
          deploymentKey: "0SL6x2E0GglpJpoXy7d5fbPR2kvAsGpbjlM7n", // note that this key depends on the platform you're running on (see the example below)
          installMode: InstallMode.IMMEDIATE,// this is the default install mode; the app updates upon the next cold boot (unless the --mandatory flag was specified while pushing the update) 
          mandatoryInstallMode: InstallMode.IMMEDIATE,// the default is InstallMode.ON_NEXT_RESUME which doesn't bother the user as long as the app is in the foreground. InstallMode.IMMEDIATE shows an installation prompt. Don't use that for iOS AppStore distributions because Apple doesn't want you to, but if you have an Enterprise-distributed app, go right ahead!
           updateDialog: { // only used for InstallMode.IMMEDIATE
           updateTitle: "Info", // an optional title shown in the update dialog 
           optionalUpdateMessage: "Optional update msg",   // a message shown for non-"--mandatory" releases 
           mandatoryUpdateMessage: "Reinicie la aplicación para mostrar la último versión", // a message shown for "--mandatory" releases
           optionalIgnoreButtonLabel: "Más tarde", // if a user wants to continue their session, the update will be installed on next resume
           mandatoryContinueButtonLabel: "Reiniciar", // On Android we can kill and restart the app, but on iOS that's not possible so the user has to manually restart it. That's why we provide a different label in this example.
           appendReleaseDescription: false // appends the description you (optionally) provided when releasing a new version to AppSync
           }
          },function (syncStatus, updateLabel) {
            if (syncStatus === SyncStatus.UP_TO_DATE) {
              console.log('UP_TO_DATE');
              vm.SetEstatus(false);
              alert({
                title: "Info",
                message: "La aplicación está actualizada",
                okButtonText: "Ok",
                cancelable: false
              }).then(result => {
                vm.$modal.close();
              });
              //console.log("AppSync: no pending updates; you're running the latest version, which is: " , updateLabel);
              } 
                else if (syncStatus === SyncStatus.CHECKING_FOR_UPDATE) {
                  vm.SetEstatusText('Buscando actualizaciones');
                  console.log('CHECKING_FOR_UPDATE');
                //console.log("AppSync: update (" + updateLabel + ") installed - it will be activated upon next cold boot");
                }
                else if (syncStatus === SyncStatus.DOWNLOADING_PACKAGE) {
                  console.log('DOWNLOADING_PACKAGE');
                  vm.SetEstatusText('Descargando actualizaciones');
                //console.log("AppSync: update (" + updateLabel + ") installed - it will be activated upon next cold boot");
                }
                else if (syncStatus === SyncStatus.UPDATE_INSTALLED) {
                console.log('UPDATE_INSTALLED');
                vm.SetEstatus(true);
                vm.SetEstatusText('Actualizaciones instaladas');
                vm.$modal.close();
                //console.log("AppSync: update (" + updateLabel + ") installed - it will be activated upon next cold boot");
                }
          });
  },
  methods: {
    ...mapActions({
      SetEstatus: "appSyncU/setSyncEstatus",
      SetEstatusText: "appSyncU/setSyncEstatusText"
    }),
  }
};
</script>


