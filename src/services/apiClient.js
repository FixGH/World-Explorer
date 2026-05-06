import axios from 'axios'

const baseURL = (import.meta.env.VITE_REST_COUNTRIES_API_URL || 'https://restcountries.com/v3.1').replace(/\/+$/, '')

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
})
