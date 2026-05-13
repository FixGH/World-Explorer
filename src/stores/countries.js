import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getAllCountries, getCountryByCode } from '@/services/countriesService'
import { useAuthStore } from '@/stores/auth'
import { CUSTOM_COUNTRY_FLAG_ASSET, getCountryFlagSrc } from '@/utils/countryFlagSrc'

const FAVORITES_STORAGE_KEY = 'world-explorer-favorites'
const RECENTLY_VIEWED_STORAGE_KEY = 'world-explorer-recently-viewed'
const CUSTOM_COUNTRIES_STORAGE_KEY = 'world-explorer-custom-countries'
const MAX_RECENTLY_VIEWED = 5

function normalizeCountryCode(value) {
  return String(value || '').trim().toUpperCase()
}

function isLocalStorageAvailable() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readStorageJson(key, fallback) {
  if (!isLocalStorageAvailable()) return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeStorageJson(key, value) {
  if (!isLocalStorageAvailable()) return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Echec silencieux : on garde l'etat en memoire.
  }
}

function loadFavoriteCodes() {
  const parsed = readStorageJson(FAVORITES_STORAGE_KEY, [])
  if (!Array.isArray(parsed)) return []

  return [...new Set(parsed.map((code) => normalizeCountryCode(code)).filter(Boolean))]
}

function loadRecentlyViewedCountries() {
  const parsed = readStorageJson(RECENTLY_VIEWED_STORAGE_KEY, [])
  if (!Array.isArray(parsed)) return []

  const sanitized = parsed
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const code = normalizeCountryCode(item.code)
      if (!code) return null

      return {
        code,
        name: typeof item.name === 'string' && item.name.trim() ? item.name : code,
        flagSrc: typeof item.flagSrc === 'string' ? item.flagSrc : '',
      }
    })
    .filter(Boolean)

  const uniqueByCode = []
  for (const item of sanitized) {
    if (!uniqueByCode.some((entry) => entry.code === item.code)) {
      uniqueByCode.push(item)
    }
    if (uniqueByCode.length >= MAX_RECENTLY_VIEWED) break
  }

  return uniqueByCode
}

function sanitizeCustomCountry(country) {
  if (!country || typeof country !== 'object') return null
  const code = normalizeCountryCode(country.cca3)
  if (!code) return null

  const name = country?.name?.common || country?.name?.official || code
  const officialName = country?.name?.official || name
  const capital = Array.isArray(country.capital) ? country.capital : [country.capital || 'Non disponible']

  return {
    name: {
      common: String(name),
      official: String(officialName),
    },
    flags: {
      svg: CUSTOM_COUNTRY_FLAG_ASSET,
      png: CUSTOM_COUNTRY_FLAG_ASSET,
    },
    capital: [String(capital[0] || 'Non disponible')],
    region: String(country?.region || 'Autre'),
    subregion: String(country?.subregion || ''),
    population: Number(country?.population || 0),
    area: Number(country?.area || 0),
    borders: Array.isArray(country?.borders) ? country.borders : [],
    cca2: String(country?.cca2 || code.slice(0, 2)).toUpperCase(),
    cca3: code,
    continents: Array.isArray(country?.continents) ? country.continents : ['Monde'],
    languages: country?.languages && typeof country.languages === 'object' ? country.languages : { fra: 'Français' },
    currencies: country?.currencies && typeof country.currencies === 'object' ? country.currencies : null,
    timezones: Array.isArray(country?.timezones) ? country.timezones : [],
    independent: country?.independent ?? null,
    maps: country?.maps && typeof country.maps === 'object' ? country.maps : {},
    latlng: Array.isArray(country?.latlng) ? country.latlng : [],
    isCustom: true,
  }
}

function loadCustomCountries() {
  const parsed = readStorageJson(CUSTOM_COUNTRIES_STORAGE_KEY, [])
  if (!Array.isArray(parsed)) return []
  return parsed.map((item) => sanitizeCustomCountry(item)).filter(Boolean)
}

