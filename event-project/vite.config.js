import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/mediaweb_qr_sign_in/',
  server: {
    allowedHosts: true
  }
});
