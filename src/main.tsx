import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Polyfill for crypto and Buffer to avoid xlsx issues
const globalAny = globalThis as any;
if (typeof globalAny.global === 'undefined') {
  globalAny.global = globalThis;
}

if (typeof globalAny.Buffer === 'undefined') {
  globalAny.Buffer = {};
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
