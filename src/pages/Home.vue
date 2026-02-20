<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>🎓 Kids Portal</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="navigateToProfile">
            <ion-icon v-if="userStore.isAuthenticated" slot="icon-only" name="person-circle"></ion-icon>
            <ion-icon v-else slot="icon-only" name="lock-closed"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">🎓 Kids Portal</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="ion-padding">
        <!-- Welcome Message -->
        <div v-if="userStore.isAuthenticated" class="ion-text-center ion-margin-bottom">
          <h2>Welcome, {{ userStore.userName }}! 👋</h2>
          <p class="ion-text-medium ion-color-medium">Keep learning and have fun!</p>
        </div>

        <!-- Portal Cards Grid -->
        <ion-grid>
          <!-- Games Card -->
          <ion-row class="ion-margin-bottom">
            <ion-col sizeLg="4" sizeMd="6" size="12">
              <ion-card button @click="navigateTo('games')" class="portal-card">
                <ion-card-header>
                  <div class="card-icon">🎮</div>
                </ion-card-header>
                <ion-card-content>
                  <h2>Games Library</h2>
                  <p class="ion-text-medium">Play fun and educational games</p>
                  <ion-text color="primary">
                    <p class="ion-text-center">{{ userStore.gamesCompleted }} played</p>
                  </ion-text>
                </ion-card-content>
              </ion-card>
            </ion-col>

            <!-- Books Card -->
            <ion-col sizeLg="4" sizeMd="6" size="12">
              <ion-card button @click="navigateTo('books')" class="portal-card">
                <ion-card-header>
                  <div class="card-icon">📚</div>
                </ion-card-header>
                <ion-card-content>
                  <h2>Books Library</h2>
                  <p class="ion-text-medium">Read interesting stories and books</p>
                  <ion-text color="primary">
                    <p class="ion-text-center">{{ userStore.booksRead }} read</p>
                  </ion-text>
                </ion-card-content>
              </ion-card>
            </ion-col>

            <!-- Activities Card -->
            <ion-col sizeLg="4" sizeMd="6" size="12">
              <ion-card button @click="navigateTo('activities')" class="portal-card">
                <ion-card-header>
                  <div class="card-icon">🎨</div>
                </ion-card-header>
                <ion-card-content>
                  <h2>Activities</h2>
                  <p class="ion-text-medium">Engage in creative and learning activities</p>
                  <ion-text color="primary">
                    <p class="ion-text-center">{{ userStore.activitiesCompleted }} done</p>
                  </ion-text>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>

        <!-- Progress Section -->
        <div v-if="userStore.isAuthenticated" class="ion-margin-top">
          <h3>📊 Your Progress</h3>
          <ion-card>
            <ion-card-content>
              <ion-item lines="none">
                <ion-label>Games Played</ion-label>
                <ion-badge>{{ userStore.gamesCompleted }} / {{ totalGames }}</ion-badge>
              </ion-item>
              <ion-progress-bar :value="gameProgress / 100"></ion-progress-bar>

              <ion-item lines="none" class="ion-margin-top">
                <ion-label>Books Read</ion-label>
                <ion-badge>{{ userStore.booksRead }} / {{ totalBooks }}</ion-badge>
              </ion-item>
              <ion-progress-bar :value="bookProgress / 100"></ion-progress-bar>

              <ion-item lines="none" class="ion-margin-top">
                <ion-label>Activities Done</ion-label>
                <ion-badge>{{ userStore.activitiesCompleted }} / {{ totalActivities }}</ion-badge>
              </ion-item>
              <ion-progress-bar :value="activityProgress / 100"></ion-progress-bar>
            </ion-card-content>
          </ion-card>
        </div>

        <!-- Tips Section -->
        <div class="ion-margin-top">
          <h3>💡 Learning Tips</h3>
          <ion-card>
            <ion-card-content>
              <ion-list lines="none">
                <ion-item>
                  <ion-label>
                    <p>🎯 Explore different categories to find what you enjoy</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <p>⭐ Mark your favorites for quick access</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <p>🏆 Complete activities to earn badges and progress</p>
                  </ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <p>🎮 Challenge yourself with games suited to your age</p>
                  </ion-label>
                </ion-item>
              </ion-list>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonButtons,
  IonIcon,
  IonText,
  IonBadge,
  IonProgressBar,
  IonItem,
  IonLabel,
  IonList
} from '@ionic/vue'
import { personCircle, lockClosed } from 'ionicons/icons'

const router = useRouter()
const userStore = useUserStore()

// Calculate progress
const totalGames = 15
const totalBooks = 50
const totalActivities = 30

const gameProgress = computed(() => {
  return Math.min((userStore.gamesCompleted / totalGames) * 100, 100)
})

const bookProgress = computed(() => {
  return Math.min((userStore.booksRead / totalBooks) * 100, 100)
})

const activityProgress = computed(() => {
  return Math.min((userStore.activitiesCompleted / totalActivities) * 100, 100)
})

const navigateTo = (section: string) => {
  router.push(`/${section}`)
}

const navigateToProfile = () => {
  router.push('/profile')
}
</script>

<style scoped>
.portal-card {
  margin: 10px 0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-icon {
  font-size: 48px;
  text-align: center;
  padding: 10px;
}

ion-card h2 {
  font-size: 18px;
  margin: 8px 0 4px 0;
}

ion-card p {
  font-size: 14px;
  color: var(--ion-color-medium);
  margin: 4px 0;
}
</style>
