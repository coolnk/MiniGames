<template>
  <div class="books-library">
    <div class="header">
      <h1>📚 Books Library</h1>
      <button @click="goBack" class="back-btn">← Back to Portal</button>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading books...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>⚠️ {{ error }}</p>
      <button @click="loadBooks" class="retry-btn">Retry</button>
    </div>

    <div v-else class="books-container">
      <div class="filter-section">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search books..."
          class="search-input"
        />
        <div class="filter-buttons">
          <button
            v-for="status in ['all', 'unread', 'read', 'favorites']"
            :key="status"
            @click="activeFilter = status"
            :class="{ active: activeFilter === status }"
            class="filter-btn"
          >
            {{ status.charAt(0).toUpperCase() + status.slice(1) }}
          </button>
        </div>
      </div>

      <div v-if="filteredBooks.length === 0" class="no-books">
        <p>No books found</p>
      </div>

      <div v-else class="books-grid">
        <div
          v-for="book in filteredBooks"
          :key="book.id"
          class="book-card"
        >
          <img :src="book.cover" :alt="book.title" class="book-cover" />
          <div class="book-info">
            <h3>{{ book.title }}</h3>
            <p class="author">{{ book.author }}</p>
            <p class="age-group">Age {{ book.ageGroup }}+</p>
            <p class="description">{{ book.description }}</p>
            <div class="book-actions">
              <button
                @click="toggleFavorite(book.id)"
                :class="{ active: userStore.isBookFavorited(book.id) }"
                class="favorite-btn"
              >
                {{ userStore.isBookFavorited(book.id) ? '⭐' : '☆' }}
              </button>
              <button
                v-if="userStore.progress.booksRead.includes(book.id)"
                class="read-badge"
              >
                ✓ Read
              </button>
              <button
                v-else
                @click="markAsRead(book.id)"
                class="read-btn"
              >
                Mark as Read
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
import { useBooks } from '@/composables/useBooks'
import { useUserStore } from '@/stores/userStore'
import { useLibraryStore } from '@/stores/libraryStore'

const router = useRouter()
const userStore = useUserStore()
const libraryStore = useLibraryStore()
const { books, loading, error, searchBooks, markAsRead, toggleFavorite } = useBooks()

const searchQuery = ref('')
const activeFilter = ref('all')

const filteredBooks = computed(() => {
  let filtered = searchQuery.value ? searchBooks(searchQuery.value) : books.value

  switch (activeFilter.value) {
    case 'read':
      filtered = filtered.filter(book =>
        userStore.progress.booksRead.includes(book.id)
      )
      break
    case 'unread':
      filtered = filtered.filter(book =>
        !userStore.progress.booksRead.includes(book.id)
      )
      break
    case 'favorites':
      filtered = filtered.filter(book =>
        userStore.isBookFavorited(book.id)
      )
      break
    default:
      break
  }

  return filtered
})

const goBack = () => {
  router.push('/')
}

const loadBooks = () => {
  libraryStore.loadBooks()
}

onMounted(() => {
  console.log('📚 Books Library mounted')
  loadBooks()
})
</script>

<style scoped>
.books-library {
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

.books-container {
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

.no-books {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 18px;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.book-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.book-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: #f0f0f0;
}

.book-info {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.book-info h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
  line-height: 1.2;
}

.author {
  margin: 0;
  font-size: 12px;
  color: #999;
  font-style: italic;
}

.age-group {
  margin: 0;
  font-size: 12px;
  color: #667eea;
  font-weight: 600;
}

.description {
  margin: 5px 0 0 0;
  font-size: 12px;
  color: #666;
  line-height: 1.3;
  flex: 1;
}

.book-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.favorite-btn {
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

.favorite-btn:hover {
  background: #667eea;
  border-color: #667eea;
}

.favorite-btn.active {
  background: #667eea;
  border-color: #667eea;
}

.read-badge {
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

.read-btn {
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

.read-btn:hover {
  opacity: 0.9;
  transform: scale(1.02);
}
</style>
