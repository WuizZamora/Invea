import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import FormCard from './FormCIin.jsx'
import Header from './Header.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header />
    <main style={{ paddingTop: '70px' }}>
      <FormCard />
    </main>
  </StrictMode>,
)
