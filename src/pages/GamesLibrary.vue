<template>
  <ion-page>
    <!-- Game Selection View -->
    <div v-if="!currentGame">
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button default-href="/"></ion-back-button>
          </ion-buttons>
          <ion-title>🎮 Games</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content :fullscreen="true">
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">🎮 Games Library</ion-title>
          </ion-toolbar>
        </ion-header>

        <div class="ion-padding">
          <!-- Loading -->
          <ion-card v-if="loading">
            <ion-card-content class="ion-text-center">
              <ion-spinner color="primary"></ion-spinner>
              <p class="ion-margin-top">Loading games...</p>
            </ion-card-content>
          </ion-card>

          <!-- Error -->
          <ion-card v-else-if="error" color="danger">
            <ion-card-content>
              <p>⚠️ {{ error }}</p>
              <ion-button expand="block" @click="loadGames">Retry</ion-button>
            </ion-card-content>
          </ion-card>

          <!-- Games Grid -->
          <ion-grid v-else>
            <ion-row>
              <ion-col sizeLg="4" sizeMd="6" size="12" v-for="game in games" :key="game.id">
                <ion-card button @click="selectGame(game)" class="game-card">
                  <ion-card-header>
                    <ion-card-title>{{ game.title }}</ion-card-title>
                  </ion-card-header>
                  <ion-card-content>
                    <p>{{ game.description }}</p>
                    <ion-text color="medium">
                      <p class="ion-text-sm">{{ game.bundleSize }}</p>
                    </ion-text>
                  </ion-card-content>
                  <div class="favorite-overlay">
                    <ion-button
                      fill="clear"
                      size="large"
                      @click.stop="toggleFavorite(game.id)"
                      :color="userStore.isGameFavorited(game.id) ? 'warning' : 'medium'"
                    >
                      <ion-icon :name="userStore.isGameFavorited(game.id) ? 'star' : 'star-outline'" slot="icon-only"></ion-icon>
                    </ion-button>
                  </div>
                </ion-card>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
      </ion-content>
    </div>

    <!-- Game Player View -->
    <div v-else>
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button @click="closeGame" text="Back"></ion-back-button>
          </ion-buttons>
          <ion-title>{{ currentGame.title }}</ion-title>
          <ion-buttons slot="end">
            <ion-button
              @click="toggleGameFavorite(currentGame.id)"
              :color="userStore.isGameFavorited(currentGame.id) ? 'warning' : 'medium'"
            >
              <ion-icon :name="userStore.isGameFavorited(currentGame.id) ? 'star' : 'star-outline'" slot="icon-only"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content>
        <GamePlayer :game="currentGame" @complete="onGameComplete" />
      </ion-content>
    </div>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GamePlayer from '@/components/GamePlayer.vue'
import { useGameManifest } from '@/composables/useGameManifest'
import { useUserStore } from '@/stores/userStore'
import { type GameInfo } from '@/utils/gameLoader'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonSpinner
} from '@ionic/vue'
import { star, starOutline } from 'ionicons/icons'

const userStore = useUserStore()
const { games, loading, error, loadGames } = useGameManifest()

const currentGame = ref<GameInfo | null>(null)

const selectGame = (game: GameInfo) => {
  console.log('▶️ Starting game:', game.id)
  currentGame.value = game
}

const closeGame = () => {
  console.log('◀️ Back to games library')
  currentGame.value = null
}

const toggleFavorite = (gameId: string) => {
  userStore.toggleGameFavorite(gameId)
}

const toggleGameFavorite = (gameId: string) => {
  userStore.toggleGameFavorite(gameId)
}

const onGameComplete = (score: number) => {
  if (currentGame.value) {
    userStore.completeGame(currentGame.value.id, score)
  }
}

onMounted(() => {
  console.log('🎮 Games Library mounted')
  loadGames()
})
</script>

<style scoped>
.game-card {
  position: relative;
  height: 100%;
}

.favorite-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
}

ion-card-title {
  font-size: 16px;
}

ion-card-content p {
  margin: 8px 0 4px 0;
}
</style>

<style scoped>
.games-library {
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
  justify-content: flex-start;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow-y: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 30px;
}

.game-menu h1 {
  font-size: 2.5em;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin: 0;
}

.back-btn {
  padding: 8px 16px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
}

.back-btn:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  color: white;
  margin-top: 40px;
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
  margin-top: 40px;
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
  max-width: 1000px;
}

.game-card {
  aspect-ratio: 1;
  padding: 15px;
  background: white;
  border-radius: 12px;
  color: #333;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

.game-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

.game-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 100%;
}

.game-title {
  display: block;
  font-weight: 700;
  font-size: 14px;
  text-align: center;
}

.game-desc {
  display: block;
  font-size: 11px;
  color: #666;
  line-height: 1.2;
  flex: 1;
  text-align: center;
}

.game-size {
  font-size: 10px;
  color: #999;
  display: block;
}

.favorite-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  transition: all 0.2s;
}

.favorite-btn:hover {
  transform: scale(1.2);
}

.favorite-btn.active {
  animation: starPulse 0.3s ease;
}

@keyframes starPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
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

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.favorite-btn-large {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.favorite-btn-large:hover {
  background: rgba(255, 255, 255, 0.3);
}

.favorite-btn-large.active {
  background: white;
  color: #667eea;
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
