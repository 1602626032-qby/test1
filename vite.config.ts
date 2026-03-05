import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'  // 新增：引入 path 模块

export default defineConfig({
  plugins: [react()],
  base: '/test1/',       // 确保这里是你仓库的名字
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // 关键：设置 @ 指向 src
    },
  },
})