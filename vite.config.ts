import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3001,
        host: '0.0.0.0',
        allowedHosts: ["code.wyvernp.id.vn"]
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          '@components': path.resolve(__dirname, 'src/components'),
          '@assets': path.resolve(__dirname, 'src/assets'),
          '@services': path.resolve(__dirname, 'src/services'),
          '@hooks': path.resolve(__dirname, 'src/hooks'),
          '@pages': path.resolve(__dirname, 'src/pages'),
          '@lib': path.resolve(__dirname, 'src/lib'),
          '@base': path.resolve(__dirname, 'src/base'),
          '@types': path.resolve(__dirname, 'src/types'),
        }
      },
    };
});
