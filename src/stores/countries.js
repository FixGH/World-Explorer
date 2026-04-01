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
  const searchQuery = ref('')
  const selectedRegion = ref('all')
  const sortOption = ref('name-asc')
  const compareLeftCode = ref('')
  const compareRightCode = ref('')
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

  const filteredCountries = computed(() => {
    const normalizedQuery = searchQuery.value.trim().toLowerCase()

    const filtered = countries.value.filter((country) => {
      const name = country?.name?.common?.toLowerCase() || ''
      const region = country?.region || ''

      const matchesSearch = !normalizedQuery || name.includes(normalizedQuery)
      const matchesRegion = selectedRegion.value === 'all' || region === selectedRegion.value

      return matchesSearch && matchesRegion
    })

    const sorted = [...filtered]
    sorted.sort((left, right) => {
      switch (sortOption.value) {
        case 'name-desc':
          return (right?.name?.common || '').localeCompare(left?.name?.common || '')
        case 'population-asc':
          return (left?.population || 0) - (right?.population || 0)
        case 'population-desc':
          return (right?.population || 0) - (left?.population || 0)
        case 'name-asc':
        default:
          return (left?.name?.common || '').localeCompare(right?.name?.common || '')
      }
    })

    return sorted
  })

  const compareLeftCountry = computed(() => {
    const code = String(compareLeftCode.value || '').trim().toUpperCase()
    return code ? countriesByCode.value.get(code) ?? null : null
  })

  const compareRightCountry = computed(() => {
    const code = String(compareRightCode.value || '').trim().toUpperCase()
    return code ? countriesByCode.value.get(code) ?? null : null
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

  function setSearchQuery(value) {
    searchQuery.value = String(value || '')
  }

  function setSelectedRegion(value) {
    selectedRegion.value = value || 'all'
  }

  function setSortOption(value) {
    sortOption.value = value || 'name-asc'
  }

  function resetFilters() {
    searchQuery.value = ''
    selectedRegion.value = 'all'
    sortOption.value = 'name-asc'
  }

  function setCompareLeftCode(code) {
    compareLeftCode.value = String(code || '').trim().toUpperCase()
  }

  function setCompareRightCode(code) {
    compareRightCode.value = String(code || '').trim().toUpperCase()
  }

  function resetCompare() {
    compareLeftCode.value = ''
    compareRightCode.value = ''
  }

  function getCountryNameByCode(code) {
    const normalizedCode = String(code || '').trim().toUpperCase()
    return countriesByCode.value.get(normalizedCode)?.name?.common || normalizedCode
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
    const normalizedCode = String(code || '').trim().toUpperCase()

    if (!normalizedCode) {
      selectedCountry.value = null
      selectedCountryError.value = 'Missing country code.'
      return
    }

    selectedCountryLoading.value = true
    selectedCountryError.value = null
    selectedCountry.value = null

    try {
      const country = await getCountryByCode(normalizedCode)

      if (!country) {
        selectedCountryError.value = `Country not found for code: ${normalizedCode}`
        return
      }

      selectedCountry.value = country
    } catch (err) {
      selectedCountryError.value = `Unable to load country details: ${err.message}`
    } finally {
      selectedCountryLoading.value = false
    }
  }

  return {
    countries,
    filteredCountries,
    loading,
    error,
    searchQuery,
    selectedRegion,
    sortOption,
    compareLeftCode,
    compareRightCode,
    compareLeftCountry,
    compareRightCountry,
    selectedCountry,
    selectedCountryLoading,
    selectedCountryError,
    favoriteCodes,
    favoriteCountries,
    isFavorite,
    toggleFavorite,
    setSearchQuery,
    setSelectedRegion,
    setSortOption,
    resetFilters,
    setCompareLeftCode,
    setCompareRightCode,
    resetCompare,
    getCountryNameByCode,
    fetchCountries,
    fetchCountryByCode,
  }
})
