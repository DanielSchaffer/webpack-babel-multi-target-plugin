<template>
  <div class="panel-container">
    <welcome :exampleName="exampleName" :statusMessage="statusMessage" :logoData="logoData" />
    <clicks />
  </div>
</template>

<script>
import { GTG } from '../../_shared/constants'
import { vue } from '../../_shared/logos'
import ready from '../../_shared/ready'

export default {
  name: 'app',
  data: () => ({
    exampleName: 'vue-dynamic-import',
    logoData: vue,
    statusMessage: '',
  }),
  components: {
    Clicks: () => import(/* webpackChunkName: "clicks" */ '../../_shared/vue/Clicks.vue'),
    Welcome: () => import(/* webpackChunkName: "welcome" */ '../../_shared/vue/Welcome.vue'),
  },
  async mounted() {
    await import(/* webpackChunkName: "greener" */ '../../_shared/make.it.green').then(greener => greener.makeItGreen())
    this.statusMessage = GTG
    ready()
  }
}
</script>
