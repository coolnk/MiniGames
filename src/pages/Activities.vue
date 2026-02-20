<template>
  <div class="activities-library">
    <div class="header">
      <h1>🎨 Activities</h1>
      <button @click="goBack" class="back-btn">← Back to Portal</button>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading activities...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>⚠️ {{ error }}</p>
      <button @click="loadActivities" class="retry-btn">Retry</button>
    </div>

    <div v-else class="activities-container">
      <div class="filter-section">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search activities..."
          class="search-input"
        />
        <div class="filter-buttons">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="activeCategory = activeCategory === cat ? '' : cat"
            :class="{ active: activeCategory === cat }"
            class="filter-btn"
          >
            {{ cat || 'All' }}
          </button>
        </div>
      </div>

      <div v-if="filteredActivities.length === 0" class="no-activities">
        <p>No activities found</p>
      </div>

      <div v-else class="activities-grid">
        <div
          v-for="activity in filteredActivities"
          :key="activity.id"
          class="activity-card"
        >
          <div class="activity-icon">{{ activity.icon }}</div>
          <div class="activity-info">
            <h3>{{ activity.title }}</h3>
            <p class="category">{{ activity.category }}</p>
            <p class="age-group">Age {{ activity.ageGroup }}+</p>
            <p class="description">{{ activity.description }}</p>
            <div class="activity-actions">
              <button
                v-if="userStore.progress.activitiesCompleted.includes(activity.id)"
                class="complete-badge"
              >
                ✓ Completed
              </button>
              <button
                v-else
                @click="markAsComplete(activity.id)"
                class="complete-btn"
              >
                Start Activity
              </button>
              <button
                @click="toggleBookmark(activity.id)"
                :class="{ active: userStore.isBookmarked(activity.id) }"
                class="bookmark-btn"
              >
                {{ userStore.isBookmarked(activity.id) ? '🔖' : '🔗' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useActivities } from '@/composables/useActivities'
import { useUserStore } from '@/stores/userStore'
import { useLibraryStore } from '@/stores/libraryStore'

const router = useRouter()
const userStore = useUserStore()
const libraryStore = useLibraryStore()
const { activities, categories, loading, error, searchActivities, markAsComplete } = useActivities()

const searchQuery = ref('')
const activeCategory = ref('')

const filteredActivities = computed(() => {
  let filtered = searchQuery.value ? searchActivities(searchQuery.value) : activities.value

  if (activeCategory.value) {
    filtered = filtered.filter(activity => activity.category === activeCategory.value)
  }

  return filtered
})

const toggleBookmark = (itemId: string) => {
  userStore.toggleBookmark(itemId)
}

const goBack = () => {
  router.push('/')
}

const loadActivities = () => {
  libraryStore.loadActivities()
}

onMounted(() => {
  console.log('🎨 Activities mounted')
  loadActivities()
})
</script>

<style scoped>
.activities-library {
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

.loading {
  flex: 1;
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

.error {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  color: #d32f2f;
  margin: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  max-width: 400px;
  align-self: center;
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

.activities-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search-input {
  padding: 10px 15px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
  max-width: 400px;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 8px 16px;
  background: white;
  border: 2px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #667eea;
}

.filter-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.no-activities {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 18px;
}

.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.activity-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  gap: 15px;
  padding: 15px;
}

.activity-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.activity-icon {
  font-size: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  height: 80px;
  background: #f5f5f5;
  border-radius: 8px;
}

.activity-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.activity-info h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
  line-height: 1.2;
}

.category {
  margin: 0;
  font-size: 12px;
  color: #667eea;
  font-weight: 600;
}

.age-group {
  margin: 0;
  font-size: 12px;
  color: #999;
  font-style: italic;
}

.description {
  margin: 5px 0 0 0;
  font-size: 12px;
  color: #666;
  line-height: 1.3;
}

.activity-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.complete-badge {
  flex: 1;
  padding: 8px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: default;
  font-weight: 600;
  font-size: 12px;
}

.complete-btn {
  flex: 1;
  padding: 8px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 12px;
  transition: all 0.2s;
}

.complete-btn:hover {
  opacity: 0.9;
  transform: scale(1.02);
}

.bookmark-btn {
  width: 36px;
  height: 36px;
  padding: 0;
  background: #f5f5f5;
  border: 2px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s;
}

.bookmark-btn:hover {
  background: #667eea;
  border-color: #667eea;
}

.bookmark-btn.active {
  background: #667eea;
  border-color: #667eea;
}
</style>
