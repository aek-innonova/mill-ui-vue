<template>
  <div class="flex text-6xl items-center">
    <div class="w-10 font-lcd">{{ props.axis.name?.toUpperCase() }}</div>
    <div class="font-lcd text-right w-54">
      {{ formatLinearPos(props.axis.stepperLinearPos - zeroPos) }}
    </div>
    <button class="ml-4 font-lcd" @click="zero">0</button>
    <button class="ml-4 font-mono" @click="half">½</button>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { AxisStatus } from '../services/mill-service'

const props = defineProps<{
  axis: AxisStatus
}>()

const zeroPos = ref(0)

const zero = () => {
  zeroPos.value = props.axis.stepperLinearPos
}
const half = () => {
  zeroPos.value += (props.axis.stepperLinearPos - zeroPos.value) / 2
}

const triCif = (value: number) => {
  if (value >= 100) {
    return `${value}`
  }
  if (value >= 10) {
    return `0${value}`
  }
  if (value > 0) {
    return `00${value}`
  }
  return `000`
}

const formatLinearPos = (value: number) => {
  const mm = value * 0.005
  const whole = Math.floor(mm)
  const fraction = Math.round((mm - whole) * 1000)

  return `${whole}.${triCif(fraction)}`
}
</script>
