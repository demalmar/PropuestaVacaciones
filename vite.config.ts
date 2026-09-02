import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configurar base para GitHub Pages bajo /PropuestaVacaciones/
export default defineConfig({
  base: '/PropuestaVacaciones/',
  plugins: [react()],
})
