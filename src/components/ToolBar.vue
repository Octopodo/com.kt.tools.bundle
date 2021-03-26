<template>
  <div class="ma-5">
    <v-row no-gutters>
      <v-col class="col-6">
      <v-tooltip bottom open-delay="900" >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            dark
            x-large
            v-bind="attrs"
            v-on="on"
            
            color="orange darken-1"
            @click.prevent="collectAssets()"
          >
            <v-icon size="60">mdi-alien-outline</v-icon>
          </v-btn>
        </template>
        <span>Collect Character</span>
      </v-tooltip>
      </v-col>
      <v-col class="col-6">
        <v-tooltip bottom open-delay="900">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              :color="exportAssets ? 'blue lighten-2' : ''"
              @click.prevent="setExportFootage()"
            >
              <v-icon v-if="exportAssets"> mdi-account-arrow-right </v-icon>
              <v-icon v-else>mdi-account</v-icon>
            </v-btn>
          </template>
          <span>Export Footage</span>
        </v-tooltip>
        <v-tooltip bottom open-delay="400">
          <template v-slot:activator="{ on, attrs }">
            <v-btn    
              icon
              v-bind="attrs"
              v-on="on"
              @click="setExportPath"
              :color="exportPath != '' ? 'blue lighten-2' : 'red'" 
            > 
              <v-icon 
                v-if="exportPath == ''"
              >
                mdi-folder-alert-outline
              </v-icon>
              <v-icon
                v-else
              >
                mdi-folder-outline
              </v-icon>
            </v-btn>
          </template>
          <span>{{exportPath || '...'}}</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <div class="mt-4">
      <div class="caption">Debug</div>

      <v-divider></v-divider>
      
      <v-row>
        <v-tooltip bottom open-delay="900">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              :color="exportAssets ? 'blue lighten-2' : ''"
              @click.prevent="reloadScript()"
            >
              <v-icon >mdi-autorenew</v-icon>
            </v-btn>
          </template>
          <span>Reload script</span>
        </v-tooltip>
        <v-tooltip bottom open-delay="900">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              @click.prevent="exportDebugLog()"
            >
              <v-icon> mdi-export </v-icon>
            </v-btn>
          </template>
          <span>Export debug Log</span>
        </v-tooltip>
        <v-tooltip bottom open-delay="900">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              :color="verboseColors[verboseLevel]"
              @click.prevent="setVerboseLevel()"
            >
              <v-icon> mdi-ladybug </v-icon>
              <div>{{verboseLevel}}</div>
            </v-btn>
          </template>
          <span>Verbose level</span>
        </v-tooltip>
        <v-tooltip bottom open-delay="900">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              :color="verboseMode ? 'blue lighten-2': ''"
              @click.prevent="setVerboseMode()"
            >
              <v-icon> mdi-alpha-v-box </v-icon>
            </v-btn>
          </template>
          <span>Verbose Mode</span>
        </v-tooltip>
      </v-row>
    </div>
    
    <!-- <div class="caption grey--text text--lighten-1 mt-2">
      {{exportPath || '...'}}
    </div> -->
  </div>
</template>

<script>
import evalScript from  "@/libs/eval-script-handler.js"
  export default {
    data() {
      return {
        verboseMode: false,
        exportAssets: false,
        exportPath: '',
        verboseLevel: 0,
        verboseColors: [
          '',
          'light-green darken-3',
          'blue lighten-2',
          'deep-orange darken-1',

        ]
      }
    },
    async mounted() {

    },
    methods: {
      async collectAssets(){
        let command = 'KT.execute()'
        await evalScript(command);
      },

      async reloadScript(){
        let path = evalScript.getAnimatePath();
        await evalScript(`KT.System.setRootPath('${path}')`);
        let command = 'KT.System.reload()';
        evalScript(command)
      },

      exportDebugLog() {
        let command ='KT.Debugger.exportDebugLog()'
        evalScript(command)
      },

      setVerboseMode() {
        this.verboseMode = !this.verboseMode
        let command = `KT.Debugger.setVerboseMode(${this.verboseMode})`
        evalScript(command)
      },
      setVerboseLevel() {
        this.verboseLevel = this.verboseLevel + 1 >= 4 ? 0 : this.verboseLevel + 1;

        // this.verboseMode = !this.verboseMode;
        let command = `KT.Debugger.setVerboseLevel(${this.verboseLevel})`
        evalScript(command)
      },
      setExportFootage() {
        this.exportAssets = !this.exportAssets;
        let command = `KT.Renderer.setExportFootage(${this.exportAssets})`
        evalScript(command)
      },
      async setExportPath(){
        let command = 'KT.Renderer.setExportPath()'
        let res = await evalScript(command);
        alert(res)
        this.exportPath = res != 'null' ? res : 'Export Path: -'
      }
    }
  }
</script>

<style lang="sass" scoped>

</style>