export const useCountriesStore = defineStore('countries', () => {
  const officialCountries = ref([])
  const customCountries = ref(loadCustomCountries())
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')
  const selectedRegion = ref('all')
  const sortOption = ref('name-asc')
  const compareLeftCode = ref('')
  const compareRightCode = ref('')
  const compareCountriesCache = ref({})
  const selectedCountry = ref(null)
  const selectedCountryLoading = ref(false)
  const selectedCountryError = ref(null)
  const favoritesSnackbar = ref({
    visible: false,
    message: '',
    color: 'success',
  })
  const favoriteCodes = ref(loadFavoriteCodes())
  const recentlyViewed = ref(loadRecentlyViewedCountries())
  const countries = computed(() => {
    return [...officialCountries.value, ...customCountries.value]
  })

  function showFavoritesFeedback(message, color = 'success') {
    favoritesSnackbar.value = {
      visible: true,
      message,
      color,
    }
  }

  function hideFavoritesFeedback() {
    favoritesSnackbar.value.visible = false
  }

  function persistRecentlyViewedCountries() {
    writeStorageJson(RECENTLY_VIEWED_STORAGE_KEY, recentlyViewed.value)
  }

  function persistCustomCountries() {
    writeStorageJson(CUSTOM_COUNTRIES_STORAGE_KEY, customCountries.value)
  }

  function markRecentlyViewed(country) {
    const code = normalizeCountryCode(country?.cca3)
    if (!code) return

    const name = country?.name?.common || country?.name?.official || code
    const flagSrc = getCountryFlagSrc(country)

    const next = [
      { code, name, flagSrc },
      ...recentlyViewed.value.filter((item) => item.code !== code),
    ].slice(0, MAX_RECENTLY_VIEWED)

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
        const flagSrc = getCountryFlagSrc(country)
        const region = country?.region || ''

        if (!code) return null
        return {
          code: String(code).trim().toUpperCase(),
          name: typeof name === 'string' && name ? name : String(code).trim().toUpperCase(),
          flagSrc,
          region,
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
    return code ? compareCountriesCache.value[code] ?? countriesByCode.value.get(code) ?? null : null
  })

  const compareRightCountry = computed(() => {
    const code = String(compareRightCode.value || '').trim().toUpperCase()
    return code ? compareCountriesCache.value[code] ?? countriesByCode.value.get(code) ?? null : null
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

  /** Pays avec la population la plus faible (parmi les valeurs numériques connues). */
  const leastPopulatedCountry = computed(() => {
    const list = countries.value.filter((c) => Number.isFinite(c?.population))
    if (!list.length) return null
    return [...list].sort((a, b) => (a.population || 0) - (b.population || 0))[0]
  })

  /** Pays avec la plus forte densité (hab./km²), superficie strictement positive. */
  const mostDenseCountry = computed(() => {
    let best = null
    let bestDensity = -1
    for (const c of countries.value) {
      const pop = Number(c?.population)
      const area = Number(c?.area)
      if (!Number.isFinite(pop) || !Number.isFinite(area) || area <= 0) continue
      const d = pop / area
      if (d > bestDensity) {
        bestDensity = d
        best = c
      }
    }
    return best
  })

  /** Région du monde comptant le plus de pays dans le jeu chargé (ex-aequo : première max rencontrée dans l’ordre fixe des régions). */
  const leadingRegionByCount = computed(() => {
    let bestRegion = null
    let max = -1
    for (const item of regionDistribution.value) {
      if (item.count > max) {
        max = item.count
        bestRegion = item.region
      }
    }
    return bestRegion != null && max > 0 ? { region: bestRegion, count: max } : null
  })

  const averagePopulationPerCountry = computed(() => {
    const n = countries.value.length
    if (!n) return null
    return totalPopulation.value / n
  })

  const averageAreaPerCountry = computed(() => {
    const n = countries.value.length
    if (!n) return null
    return totalArea.value / n
  })

  function persistFavorites() {
    writeStorageJson(FAVORITES_STORAGE_KEY, favoriteCodes.value)
  }

  function isFavorite(code) {
    const normalizedCode = normalizeCountryCode(code)
    if (!normalizedCode) return false
    return favoriteCodes.value.includes(normalizedCode)
  }

  function addFavorite(code) {
    const normalizedCode = normalizeCountryCode(code)
    if (!normalizedCode || isFavorite(normalizedCode)) return
    favoriteCodes.value = [...favoriteCodes.value, normalizedCode]
    persistFavorites()
    showFavoritesFeedback('Pays ajouté aux favoris.')
  }

  function removeFavorite(code) {
    const normalizedCode = normalizeCountryCode(code)
    if (!normalizedCode || !isFavorite(normalizedCode)) return
    favoriteCodes.value = favoriteCodes.value.filter((item) => item !== normalizedCode)
    persistFavorites()
    showFavoritesFeedback('Pays retiré des favoris.', 'info')
  }

  function toggleFavorite(code) {
    if (isFavorite(code)) {
      removeFavorite(code)
      return
    }
    addFavorite(code)
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
      officialCountries.value = await getAllCountries()
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
      const localCountry = customCountries.value.find((item) => item.cca3 === normalizedCode)
      if (localCountry) {
        selectedCountry.value = localCountry
        return
      }

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

  async function ensureCompareCountryData(code) {
    const normalizedCode = String(code || '').trim().toUpperCase()
    if (!normalizedCode || compareCountriesCache.value[normalizedCode]) return

    const localCountry = customCountries.value.find((item) => item.cca3 === normalizedCode)
    if (localCountry) {
      compareCountriesCache.value = {
        ...compareCountriesCache.value,
        [normalizedCode]: localCountry,
      }
      return
    }

    const country = await getCountryByCode(normalizedCode)
    if (!country) return

    compareCountriesCache.value = {
      ...compareCountriesCache.value,
      [normalizedCode]: country,
    }
  }

  function showActionReservedFeedback() {
    showFavoritesFeedback('Action réservée aux utilisateurs connectés', 'warning')
  }

  function generateCustomCode() {
    let code = ''
    do {
      code = `X${Math.random().toString(36).slice(2, 7)}`.toUpperCase()
    } while (countriesByCode.value.has(code))
    return code
  }

  function addCustomCountry(payload) {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      showActionReservedFeedback()
      return { success: false, reason: 'unauthorized' }
    }

    const name = String(payload?.name || '').trim()
    if (!name) return { success: false, reason: 'invalid' }

    const code = generateCustomCode()
    const customCountry = sanitizeCustomCountry({
      name: {
        common: name,
        official: name,
      },
      capital: [String(payload?.capital || '').trim() || 'Non disponible'],
      region: String(payload?.region || '').trim() || 'Autre',
      population: Number(payload?.population || 0),
      area: Number(payload?.area || 0),
      cca3: code,
      cca2: code.slice(0, 2),
      isCustom: true,
    })

    customCountries.value = [...customCountries.value, customCountry]
    persistCustomCountries()
    showFavoritesFeedback('Pays personnalisé ajouté')
    return { success: true }
  }

  function deleteCustomCountry(code) {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      showActionReservedFeedback()
      return { success: false, reason: 'unauthorized' }
    }

    const normalizedCode = normalizeCountryCode(code)
    const target = customCountries.value.find((country) => country.cca3 === normalizedCode)
    if (!target) return { success: false, reason: 'not-found' }

    customCountries.value = customCountries.value.filter((country) => country.cca3 !== normalizedCode)
    persistCustomCountries()

    if (selectedCountry.value?.cca3 === normalizedCode) {
      selectedCountry.value = null
    }
    if (compareCountriesCache.value[normalizedCode]) {
      const { [normalizedCode]: ignored, ...rest } = compareCountriesCache.value
      compareCountriesCache.value = rest
    }

    showFavoritesFeedback('Pays personnalisé supprimé', 'info')
    return { success: true }
  }

  return {
    officialCountries,
    customCountries,
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
    leastPopulatedCountry,
    mostDenseCountry,
    leadingRegionByCount,
    averagePopulationPerCountry,
    averageAreaPerCountry,
    selectedCountry,
    selectedCountryLoading,
    selectedCountryError,
    favoritesSnackbar,
    favoriteCodes,
    favoriteCountries,
    recentlyViewedCountries: recentlyViewed,
    countrySearchItems,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    hideFavoritesFeedback,
    showActionReservedFeedback,
    addCustomCountry,
    deleteCustomCountry,
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
    ensureCompareCountryData,
    markRecentlyViewed,
  }
})
