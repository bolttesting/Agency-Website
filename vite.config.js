import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { normalizeSiteOrigin } from './src/config/siteOrigin.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const SITE_ORIGIN_PLACEHOLDER = '__SITE_ORIGIN__'

function siteOriginForHtml(mode) {
  const env = loadEnv(mode, process.cwd(), '')
  return normalizeSiteOrigin(env.VITE_SITE_URL || '')
}

function supabaseOriginFromEnv(mode) {
  const env = loadEnv(mode, process.cwd(), '')
  const raw = env.VITE_SUPABASE_URL
  if (!raw || typeof raw !== 'string') return ''
  try {
    return new URL(raw.trim().replace(/^['"]|['"]$/g, '')).origin
  } catch {
    return ''
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const supabaseOrigin = supabaseOriginFromEnv(mode)

  return {
    plugins: [
      react(),
      {
        name: 'inject-index-html-env',
        transformIndexHtml(html) {
          let out = html.split(SITE_ORIGIN_PLACEHOLDER).join(siteOriginForHtml(mode))
          if (supabaseOrigin) {
            const tag = `    <link rel="preconnect" href="${supabaseOrigin}" crossorigin />\n`
            out = out.replace(
              '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
              `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n${tag.trimEnd()}\n`,
            )
          }
          return out
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      target: 'es2022',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined
            if (id.includes('framer-motion')) return 'motion'
            if (id.includes('@supabase')) return 'supabase'
            if (id.includes('three')) return 'three'
            if (id.includes('cobe')) return 'cobe'
            if (id.includes('dotted-map')) return 'dotted-map'
            if (id.includes('lucide-react')) return 'icons'
            if (id.includes('dompurify')) return 'dompurify'
            if (id.includes('react-dom') || id.includes('react-router')) return 'react-vendor'
            if (id.includes('/react/')) return 'react-vendor'
            return undefined
          },
        },
      },
    },
  }
})
