import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true // 모든 외부 접속(ngrok 포함)을 허용한다는 뜻입니다.
  }
})
