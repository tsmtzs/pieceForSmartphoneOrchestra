import { defineConfig } from 'astro/config'
import serviceWorker from 'astrojs-service-worker'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://astro.build/config
export default defineConfig({
  site: 'https://tsmtzs.github.io',
  base: 'pieceForSmartphoneOrchestra',
  integrations: [
    serviceWorker()
  ],
  vite: {
    plugins: [basicSsl()]
  }
})
