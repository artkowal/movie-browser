import Plausible from 'plausible-tracker';

// Plausible: privacy-first analytics — brak cookies, brak fingerprinting,
// zgodny z RODO out-of-the-box (anonimizacja IP po stronie serwera Plausible)
const plausible = Plausible({
  domain: 'localhost',
  trackLocalhost: true,
});

// Rejestruje pageview przy starcie i nasłuchuje history.pushState (SPA)
// RODO: zbierany jest tylko URL strony — bez danych osobowych, bez identyfikatorów użytkownika
plausible.enableAutoPageviews();

// Ręczny pageview dla nawigacji tab-based (app nie używa React Router)
// RODO: url zawiera wyłącznie nazwę zakładki, nie dane wpisane przez użytkownika
export function trackPageview(url: string) {
  plausible.trackPageview({ url });
}

// props: tylko opisowe klucze kontekstu zdarzenia (zasada minimalizacji danych, art. 5 RODO)
// Nigdy nie przekazuj treści wpisanej przez użytkownika ani danych osobowych
export function trackEvent(name: string, props?: Record<string, string>) {
  plausible.trackEvent(name, { props });
}
