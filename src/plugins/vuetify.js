/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#17D7D1',
          secondary: '#36A8FF',
          accent: '#7CF3E8',
          error: '#FF5E74',
          info: '#54D9FF',
          success: '#56D98B',
          warning: '#FFBC54',
        },
      },
    },
  },
})
