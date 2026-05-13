import customCountryFlagAsset from '@/assets/default-country.png'

/** URL résolue du visuel générique pour les pays personnalisés (import Vite). */
export const CUSTOM_COUNTRY_FLAG_ASSET = customCountryFlagAsset

/**
 * URL d’affichage du drapeau / visuel pays.
 * Pays officiels : SVG ou PNG API.
 * Pays personnalisés : placeholder local si aucune URL réelle.
 */
export function getCountryFlagSrc(country) {
  if (!country || typeof country !== 'object') return ''

  const svg = country.flags?.svg
  const png = country.flags?.png
  if (svg && String(svg).trim()) return svg
  if (png && String(png).trim()) return png
  if (country.isCustom) return customCountryFlagAsset
  return ''
}
