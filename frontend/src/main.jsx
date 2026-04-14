import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: '#ffffff',
          color: '#022c22',
          border: '1px solid #d1fae5',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '0.875rem',
          fontFamily: '"Inter", system-ui, sans-serif',
          boxShadow: '0 8px 32px rgba(6, 78, 59, 0.12)',
        },
        success: {
          iconTheme: { primary: '#22c55e', secondary: '#ffffff' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
        },
        loading: {
          iconTheme: { primary: '#22c55e', secondary: '#ffffff' },
        },
      }}
    />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
