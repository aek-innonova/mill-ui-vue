<template>
  <div class="flex flex-col justify-between h-full">
    <div class="flex flex-col m-4 gap-4">
      <template v-for="axis of millService.status.axes" :key="axis.name">
        <AxisItem :axis="axis" />
      </template>
    </div>
    <div class="flex gap-8 ml-12 mb-12">
      <button @click="reload">Reload</button>
      <button @click="shutdown">Shutdown</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import AxisItem from '../components/AxisItem.vue'
import { millService } from '../global'

const reload = () => {
  window.location.reload()
}

const shutdown = async () => {
  millService.shutdown()
}
</script>
