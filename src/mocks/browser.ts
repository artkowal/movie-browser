import { setupWorker } from 'msw/browser';

// Brak domyślnych handlerów — requesty przechodzą do prawdziwego API.
// Handlery są dodawane dynamicznie przez worker.use() (np. demo błędu 401).
export const worker = setupWorker();
