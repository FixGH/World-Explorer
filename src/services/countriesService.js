const BASE_URL = 'https://restcountries.com/v3.1'
const LIST_FIELDS = 'name,flags,capital,region,population,area,borders,cca3'
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

async function fetchJson(url) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.json()
}

export async function getAllCountries() {
  const countries = await fetchJson(`${BASE_URL}/all?fields=${LIST_FIELDS}`)

  return [...countries].sort((a, b) => {
    const left = a?.name?.common || ''
    const right = b?.name?.common || ''
    return left.localeCompare(right)
  })
}

export async function getCountryByCode(code) {
  const data = await fetchJson(`${BASE_URL}/alpha/${encodeURIComponent(code)}?fields=${DETAIL_FIELDS}`)

  if (Array.isArray(data)) {
    return data[0] ?? null
  }

  return data ?? null
}
