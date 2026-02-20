<template>
  <div class="user-profile">
    <div class="header">
      <h1>👤 My Profile</h1>
      <button @click="goBack" class="back-btn">← Back to Portal</button>
    </div>

    <div v-if="userStore.isAuthenticated" class="profile-content">
      <div class="profile-card">
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
        <button @click="handleLogout" class="logout-btn">Logout</button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🎮</div>
          <div class="stat-content">
            <h3>Games Played</h3>
            <p class="stat-number">{{ userStore.gamesCompleted }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <h3>Books Read</h3>
            <p class="stat-number">{{ userStore.booksRead }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎨</div>
          <div class="stat-content">
            <h3>Activities Done</h3>
            <p class="stat-number">{{ userStore.activitiesCompleted }}</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Favorite Games</h3>
        <div v-if="userStore.progress.favoriteGames.length === 0" class="no-items">
          <p>No favorite games yet</p>
        </div>
        <div v-else class="items-list">
          <div
            v-for="gameId in userStore.progress.favoriteGames"
            :key="gameId"
            class="item"
          >
            <span>🎮 {{ gameId }}</span>
            <button @click="removeGameFavorite(gameId)" class="remove-btn">
              Remove
            </button>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Favorite Books</h3>
        <div v-if="userStore.progress.favoriteBooks.length === 0" class="no-items">
          <p>No favorite books yet</p>
        </div>
        <div v-else class="items-list">
          <div
            v-for="bookId in userStore.progress.favoriteBooks"
            :key="bookId"
            class="item"
          >
            <span>📚 {{ bookId }}</span>
            <button @click="removeBookFavorite(bookId)" class="remove-btn">
              Remove
            </button>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Bookmarks</h3>
        <div v-if="userStore.progress.bookmarks.length === 0" class="no-items">
          <p>No bookmarks yet</p>
        </div>
        <div v-else class="items-list">
          <div
            v-for="itemId in userStore.progress.bookmarks"
            :key="itemId"
            class="item"
          >
            <span>🔖 {{ itemId }}</span>
            <button @click="removeBookmark(itemId)" class="remove-btn">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="not-authenticated">
      <p>Please log in to view your profile</p>
      <button @click="handleLogin" class="login-btn">Login</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

const goBack = () => {
  router.push('/')
}

const handleLogin = () => {
  // Mock login - in real app, this would be actual authentication
  userStore.login('user123', 'Alex', '/avatars/alex.png', 8)
}

const handleLogout = () => {
  userStore.logout()
  router.push('/')
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
.user-profile {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.header {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0;
  font-size: 2em;
}

.back-btn {
  padding: 8px 16px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.back-btn:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

.profile-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.profile-card {
  background: white;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}

.user-info {
  flex: 1;
}

.user-info h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.age {
  margin: 5px 0 0 0;
  font-size: 14px;
  color: #999;
}

.logout-btn {
  padding: 10px 20px;
  background: #d32f2f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.logout-btn:hover {
  opacity: 0.9;
  transform: scale(1.02);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content h3 {
  margin: 0;
  font-size: 12px;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
}

.stat-number {
  margin: 5px 0 0 0;
  font-size: 28px;
  font-weight: 700;
  color: #667eea;
}

.section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #333;
}

.no-items {
  text-align: center;
  padding: 20px;
  color: #999;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
}

.remove-btn {
  padding: 6px 12px;
  background: #d32f2f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s;
}

.remove-btn:hover {
  opacity: 0.9;
  transform: scale(1.02);
}

.not-authenticated {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  color: #666;
  font-size: 18px;
}

.login-btn {
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s;
}

.login-btn:hover {
  opacity: 0.9;
  transform: scale(1.05);
}
</style>
