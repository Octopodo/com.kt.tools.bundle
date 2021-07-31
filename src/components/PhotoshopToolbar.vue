<template>
  <div>
    <v-btn @click.prevent="ktImport()">Import</v-btn>
    <v-btn @click.prevent="swap()">Swap Left-Right</v-btn>
  </div>
</template>

<script>
  import evalScript from "@/libs/eval-script-handler.js"
  export default {
    
    methods: {
      ktImport() {
        let command = 'alert("ñlpl")';//'KT.Commands.BuildCharacter();';
        let result = evalScript(command);
        return result
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>