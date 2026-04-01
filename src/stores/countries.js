import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getAllCountries, getCountryByCode } from '@/services/countriesService'

const FAVORITES_STORAGE_KEY = 'world-explorer-favorites'

function loadFavoriteCodes() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const useCountriesStore = defineStore('countries', () => {
  const countries = ref([])
  const loading = ref(false)
  const error = ref(null)
  const selectedCountry = ref(null)
  const selectedCountryLoading = ref(false)
  const selectedCountryError = ref(null)
  const favoriteCodes = ref(loadFavoriteCodes())

  const countriesByCode = computed(() => {
    const map = new Map()
    for (const country of countries.value) {
      map.set(country.cca3, country)
    }
    return map
  })

  const favoriteCountries = computed(() => {
    return favoriteCodes.value
      .map((code) => countriesByCode.value.get(code))
      .filter(Boolean)
  })

  function persistFavorites() {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteCodes.value))
  }

  function isFavorite(code) {
    return favoriteCodes.value.includes(code)
  }

  function toggleFavorite(code) {
    if (isFavorite(code)) {
      favoriteCodes.value = favoriteCodes.value.filter((item) => item !== code)
    } else {
      favoriteCodes.value = [...favoriteCodes.value, code]
    }
    persistFavorites()
  }

  async function fetchCountries() {
    loading.value = true
    error.value = null
    try {
      countries.value = await getAllCountries()
    } catch (err) {
      error.value = `Unable to load countries: ${err.message}`
    } finally {
      loading.value = false
    }
  }

  async function fetchCountryByCode(code) {
    selectedCountryLoading.value = true
    selectedCountryError.value = null
    selectedCountry.value = null
    try {
      selectedCountry.value = await getCountryByCode(code)
    } catch (err) {
      selectedCountryError.value = `Unable to load country details: ${err.message}`
    } finally {
      selectedCountryLoading.value = false
    }
  }

  return {
    countries,
    loading,
    error,
    selectedCountry,
    selectedCountryLoading,
    selectedCountryError,
    favoriteCodes,
    favoriteCountries,
    isFavorite,
    toggleFavorite,
    fetchCountries,
    fetchCountryByCode,
  }
})
