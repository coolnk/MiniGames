<template>
  <div class="portal-home">
    <div class="header">
      <h1>🎓 Kids Portal</h1>
      <div class="user-section">
        <span v-if="userStore.isAuthenticated" class="user-greeting">
          Welcome, {{ userStore.userName }}! 👋
        </span>
        <button @click="navigateToProfile" class="profile-btn">
          {{ userStore.isAuthenticated ? '👤 Profile' : '🔐 Login' }}
        </button>
      </div>
    </div>

    <div class="portal-content">
      <div class="cards-grid">
        <!-- Games Library Card -->
        <div class="portal-card games-card" @click="navigateTo('games')">
          <div class="card-icon">🎮</div>
          <div class="card-content">
            <h2>Games Library</h2>
            <p>Play fun and educational games</p>
            <div class="card-stats">
              <span>{{ userStore.gamesCompleted }} played</span>
            </div>
          </div>
          <div class="card-arrow">→</div>
        </div>

        <!-- Books Library Card -->
        <div class="portal-card books-card" @click="navigateTo('books')">
          <div class="card-icon">📚</div>
          <div class="card-content">
            <h2>Books Library</h2>
            <p>Read interesting stories and books</p>
            <div class="card-stats">
              <span>{{ userStore.booksRead }} read</span>
            </div>
          </div>
          <div class="card-arrow">→</div>
        </div>

        <!-- Activities Card -->
        <div class="portal-card activities-card" @click="navigateTo('activities')">
          <div class="card-icon">🎨</div>
          <div class="card-content">
            <h2>Activities</h2>
            <p>Engage in creative and learning activities</p>
            <div class="card-stats">
              <span>{{ userStore.activitiesCompleted }} done</span>
            </div>
          </div>
          <div class="card-arrow">→</div>
        </div>
      </div>

      <!-- Quick Stats Section -->
      <div v-if="userStore.isAuthenticated" class="stats-section">
        <h3>📊 Your Progress</h3>
        <div class="stats-bars">
          <div class="stat-bar">
            <div class="stat-label">Games Played</div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: gameProgress + '%' }"></div>
            </div>
            <div class="stat-value">{{ userStore.gamesCompleted }} / {{ totalGames }}</div>
          </div>
          <div class="stat-bar">
            <div class="stat-label">Books Read</div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: bookProgress + '%' }"></div>
            </div>
            <div class="stat-value">{{ userStore.booksRead }} / {{ totalBooks }}</div>
          </div>
          <div class="stat-bar">
            <div class="stat-label">Activities Done</div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: activityProgress + '%' }"></div>
            </div>
            <div class="stat-value">{{ userStore.activitiesCompleted }} / {{ totalActivities }}</div>
          </div>
        </div>
      </div>

      <!-- Browse Tips -->
      <div class="tips-section">
        <h3>💡 Tips for Learning</h3>
        <ul class="tips-list">
          <li>Explore different categories to find what you enjoy</li>
          <li>Mark your favorites for quick access</li>
          <li>Complete activities to earn badges and progress</li>
          <li>Challenge yourself with games suited to your age</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const userStore = useUserStore()

// Calculate progress percentages
const totalGames = 15 // TODO: Get from store
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
.portal-home {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header {
  padding: 30px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0;
  font-size: 2.5em;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.user-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-greeting {
  font-size: 14px;
  opacity: 0.9;
}

.profile-btn {
  padding: 10px 20px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.profile-btn:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

.portal-content {
  flex: 1;
  overflow-y: auto;
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.portal-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 20px;
  color: #333;
  position: relative;
}

.portal-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.card-icon {
  font-size: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
  height: 100px;
  background: #f5f5f5;
  border-radius: 8px;
}

.card-content {
  flex: 1;
}

.card-content h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.card-content p {
  margin: 8px 0 12px 0;
  color: #666;
  font-size: 14px;
}

.card-stats {
  display: flex;
  gap: 15px;
}

.card-stats span {
  font-size: 12px;
  color: #999;
  font-weight: 600;
}

.card-arrow {
  font-size: 32px;
  color: #667eea;
}

.games-card {
  border-left: 4px solid #ff9800;
}

.books-card {
  border-left: 4px solid #2196f3;
}

.activities-card {
  border-left: 4px solid #4caf50;
}

.stats-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
}

.stats-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
}

.stats-bars {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-bar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
  font-weight: 600;
}

.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #45a049);
  transition: width 0.5s ease;
}

.stat-value {
  font-size: 12px;
  opacity: 0.8;
}

.tips-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 25px;
  backdrop-filter: blur(10px);
}

.tips-section h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
}

.tips-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tips-list li {
  padding-left: 25px;
  position: relative;
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.5;
}

.tips-list li:before {
  content: '✓';
  position: absolute;
  left: 0;
  font-weight: bold;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .header h1 {
    font-size: 1.8em;
  }

  .user-section {
    justify-content: center;
    width: 100%;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .portal-card {
    flex-direction: column;
    text-align: center;
  }

  .card-icon {
    min-width: auto;
  }

  .card-arrow {
    display: none;
  }
}
</style>
