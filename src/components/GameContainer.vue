<template>
  <div class="game-container">
    <component :is="gameComponent" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, computed } from 'vue'

interface Game {
  id: string
  name: string
  component: string
}

interface Props {
  game: Game
}

const props = defineProps<Props>()

const gameComponent = computed(() => {
  return defineAsyncComponent(() =>
    import(`../games/${props.game.component}.vue`)
  )
})
</script>

<style scoped>
.game-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #000;
}
</style>
