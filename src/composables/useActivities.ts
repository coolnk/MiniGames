import { computed } from 'vue'
import { useLibraryStore } from '@/stores/libraryStore'
import { useUserStore } from '@/stores/userStore'

export function useActivities(category?: string) {
  const libraryStore = useLibraryStore()
  const userStore = useUserStore()

  const filteredActivities = computed(() => {
    if (category) {
      return libraryStore.getActivitiesByCategory(category)
    }
    return libraryStore.activities
  })

  const completedActivities = computed(() => {
    return filteredActivities.value.filter(activity =>
      userStore.progress.activitiesCompleted.includes(activity.id)
    )
  })

  const incompleteActivities = computed(() => {
    return filteredActivities.value.filter(activity =>
      !userStore.progress.activitiesCompleted.includes(activity.id)
    )
  })

  const getCategories = computed(() => {
    return [...new Set(libraryStore.activities.map(a => a.category))]
  })

  const searchActivities = (query: string) => {
    return filteredActivities.value.filter(activity =>
      activity.title.toLowerCase().includes(query.toLowerCase()) ||
      activity.description.toLowerCase().includes(query.toLowerCase())
    )
  }

  const markAsComplete = (activityId: string) => {
    userStore.completeActivity(activityId)
  }

  return {
    activities: filteredActivities,
    completedActivities,
    incompleteActivities,
    categories: getCategories,
    loading: computed(() => libraryStore.loadingActivities),
    error: computed(() => libraryStore.errorActivities),
    searchActivities,
    markAsComplete
  }
}
