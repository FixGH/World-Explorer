import { apiClient } from '@/services/apiClient'

const LIST_FIELDS = 'name,flags,capital,region,subregion,population,area,borders,cca2,cca3'
const DETAIL_FIELDS = [
  'name',
  'flags',
  'capital',
  'region',
  'subregion',
  'population',
  'area',
  'continents',
  'languages',
  'currencies',
  'timezones',
  'independent',
  'cca2',
  'cca3',
  'borders',
  'maps',
  'latlng',
].join(',')

/** Appelle l'API REST Countries et remonte une erreur lisible en français. */
async function fetchJson(path, params) {
  try {
    const response = await apiClient.get(path, { params })
    return response.data
  } catch (error) {
    if (error?.response?.status) {
      throw new Error(`Erreur HTTP ${error.response.status}`)
    }
    throw new Error(error?.message || 'Erreur réseau')
  }
}

export async function getAllCountries() {
  const countries = await fetchJson('/all', { fields: LIST_FIELDS })

  return [...countries].sort((a, b) => {
    const left = a?.name?.common || ''
    const right = b?.name?.common || ''
    return left.localeCompare(right)
  })
}

export async function getCountryByCode(code) {
  const data = await fetchJson(`/alpha/${encodeURIComponent(code)}`, { fields: DETAIL_FIELDS })

  if (Array.isArray(data)) {
    return data[0] ?? null
  }

  return data ?? null
}
