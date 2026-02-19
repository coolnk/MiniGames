<template>
  <div class="app-container">
    <div v-if="!currentGame" class="game-menu">
      <h1>MiniGames</h1>
      <div class="game-grid">
        <button
          v-for="game in games"
          :key="game.id"
          @click="selectGame(game)"
          class="game-button"
        >
          {{ game.name }}
        </button>
      </div>
    </div>
    <div v-else class="game-wrapper">
      <div class="game-header">
        <h2>{{ currentGame.name }}</h2>
        <button @click="closeGame" class="close-btn">Back</button>
      </div>
      <GameContainer :game="currentGame" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GameContainer from './components/GameContainer.vue'

interface Game {
  id: string
  name: string
  component: string
}

const games = ref<Game[]>([
  { id: 'bouncy', name: 'Bouncy Ball', component: 'BouncyBall' },
  { id: 'clicker', name: 'Click Counter', component: 'ClickCounter' },
])

const currentGame = ref<Game | null>(null)

const selectGame = (game: Game) => {
  currentGame.value = game
}

const closeGame = () => {
  currentGame.value = null
}
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
}

.game-menu h1 {
  font-size: 2.5em;
  margin-bottom: 40px;
  color: var(--primary);
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  width: 100%;
  max-width: 600px;
}

.game-button {
  aspect-ratio: 1;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.game-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.game-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.game-header {
  padding: 15px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.game-header h2 {
  margin: 0;
  font-size: 1.5em;
  flex: 1;
}

.close-btn {
  padding: 8px 16px;
  font-size: 14px;
}
</style>
