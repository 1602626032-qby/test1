import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/test1/',   // 重点：这里要改成你的仓库名字，前后都要加斜杠
})


