<template>
  <div class="game-player">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading game...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>⚠️ Error loading game</p>
      <p class="error-message">{{ error }}</p>
      <button @click="retry" class="retry-btn">Retry</button>
    </div>

    <iframe
      v-else
      ref="gameIframe"
      class="game-iframe"
      :title="`${game.title} game`"
      sandbox="allow-scripts allow-same-origin"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import { type GameInfo } from '@/utils/gameLoader'

interface Props {
  game: GameInfo
}

const props = defineProps<Props>()

const gameIframe = ref<HTMLIFrameElement | null>(null)
const loading = ref(true)
const error = ref('')

const loadGame = async () => {
  loading.value = true
  error.value = ''

  try {
    console.log(`Loading game: ${props.game.id}`)

    // Wait for iframe ref to be bound to DOM
    await nextTick()

    if (!gameIframe.value) {
      throw new Error('Game iframe not found - ref not bound')
    }

    // Fetch the game bundle
    const response = await fetch(props.game.bundleUrl)
    if (!response.ok) {
      throw new Error(`Failed to load game bundle: ${response.statusText}`)
    }

    const bundleCode = await response.text()
    console.log(`Bundle loaded: ${bundleCode.length} bytes`)

    // Create HTML content for the iframe
    const iframeContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${props.game.title}</title>
        <script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js"><\/script>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { width: 100%; height: 100%; }
          body { overflow: hidden; }
          #game { width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <div id="game"></div>
        <script>
          (function() {
            ${bundleCode}
          })();
        <\/script>
      </body>
      </html>
    `

    // Write content to iframe
    const iframeDoc = gameIframe.value.contentDocument
    if (!iframeDoc) {
      throw new Error('Cannot access iframe document')
    }

    iframeDoc.open()
    iframeDoc.write(iframeContent)
    iframeDoc.close()

    console.log(`✅ Game loaded in iframe: ${props.game.id}`)
    loading.value = false
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error loading game'
    console.error('Error loading game:', err)
    loading.value = false
  }
}

const retry = () => {
  loading.value = true
  error.value = ''
  loadGame()
}

onMounted(() => {
  loadGame()
})

onBeforeUnmount(() => {
  // Cleanup is handled automatically when iframe is removed
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
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  color: #666;
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
