import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: mode === 'production' ? './' : '/', // 生产环境使用相对路径
      server: {
        port: 3000,
        host: '0.0.0.0', // 允许外部访问
        strictPort: true, // 如果端口被占用则失败，不尝试其他端口
        open: false, // 不自动打开浏览器
        cors: true, // 启用CORS
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
