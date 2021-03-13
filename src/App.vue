<template>
  <v-app>

    <v-main>
      <v-container  fill-height class="justify-center">
        
        <tool-bar v-if="animateApp"></tool-bar>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// import {enviroment as enviroment} from  "@/libs/eval-script-handler.js"
import ToolBar from "@/components/ToolBar"
const enviroment = JSON.parse(window.__adobe_cep__.getHostEnvironment())

export default {
  name: 'App',

  components: {
    ToolBar
  },

  computed: {
    animateApp() {
      return this.hostId === 'FLPR'
    }
  },
  data: () => ({
    hostId: enviroment.appName,
    hostName: enviroment.appName
  }),
};
</script>
