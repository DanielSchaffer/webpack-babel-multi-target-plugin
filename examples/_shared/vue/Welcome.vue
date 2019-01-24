<template>
  <div class="panel">
    <h2 id="welcome">
      Welcome to {{ exampleName }}!
      <img id="logo" alt="Vue logo" :src="'data:image/svg+xml;base64,' + logoData" />
    </h2>

    <div id="status">
      <label>Status:</label>
      <span class="message">{{ statusMessage }}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'welcome',
    props: {
      exampleName: String,
      logoData: String,
      statusMessage: String,
    },
  }
</script>
