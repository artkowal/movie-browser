import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { FavouritesProvider } from './context/FavouritesContext.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

async function enableMocking() {
  const hasApiKey = !!import.meta.env.VITE_TMDB_API_KEY;

  // Tryb z kluczem + produkcja → bez MSW, requesty idą prosto do TMDB
  if (hasApiKey && !import.meta.env.DEV) return;

  const { worker } = await import('./mocks/browser');

  if (!hasApiKey) {
    // Brak klucza (GitHub Pages, demo) → załaduj pełne mocki żeby app działała
    const { handlers } = await import('./mocks/handlers');
    worker.use(...handlers);
  }
  // Klucz jest + DEV → worker startuje bez handlerów (bypass do TMDB, toggle 401 działa)

  return worker.start({
    onUnhandledRequest: 'bypass',
    // BASE_URL uwzględnia podkatalog na GitHub Pages (np. /movie-browser/)
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <FavouritesProvider>
          <App />
        </FavouritesProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>
  );
});
