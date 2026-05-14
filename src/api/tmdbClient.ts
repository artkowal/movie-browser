import axios from 'axios';

export const tmdbClient = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL,
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: 'pl-PL',
  },
});

// Wyciąga czytelny komunikat z odpowiedzi TMDB (np. "Invalid API key.")
tmdbClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const msg: string = error.response?.data?.status_message ?? error.message;
    return Promise.reject(new Error(msg));
  }
);
