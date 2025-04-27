import { defineConfig } from '@adonisjs/cors'

/**
 * Configuration options to tweak the CORS policy. The following
 * options are documented on the official documentation website.
 *
 * https://docs.adonisjs.com/guides/security/cors
 */
const corsConfig = defineConfig({
  enabled: true,
  origin: true,
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
  headers: ['Content-Type', 'Authorization', 'token'],
  exposeHeaders: ['Authorization', 'token'],
  credentials: true,
  maxAge: 90,
})
console.log("🚀 Configuración CORS cargada:", corsConfig);

export default corsConfig
