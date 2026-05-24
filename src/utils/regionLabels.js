/** Libellés français des régions renvoyées par l'API REST Countries. */
export const regionLabels = {
  Africa: 'Afrique',
  Americas: 'Amériques',
  Asia: 'Asie',
  Europe: 'Europe',
  Oceania: 'Océanie',
  Antarctic: 'Antarctique',
}

export function formatRegionLabel(region, fallback = '—') {
  if (!region) return fallback
  return regionLabels[region] || region
}
