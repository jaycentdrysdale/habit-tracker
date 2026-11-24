import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/bricolage-grotesque'
import App from './App'
import './styles.css'

// Keep the boot screen up until the bundled fonts are ready (so text doesn't
// visibly swap fonts mid-animation), but never longer than 700ms.
const fontsReady = Promise.race([
  Promise.all([
    document.fonts?.load('800 16px "Bricolage Grotesque Variable"'),
    document.fonts?.load('400 16px "Inter Variable"'),
  ]),
  new Promise((r) => setTimeout(r, 700)),
])

fontsReady.finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
