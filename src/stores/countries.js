import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getAllCountries, getCountryByCode } from '@/services/countriesService'

const FAVORITES_STORAGE_KEY = 'world-explorer-favorites'
const RECENTLY_VIEWED_STORAGE_KEY = 'world-explorer-recently-viewed'

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
  const recentlyViewed = ref(loadRecentlyViewedCountries())

  function loadRecentlyViewedCountries() {
    try {
      const raw = localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : []

      if (!Array.isArray(parsed)) return []

      return parsed
        .filter((item) => item && typeof item === 'object' && typeof item.code === 'string')
        .map((item) => ({
          code: String(item.code || '').trim().toUpperCase(),
          name: typeof item.name === 'string' ? item.name : String(item.code || '').trim().toUpperCase(),
          flagSrc: typeof item.flagSrc === 'string' ? item.flagSrc : '',
        }))
        .filter((item) => item.code)
    } catch {
      return []
    }
  }

  function persistRecentlyViewedCountries() {
    localStorage.setItem(
      RECENTLY_VIEWED_STORAGE_KEY,
      JSON.stringify(recentlyViewed.value)
    )
  }

  function markRecentlyViewed(country) {
    if (!country?.cca3) return

    const code = String(country.cca3).trim().toUpperCase()
    if (!code) return

    const name = country?.name?.common || country?.name?.official || code
    const flagSrc = country?.flags?.svg || country?.flags?.png || ''

    const next = [
      { code, name, flagSrc },
      ...recentlyViewed.value.filter((item) => item.code !== code),
    ].slice(0, 5)

    recentlyViewed.value = next
    persistRecentlyViewedCountries()
  }

  const countriesByCode = computed(() => {
    const map = new Map()
    for (const country of countries.value) {
      map.set(country.cca3, country)
    }
    return map
  })

  const countrySearchItems = computed(() => {
    return countries.value
      .map((country) => {
        const code = country?.cca3
        const name = country?.name?.common || country?.name?.official || code
        const flagSrc = country?.flags?.svg || country?.flags?.png || ''

        if (!code) return null
        return {
          code: String(code).trim().toUpperCase(),
          name: typeof name === 'string' && name ? name : String(code).trim().toUpperCase(),
          flagSrc,
        }
      })
      .filter(Boolean)
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

  const totalCountries = computed(() => countries.value.length)
  const totalRegions = computed(() => new Set(countries.value.map((country) => country?.region).filter(Boolean)).size)
  const totalPopulation = computed(() => {
    return countries.value.reduce((sum, country) => sum + (country?.population || 0), 0)
  })
  const totalArea = computed(() => {
    return countries.value.reduce((sum, country) => sum + (country?.area || 0), 0)
  })
  const favoritesCount = computed(() => favoriteCodes.value.length)
  const favoriteRegionsCount = computed(() => new Set(favoriteCountries.value.map((c) => c?.region).filter(Boolean)).size)
  const favoriteTotalPopulation = computed(() => {
    return favoriteCountries.value.reduce((sum, c) => sum + (c?.population || 0), 0)
  })
  const topPopulatedCountries = computed(() => {
    return [...countries.value]
      .filter((country) => Number.isFinite(country?.population))
      .sort((a, b) => (b.population || 0) - (a.population || 0))
      .slice(0, 10)
  })
  const topLargestCountries = computed(() => {
    return [...countries.value]
      .filter((country) => Number.isFinite(country?.area))
      .sort((a, b) => (b.area || 0) - (a.area || 0))
      .slice(0, 10)
  })
  const topBorderCountries = computed(() => {
    return [...countries.value]
      .filter((country) => Array.isArray(country?.borders))
      .sort((a, b) => (b.borders?.length || 0) - (a.borders?.length || 0))
      .slice(0, 10)
  })
  const regionDistribution = computed(() => {
    const orderedRegions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Antarctic']
    const distribution = new Map(orderedRegions.map((region) => [region, 0]))

    for (const country of countries.value) {
      const region = country?.region
      if (distribution.has(region)) {
        distribution.set(region, (distribution.get(region) || 0) + 1)
      }
    }

    return orderedRegions.map((region) => ({
      region,
      count: distribution.get(region) || 0,
    }))
  })
  const mostPopulatedCountry = computed(() => topPopulatedCountries.value[0] || null)
  const largestCountry = computed(() => topLargestCountries.value[0] || null)
  const mostBorderedCountry = computed(() => topBorderCountries.value[0] || null)

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
      error.value = `Impossible de charger les pays : ${err.message}`
    } finally {
      loading.value = false
    }
  }

  async function fetchCountryByCode(code) {
    const normalizedCode = String(code || '').trim().toUpperCase()

    if (!normalizedCode) {
      selectedCountry.value = null
      selectedCountryError.value = 'Code pays manquant.'
      return
    }

    selectedCountryLoading.value = true
    selectedCountryError.value = null
    selectedCountry.value = null

    try {
      const country = await getCountryByCode(normalizedCode)

      if (!country) {
        selectedCountryError.value = `Aucun pays trouvé pour le code : ${normalizedCode}`
        return
      }

      selectedCountry.value = country
    } catch (err) {
      selectedCountryError.value = `Impossible de charger les détails du pays : ${err.message}`
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
    totalCountries,
    totalRegions,
    totalPopulation,
    totalArea,
    favoritesCount,
    favoriteRegionsCount,
    favoriteTotalPopulation,
    topPopulatedCountries,
    topLargestCountries,
    topBorderCountries,
    regionDistribution,
    mostPopulatedCountry,
    largestCountry,
    mostBorderedCountry,
    selectedCountry,
    selectedCountryLoading,
    selectedCountryError,
    favoriteCodes,
    favoriteCountries,
    recentlyViewedCountries: recentlyViewed,
    countrySearchItems,
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
    markRecentlyViewed,
  }
})
