<template>
  <div class="panel-container">
    <welcome :exampleName="exampleName" :statusMessage="statusMessage" :logoData="logoData" />
    <clicks />
  </div>
</template>

<script>
  import { vue } from '../../_shared/logos'
  import clicks from '../../_shared/vue/Clicks.vue'
  import welcome from '../../_shared/vue/Welcome.vue'

  export default {
    name: 'app',
    data: () => ({
      exampleName: 'vue-cssextract',
      logoData: vue,
      statusMessage: '',
    }),
    components: {
      Clicks: clicks,
      Welcome: welcome,
    },
    async mounted() {
      await import(/* webpackChunkName: "greener" */ '../../_shared/make.it.green').then(greener => greener.makeItGreen())
      this.statusMessage = 'good to go!'
    }
  }
</script>
