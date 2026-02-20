<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>📚 Books</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">📚 Books Library</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="ion-padding">
        <!-- Search Bar -->
        <ion-searchbar
          v-model="searchQuery"
          placeholder="Search books..."
          show-clear-button="focus"
          class="ion-margin-bottom"
        ></ion-searchbar>

        <!-- Filter Segment -->
        <ion-segment v-model="activeFilter" scrollable class="ion-margin-bottom">
          <ion-segment-button value="all">
            <ion-label>All</ion-label>
          </ion-segment-button>
          <ion-segment-button value="unread">
            <ion-label>Unread</ion-label>
          </ion-segment-button>
          <ion-segment-button value="read">
            <ion-label>Read</ion-label>
          </ion-segment-button>
          <ion-segment-button value="favorites">
            <ion-label>Favorites</ion-label>
          </ion-segment-button>
        </ion-segment>

        <!-- Loading -->
        <ion-card v-if="loading">
          <ion-card-content class="ion-text-center">
            <ion-spinner color="primary"></ion-spinner>
            <p class="ion-margin-top">Loading books...</p>
          </ion-card-content>
        </ion-card>

        <!-- Error -->
        <ion-card v-else-if="error" color="danger">
          <ion-card-content>
            <p>⚠️ {{ error }}</p>
            <ion-button expand="block" @click="loadBooks">Retry</ion-button>
          </ion-card-content>
        </ion-card>

        <!-- No Books Found -->
        <ion-card v-else-if="filteredBooks.length === 0">
          <ion-card-content class="ion-text-center">
            <p>No books found</p>
          </ion-card-content>
        </ion-card>

        <!-- Books Grid -->
        <ion-grid v-else>
          <ion-row>
            <ion-col
              sizeLg="4"
              sizeMd="6"
              size="12"
              v-for="book in filteredBooks"
              :key="book.id"
            >
              <ion-card>
                <img :src="book.cover" :alt="book.title" class="book-cover" />
                <ion-card-header>
                  <ion-card-title>{{ book.title }}</ion-card-title>
                  <ion-text color="medium">
                    <p class="ion-text-sm">{{ book.author }}</p>
                  </ion-text>
                </ion-card-header>
                <ion-card-content>
                  <ion-text color="medium" class="ion-text-sm">
                    <p>Age {{ book.ageGroup }}+</p>
                  </ion-text>
                  <p class="ion-text-sm">{{ book.description }}</p>
                </ion-card-content>
                <div class="book-actions">
                  <ion-button
                    size="small"
                    fill="solid"
                    expand="block"
                    v-if="userStore.progress.booksRead.includes(book.id)"
                    color="success"
                  >
                    <ion-icon name="checkmark-circle" slot="start"></ion-icon>
                    Read
                  </ion-button>
                  <ion-button
                    v-else
                    size="small"
                    fill="solid"
                    expand="block"
                    color="primary"
                    @click="markAsRead(book.id)"
                  >
                    <ion-icon name="book" slot="start"></ion-icon>
                    Mark as Read
                  </ion-button>
                  <ion-button
                    size="small"
                    fill="outline"
                    @click="toggleFavorite(book.id)"
                    :color="userStore.isBookFavorited(book.id) ? 'warning' : 'medium'"
                  >
                    <ion-icon
                      :name="userStore.isBookFavorited(book.id) ? 'star' : 'star-outline'"
                      slot="icon-only"
                    ></ion-icon>
                  </ion-button>
                </div>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBooks } from '@/composables/useBooks'
import { useUserStore } from '@/stores/userStore'
import { useLibraryStore } from '@/stores/libraryStore'
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
  IonSpinner,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel
} from '@ionic/vue'
import { checkmarkCircle, star, starOutline, book } from 'ionicons/icons'

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

const loadBooks = () => {
  libraryStore.loadBooks()
}

onMounted(() => {
  console.log('📚 Books Library mounted')
  loadBooks()
})
</script>

<style scoped>
.book-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: #f0f0f0;
}

.book-actions {
  display: flex;
  gap: 8px;
}

.book-actions ion-button:first-child {
  flex: 1;
}
</style>

