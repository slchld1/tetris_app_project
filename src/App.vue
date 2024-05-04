<template>
    <v-app>
      <tetris/>
      <gamebar />
    </v-app>
  </template>
  
  <script>
//   import Tetris from '@/components/Tetris/Tetris.vue'
//   import Gamebar from '@/components/Gamebar/Gamebar.vue'
  
  export default {
    name: 'app',
    components: {
      Tetris,
      Gamebar
    }
  }
  </script>