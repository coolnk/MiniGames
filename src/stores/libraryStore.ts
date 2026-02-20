import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Book {
  id: string
  title: string
  author: string
  cover: string
  description: string
  ageGroup: string
  pages: number
  url: string
}

export interface Activity {
  id: string
  title: string
  description: string
  icon: string
  ageGroup: string
  category: string
  url: string
}

export const useLibraryStore = defineStore('library', () => {
  const books = ref<Book[]>([])
  const activities = ref<Activity[]>([])
  const loadingBooks = ref(false)
  const loadingActivities = ref(false)
  const errorBooks = ref('')
  const errorActivities = ref('')

  // Load books from manifest
  const loadBooks = async () => {
    loadingBooks.value = true
    errorBooks.value = ''

    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch('/data/books-manifest.json')
      if (!response.ok) {
        throw new Error('Failed to load books manifest')
      }
      const data = await response.json()
      books.value = data.books || []
      console.log('✅ Books loaded:', books.value.length)
    } catch (err) {
      errorBooks.value = err instanceof Error ? err.message : 'Failed to load books'
      console.error('❌ Error loading books:', err)
    } finally {
      loadingBooks.value = false
    }
  }

  // Load activities from manifest
  const loadActivities = async () => {
    loadingActivities.value = true
    errorActivities.value = ''

    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch('/data/activities-manifest.json')
      if (!response.ok) {
        throw new Error('Failed to load activities manifest')
      }
      const data = await response.json()
      activities.value = data.activities || []
      console.log('✅ Activities loaded:', activities.value.length)
    } catch (err) {
      errorActivities.value = err instanceof Error ? err.message : 'Failed to load activities'
      console.error('❌ Error loading activities:', err)
    } finally {
      loadingActivities.value = false
    }
  }

  // Get book by ID
  const getBookById = (id: string) => {
    return books.value.find(book => book.id === id)
  }

  // Get activity by ID
  const getActivityById = (id: string) => {
    return activities.value.find(activity => activity.id === id)
  }

  // Get books by age group
  const getBooksByAgeGroup = (ageGroup: string) => {
    return books.value.filter(book => book.ageGroup === ageGroup)
  }

  // Get activities by category
  const getActivitiesByCategory = (category: string) => {
    return activities.value.filter(activity => activity.category === category)
  }

  return {
    // State
    books,
    activities,
    loadingBooks,
    loadingActivities,
    errorBooks,
    errorActivities,

    // Actions
    loadBooks,
    loadActivities,
    getBookById,
    getActivityById,
    getBooksByAgeGroup,
    getActivitiesByCategory
  }
})
