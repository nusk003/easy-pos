import { AppContent, TitleBar } from '@src/components/shell';
import { theme } from '@src/components/theme';
import '@src/styles/index.scss';
import React from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { Slide, toast } from 'react-toastify';
import { ThemeProvider } from 'styled-components';
import { PersistGate as ZPersistGate } from 'zustand-persist';
import { __electron__ } from './constants';

toast.configure({
  position: 'bottom-center',
  autoClose: 5000,
  hideProgressBar: true,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  draggable: true,
  pauseOnHover: true,
  transition: Slide,
});

const Router: typeof BrowserRouter = __electron__
  ? MemoryRouter
  : BrowserRouter;

export const App: React.FC = () => {
  return (
    <Router>
      <ZPersistGate>
        <ThemeProvider theme={theme}>
          <TitleBar />
          <AppContent />
        </ThemeProvider>
      </ZPersistGate>
    </Router>
  );
};
