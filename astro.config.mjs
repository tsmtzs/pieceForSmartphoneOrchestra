import { defineConfig } from 'astro/config'
import serviceWorker from 'astrojs-service-worker'
import webmanifest from 'astro-webmanifest'
import basicSsl from '@vitejs/plugin-basic-ssl'
import info from './package.json'

export default defineConfig({
  integrations: [
    serviceWorker(),
    webmanifest({
      name: 'Piece for Smartphone Orchestra',
      short_name: 'Smartphone Orchestra',
      description: 'A sound piece for smartphones.',
      display: 'standalone',
      background_color: `#${info.config.colors.background}`,
      theme_color: `#${info.config.colors.dark}`,
      start_url: '/',
      orientation: 'portrait'
    })
  ],
  vite: {
    plugins: [basicSsl()]
  }
})
