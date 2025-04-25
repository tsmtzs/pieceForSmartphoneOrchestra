import { defineConfig } from 'astro/config'
import serviceWorker from 'astrojs-service-worker'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  site: 'https://tsmtzs.github.io/pieceForSmartphoneOrchestra/',
  integrations: [
    serviceWorker()
  ],
  vite: {
    plugins: [basicSsl()]
  }
})
