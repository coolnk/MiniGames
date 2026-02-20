<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>🎨 Activities</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">🎨 Activities</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="ion-padding">
        <!-- Loading State -->
        <ion-card v-if="loading">
          <ion-card-content class="ion-text-center">
            <ion-spinner color="primary"></ion-spinner>
            <p class="ion-margin-top">Loading activities...</p>
          </ion-card-content>
        </ion-card>

        <!-- Error State -->
        <ion-card v-else-if="error" color="danger">
          <ion-card-content>
            <p>⚠️ {{ error }}</p>
            <ion-button expand="block" @click="loadActivities">Retry</ion-button>
          </ion-card-content>
        </ion-card>

        <!-- Content -->
        <div v-else>
          <!-- Search Bar -->
          <ion-searchbar
            v-model="searchQuery"
            placeholder="Search activities..."
            show-clear-button="focus"
            class="ion-margin-bottom"
          ></ion-searchbar>

          <!-- Category Filters -->
          <ion-segment
            v-model="activeCategory"
            :scrollable="true"
            class="ion-margin-bottom"
          >
            <ion-segment-button value="">
              <ion-label>All</ion-label>
            </ion-segment-button>
            <ion-segment-button v-for="cat in categories" :key="cat" :value="cat">
              <ion-label>{{ cat }}</ion-label>
            </ion-segment-button>
          </ion-segment>

          <!-- No Activities Message -->
          <ion-card v-if="filteredActivities.length === 0" color="medium">
            <ion-card-content class="ion-text-center">
              <p>📭 No activities found</p>
            </ion-card-content>
          </ion-card>

          <!-- Activities Grid -->
          <ion-grid v-else>
            <ion-row>
              <ion-col sizeLg="6" sizeMd="6" size="12" v-for="activity in filteredActivities" :key="activity.id">
                <ion-card>
                  <ion-card-header>
                    <div class="activity-header">
                      <div class="activity-icon">{{ activity.icon }}</div>
                      <div class="activity-title-group">
                        <ion-card-title>{{ activity.title }}</ion-card-title>
                        <ion-text color="medium">
                          <p class="ion-text-capitalize">{{ activity.category }}</p>
                        </ion-text>
                      </div>
                    </div>
                  </ion-card-header>
                  <ion-card-content>
                    <ion-text>
                      <p class="ion-text-sm">{{ activity.description }}</p>
                    </ion-text>
                    <ion-text color="medium" class="ion-text-sm">
                      <p>👶 Age {{ activity.ageGroup }}+</p>
                    </ion-text>
                  </ion-card-content>
                  <ion-card-content>
                    <ion-button
                      v-if="userStore.progress.activitiesCompleted.includes(activity.id)"
                      expand="block"
                      color="success"
                      disabled
                    >
                      <ion-icon slot="start" name="checkmark-circle"></ion-icon>
                      Completed
                    </ion-button>
                    <ion-button
                      v-else
                      expand="block"
                      @click="markAsComplete(activity.id)"
                    >
                      <ion-icon slot="start" name="play-circle"></ion-icon>
                      Start Activity
                    </ion-button>
                    <ion-button
                      fill="outline"
                      expand="block"
                      @click="toggleBookmark(activity.id)"
                      :color="userStore.isBookmarked(activity.id) ? 'warning' : 'medium'"
                      class="ion-margin-top"
                    >
                      <ion-icon
                        :name="userStore.isBookmarked(activity.id) ? 'bookmark' : 'bookmark-outline'"
                        slot="start"
                      ></ion-icon>
                      {{ userStore.isBookmarked(activity.id) ? 'Bookmarked' : 'Bookmark' }}
                    </ion-button>
                  </ion-card-content>
                </ion-card>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useActivities } from '@/composables/useActivities'
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
  IonCardContent,
  IonCardTitle,
  IonButton,
  IonButtons,
  IonBackButton,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonSpinner
} from '@ionic/vue'
import { checkmarkCircle, playCircle, bookmark, bookmarkOutline } from 'ionicons/icons'

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

const loadActivities = () => {
  libraryStore.loadActivities()
}

onMounted(() => {
  console.log('🎨 Activities mounted')
  loadActivities()
})
</script>

<style scoped>
.activity-header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.activity-icon {
  font-size: 36px;
  min-width: 50px;
  text-align: center;
}

.activity-title-group {
  flex: 1;
}

ion-card-title {
  font-size: 16px;
  margin: 0;
}

ion-card-content p {
  margin: 4px 0;
}
</style>
