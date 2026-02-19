<template>
  <div class="app-container">
    <div class="game-menu">
      <h1>🎮 MiniGames</h1>
      <p>App is loading...</p>
      <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; margin: 20px; color: white; font-family: monospace;">
        <div>📊 STATE:</div>
        <div>loading: {{ loading }}</div>
        <div>error: {{ error }}</div>
        <div>games count: {{ games.length }}</div>
        <div>&nbsp;</div>
        <button @click="loadGames" style="padding: 10px 20px; background: white; color: #667eea; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">
          Manual Load
        </button>
      </div>

      <div v-if="games.length > 0" style="color: white;">
        <h2>Found {{ games.length }} games:</h2>
        <div v-for="game in games" :key="game.id" style="background: rgba(255,255,255,0.1); padding: 10px; margin: 5px; border-radius: 4px;">
          <strong>{{ game.title }}</strong> - {{ game.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchGameManifest, type GameInfo } from './utils/gameLoader'

const games = ref<GameInfo[]>([])
const loading = ref(false)
const error = ref('')

const loadGames = async () => {
  loading.value = true
  error.value = ''

  try {
    console.log('🔄 Starting to load games...')
    const manifest = await fetchGameManifest()
    console.log('✅ Manifest loaded:', manifest)
    games.value = manifest.games
    console.log('✅ Games set:', games.value.length, 'games')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load games'
    console.error('❌ Error loading games:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  console.log('📱 App mounted, loading games...')
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
  color: white;
  text-align: center;
}

.game-menu h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.game-menu p {
  font-size: 1.2em;
  margin-bottom: 20px;
}
</style>
