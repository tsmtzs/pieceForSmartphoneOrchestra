import { defineConfig } from 'astro/config'
import serviceWorker from 'astrojs-service-worker'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  base: 'pieceForSmartphoneOrchestra',
  site: 'https://tsmtzs.github.io',
  trailingSlash: 'never',
  integrations: [
    serviceWorker()
  ],
  vite: {
    plugins: [basicSsl()]
  }
})
