import { ref } from 'vue'
import { defineStore } from 'pinia'

const AUTH_STORAGE_KEY = 'world-explorer-auth'

// --- Persistance locale de la session démo (front-end uniquement) ---

function isLocalStorageAvailable() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readAuthFromStorage() {
  if (!isLocalStorageAvailable()) return { isAuthenticated: false, user: null }

  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return { isAuthenticated: false, user: null }
    const parsed = JSON.parse(raw)
    return {
      isAuthenticated: Boolean(parsed?.isAuthenticated),
      user: parsed?.user && typeof parsed.user === 'object' ? parsed.user : null,
    }
  } catch {
    return { isAuthenticated: false, user: null }
  }
}

function persistAuthToStorage(payload) {
  if (!isLocalStorageAvailable()) return
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Echec silencieux : l'authentification reste en memoire.
  }
}

export const useAuthStore = defineStore('auth', () => {
  const initialState = readAuthFromStorage()
  const isAuthenticated = ref(initialState.isAuthenticated)
  const user = ref(initialState.user)
  const authSnackbar = ref({
    visible: false,
    message: '',
    color: 'success',
  })

  function showAuthFeedback(message, color = 'success') {
    authSnackbar.value = {
      visible: true,
      message,
      color,
    }
  }

  function hideAuthFeedback() {
    authSnackbar.value.visible = false
  }

  function login(username, password) {
    // Demo scolaire uniquement: authentification front-end simulée (pas de sécurité réelle).
    if (username === 'admin' && password === 'admin') {
      isAuthenticated.value = true
      user.value = { username: 'admin' }
      persistAuthToStorage({
        isAuthenticated: true,
        user: user.value,
      })
      showAuthFeedback('Connexion réussie')
      return { success: true }
    }

    return { success: false, error: 'Identifiants invalides.' }
  }

  function logout() {
    isAuthenticated.value = false
    user.value = null
    persistAuthToStorage({
      isAuthenticated: false,
      user: null,
    })
    showAuthFeedback('Déconnexion réussie', 'info')
  }

  return {
    isAuthenticated,
    user,
    authSnackbar,
    login,
    logout,
    hideAuthFeedback,
  }
})
