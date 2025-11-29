import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// Resolve __dirname in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@mui/x-date-pickers/AdapterDateFns', 'date-fns']
  },
  resolve: {
    alias: [
      {
        // Fix for MUI AdapterDateFns internal path
        find: './date-fns-longFormatters',
        replacement: 'date-fns/_lib/format/longFormatters/index.js'
      },
      {
        // (Optional) Some MUI versions import this path form
        find: 'date-fns/_lib/format/longFormatters',
        replacement: 'date-fns/_lib/format/longFormatters/index.js'
      }
    ]
  }
})
