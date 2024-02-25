import { defineConfig } from 'astro/config'
import serviceWorker from 'astrojs-service-worker'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://astro.build/config
export default defineConfig({
  integrations: [
    serviceWorker()
  ],
  vite: {
    plugins: [basicSsl()]
  }
})
