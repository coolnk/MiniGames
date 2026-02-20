<template>
  <div class="game-player">
    <!-- Iframe is always rendered -->
    <iframe
      ref="gameIframe"
      class="game-iframe"
      :title="`${game.title} game`"
      sandbox="allow-scripts allow-same-origin"
    ></iframe>

    <!-- Overlays -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading game...</p>
    </div>

    <div v-if="error" class="error-state">
      <p>⚠️ Error loading game</p>
      <p class="error-message">{{ error }}</p>
      <button @click="handleRetry" class="retry-btn">Retry</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import { useGameLoader } from '@/composables/useGameLoader'
import { type GameInfo } from '@/utils/gameLoader'

interface Props {
  game: GameInfo
}

const props = defineProps<Props>()
const emit = defineEmits<{
  complete: [score: number]
}>()

const gameIframe = ref<HTMLIFrameElement | null>(null)
const { loading, error, loadGame, retry: retryLoad } = useGameLoader(props.game)

const handleLoadGame = async () => {
  await nextTick()
  if (!gameIframe.value) {
    throw new Error('Game iframe not found - ref not bound')
  }
  await loadGame(gameIframe.value)
}

const handleRetry = async () => {
  if (!gameIframe.value) {
    throw new Error('Game iframe not found - ref not bound')
  }
  await retryLoad(gameIframe.value)
}

onMounted(() => {
  handleLoadGame()
})

onBeforeUnmount(() => {
  console.log(`Cleaning up game: ${props.game.id}`)
})
</script>

<style scoped>
.game-player {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #f5f5f5;
  position: relative;
  width: 100%;
  height: 100%;
}

.game-iframe {
  width: 100%;
  height: 100%;
  border: none;
  position: absolute;
  top: 0;
  left: 0;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  color: #666;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  z-index: 10;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e0e0e0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  font-size: 14px;
  color: #999;
  max-width: 300px;
  text-align: center;
}

.retry-btn {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.retry-btn:hover {
  opacity: 0.9;
}
</style>
