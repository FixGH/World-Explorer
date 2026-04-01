const BASE_URL = 'https://restcountries.com/v3.1'
const FIELDS = 'name,flags,capital,region,population,cca3'

async function fetchJson(url) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.json()
}

export async function getAllCountries() {
  const countries = await fetchJson(`${BASE_URL}/all?fields=${FIELDS}`)

  return [...countries].sort((a, b) => {
    const left = a?.name?.common || ''
    const right = b?.name?.common || ''
    return left.localeCompare(right)
  })
}

export async function getCountryByCode(code) {
  const countries = await fetchJson(`${BASE_URL}/alpha/${code}?fields=${FIELDS}`)
  return countries?.[0] ?? null
}
