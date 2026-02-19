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

    <div v-else ref="gameContainer" class="game-container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { type GameInfo, loadGameBundle } from '@/utils/gameLoader'

interface Props {
  game: GameInfo
}

const props = defineProps<Props>()

const gameContainer = ref<HTMLDivElement | null>(null)
const loading = ref(true)
const error = ref('')
let phaserGame: any = null

const loadGame = async () => {
  if (!gameContainer.value) {
    error.value = 'Game container not found'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''

  try {
    console.log(`Loading game: ${props.game.id}`)

    // Wait for Phaser to be available globally
    if (!(window as any).Phaser) {
      throw new Error('Phaser not loaded. Please check your internet connection.')
    }

    // Clear previous game
    gameContainer.value.innerHTML = ''

    // Load the game bundle
    await loadGameBundle(props.game.bundleUrl, props.game.id)

    // Get the Phaser Scene class from the global registry
    const PhaserGames = (window as any).PhaserGames
    if (!PhaserGames || !PhaserGames[props.game.id]) {
      throw new Error(`Game scene '${props.game.id}' not registered`)
    }

    const SceneClass = PhaserGames[props.game.id]
    const Phaser = (window as any).Phaser

    // Create Phaser game instance
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: gameContainer.value,
      width: gameContainer.value.clientWidth || 800,
      height: gameContainer.value.clientHeight || 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: [SceneClass],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    }

    console.log(`Creating Phaser game instance for ${props.game.id}`)
    phaserGame = new Phaser.Game(config)

    loading.value = false
    console.log(`✅ Game loaded: ${props.game.id}`)
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
  console.log(`Cleaning up game: ${props.game.id}`)
  if (phaserGame) {
    phaserGame.destroy(true)
    phaserGame = null
  }
  if (gameContainer.value) {
    gameContainer.value.innerHTML = ''
  }
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
}

.game-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.game-instance {
  width: 100%;
  height: 100%;
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
