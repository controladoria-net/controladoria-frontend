import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { AppStateProvider } from './contexts/AppStateContext';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Elemento root não encontrado');
}

createRoot(container).render(
  <StrictMode>
    <AppStateProvider>
      <RouterProvider router={router} />
    </AppStateProvider>
  </StrictMode>,
);
