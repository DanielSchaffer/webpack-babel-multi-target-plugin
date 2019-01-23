<template>
  <div id="clicks" class="panel">
    <h3>Clicks</h3>
    <div v-if="!clicks.length">
      No clicks yet.
    </div>
    <div v-for="click in clicks" class="click">
      {{click.ts}}: {{click.tagName}}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'clicks',
    data: () => ({
      clicks: [],
    }),
    mounted() {
      /** @type {HTMLElement} **/
      const el = this.$el
      el.ownerDocument.body.addEventListener('click', this.onClick)
    },
    beforeDestroy() {
      /** @type {HTMLElement} **/
      const el = this.$el
      el.ownerDocument.body.removeEventListener('click', this.onClick)
    },
    methods: {
      onClick(e) {
        this.clicks.push({
          ts: new Date().valueOf(),
          tagName: e.target.tagName,
        })
      },
    },
  }
</script>
