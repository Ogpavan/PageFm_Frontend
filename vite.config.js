import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: 'https://page-fm-backend.vercel.app', // Replace with your desired base URL
});
