<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>👤 Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- Authenticated User -->
      <div v-if="userStore.isAuthenticated">
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">👤 My Profile</ion-title>
          </ion-toolbar>
        </ion-header>

        <div class="ion-padding">
          <!-- Profile Card -->
          <ion-card class="profile-card">
            <ion-card-header>
              <div class="profile-header">
                <img
                  v-if="userStore.userAvatar"
                  :src="userStore.userAvatar"
                  :alt="userStore.userName"
                  class="avatar"
                />
                <div v-else class="avatar-placeholder">👤</div>
                <div class="user-info">
                  <h2>{{ userStore.userName }}</h2>
                  <p class="age">Age {{ userStore.userAge }}</p>
                </div>
              </div>
            </ion-card-header>
            <ion-card-content>
              <ion-button
                expand="block"
                color="danger"
                @click="handleLogout"
                class="logout-btn"
              >
                <ion-icon name="log-out" slot="start"></ion-icon>
                Logout
              </ion-button>
            </ion-card-content>
          </ion-card>

          <!-- Stats Grid -->
          <ion-grid class="stats-grid">
            <ion-row>
              <ion-col sizeLg="4" sizeMd="6" size="12">
                <ion-card text-center>
                  <ion-card-content>
                    <div class="stat-icon">🎮</div>
                    <ion-text color="medium">
                      <p class="ion-text-sm">Games Played</p>
                    </ion-text>
                    <h3 class="stat-number">{{ userStore.gamesCompleted }}</h3>
                  </ion-card-content>
                </ion-card>
              </ion-col>
              <ion-col sizeLg="4" sizeMd="6" size="12">
                <ion-card text-center>
                  <ion-card-content>
                    <div class="stat-icon">📚</div>
                    <ion-text color="medium">
                      <p class="ion-text-sm">Books Read</p>
                    </ion-text>
                    <h3 class="stat-number">{{ userStore.booksRead }}</h3>
                  </ion-card-content>
                </ion-card>
              </ion-col>
              <ion-col sizeLg="4" sizeMd="6" size="12">
                <ion-card text-center>
                  <ion-card-content>
                    <div class="stat-icon">🎨</div>
                    <ion-text color="medium">
                      <p class="ion-text-sm">Activities Done</p>
                    </ion-text>
                    <h3 class="stat-number">{{ userStore.activitiesCompleted }}</h3>
                  </ion-card-content>
                </ion-card>
              </ion-col>
            </ion-row>
          </ion-grid>

          <!-- Favorite Games Section -->
          <ion-card>
            <ion-card-header>
              <ion-card-title>🎮 Favorite Games</ion-card-title>
            </ion-card-header>
            <ion-card-content v-if="userStore.progress.favoriteGames.length === 0">
              <p class="ion-text-center">No favorite games yet</p>
            </ion-card-content>
            <div v-else>
              <ion-item
                v-for="gameId in userStore.progress.favoriteGames"
                :key="gameId"
                lines="inset"
              >
                <ion-label>{{ gameId }}</ion-label>
                <ion-button
                  slot="end"
                  fill="clear"
                  color="danger"
                  @click="removeGameFavorite(gameId)"
                >
                  <ion-icon name="trash" slot="icon-only"></ion-icon>
                </ion-button>
              </ion-item>
            </div>
          </ion-card>

          <!-- Favorite Books Section -->
          <ion-card>
            <ion-card-header>
              <ion-card-title>📚 Favorite Books</ion-card-title>
            </ion-card-header>
            <ion-card-content v-if="userStore.progress.favoriteBooks.length === 0">
              <p class="ion-text-center">No favorite books yet</p>
            </ion-card-content>
            <div v-else>
              <ion-item
                v-for="bookId in userStore.progress.favoriteBooks"
                :key="bookId"
                lines="inset"
              >
                <ion-label>{{ bookId }}</ion-label>
                <ion-button
                  slot="end"
                  fill="clear"
                  color="danger"
                  @click="removeBookFavorite(bookId)"
                >
                  <ion-icon name="trash" slot="icon-only"></ion-icon>
                </ion-button>
              </ion-item>
            </div>
          </ion-card>

          <!-- Bookmarks Section -->
          <ion-card class="ion-margin-bottom">
            <ion-card-header>
              <ion-card-title>🔖 Bookmarks</ion-card-title>
            </ion-card-header>
            <ion-card-content v-if="userStore.progress.bookmarks.length === 0">
              <p class="ion-text-center">No bookmarks yet</p>
            </ion-card-content>
            <div v-else>
              <ion-item
                v-for="itemId in userStore.progress.bookmarks"
                :key="itemId"
                lines="inset"
              >
                <ion-label>{{ itemId }}</ion-label>
                <ion-button
                  slot="end"
                  fill="clear"
                  color="danger"
                  @click="removeBookmark(itemId)"
                >
                  <ion-icon name="trash" slot="icon-only"></ion-icon>
                </ion-button>
              </ion-item>
            </div>
          </ion-card>
        </div>
      </div>

      <!-- Not Authenticated -->
      <div v-else>
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">👤 My Profile</ion-title>
          </ion-toolbar>
        </ion-header>

        <div class="ion-padding ion-text-center">
          <ion-card>
            <ion-card-content class="ion-padding-lg">
              <h2 class="ion-margin-bottom">Please log in</h2>
              <p class="ion-margin-bottom">To view your profile and track your progress</p>
              <ion-button
                expand="block"
                size="large"
                @click="handleLogin"
              >
                <ion-icon name="log-in" slot="start"></ion-icon>
                Login
              </ion-button>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
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
  IonItem,
  IonLabel
} from '@ionic/vue'
import { logOut, logIn, trash } from 'ionicons/icons'

const userStore = useUserStore()

const handleLogin = () => {
  // Mock login - in real app, this would be actual authentication
  userStore.login('user123', 'Alex', '/avatars/alex.png', 8)
}

const handleLogout = () => {
  userStore.logout()
}

const removeGameFavorite = (gameId: string) => {
  userStore.toggleGameFavorite(gameId)
}

const removeBookFavorite = (bookId: string) => {
  userStore.toggleBookFavorite(bookId)
}

const removeBookmark = (itemId: string) => {
  userStore.toggleBookmark(itemId)
}
</script>

<style scoped>
.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
}

.user-info {
  flex: 1;
}

.user-info h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.age {
  margin: 5px 0 0 0;
  font-size: 14px;
  color: #999;
}

.logout-btn {
  margin-top: 12px;
}

.stats-grid {
  margin-bottom: 20px;
}

.stat-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.stat-number {
  margin: 8px 0 0 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--ion-color-primary);
}

ion-card {
  margin-bottom: 16px;
}
</style>

