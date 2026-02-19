<template>
  <div class="app-container">
    <div v-if="!currentGame" class="game-menu">
      <h1>🎮 MiniGames</h1>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading games...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>⚠️ {{ error }}</p>
        <button @click="loadGames" class="retry-btn">Retry</button>
      </div>

      <div v-else class="game-grid">
        <button
          v-for="game in games"
          :key="game.id"
          @click="selectGame(game)"
          class="game-button"
        >
          <span class="game-title">{{ game.title }}</span>
          <span class="game-desc">{{ game.description }}</span>
          <span class="game-size">{{ game.bundleSize }}</span>
        </button>
      </div>
    </div>

    <div v-else class="game-wrapper">
      <div class="game-header">
        <h2>{{ currentGame.title }}</h2>
        <button @click="closeGame" class="close-btn">← Back</button>
      </div>
      <GamePlayer :game="currentGame" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GamePlayer from './components/GamePlayer.vue'
import { fetchGameManifest, type GameInfo } from './utils/gameLoader'

const games = ref<GameInfo[]>([])
const currentGame = ref<GameInfo | null>(null)
const loading = ref(false)
const error = ref('')

const loadGames = async () => {
  loading.value = true
  error.value = ''

  try {
    console.log('🔄 Loading games...')
    const manifest = await fetchGameManifest()
    console.log('✅ Manifest loaded:', manifest)
    games.value = manifest.games
    console.log('✅ Games ready:', games.value.length)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load games'
    console.error('❌ Error:', err)
  } finally {
    loading.value = false
  }
}

const selectGame = (game: GameInfo) => {
  console.log('▶️ Starting game:', game.id)
  currentGame.value = game
}

const closeGame = () => {
  console.log('◀️ Back to menu')
  currentGame.value = null
}

onMounted(() => {
  console.log('📱 App mounted')
  loadGames()
})
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.game-menu {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.game-menu h1 {
  font-size: 2.5em;
  margin-bottom: 40px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error {
  text-align: center;
  color: white;
  padding: 20px;
  background: rgba(255, 0, 0, 0.3);
  border-radius: 8px;
  max-width: 400px;
}

.retry-btn {
  margin-top: 15px;
  padding: 10px 20px;
  background: white;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  border: none;
  border-radius: 4px;
}

.retry-btn:hover {
  opacity: 0.9;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 15px;
  width: 100%;
  max-width: 900px;
}

.game-button {
  aspect-ratio: 1;
  padding: 15px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  background: white;
  color: #333;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.game-button:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

.game-button:active {
  transform: translateY(-2px);
}

.game-title {
  display: block;
  font-weight: 700;
  font-size: 14px;
}

.game-desc {
  display: block;
  font-size: 11px;
  color: #666;
  line-height: 1.2;
  flex: 1;
}

.game-size {
  font-size: 10px;
  color: #999;
  display: block;
}

.game-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.game-header {
  padding: 15px 20px;
  border-bottom: 2px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.game-header h2 {
  margin: 0;
  font-size: 1.5em;
  flex: 1;
}

.close-btn {
  padding: 8px 16px;
  font-size: 14px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.close-btn:hover {
  opacity: 0.9;
  transform: scale(1.05);
}
</style>
