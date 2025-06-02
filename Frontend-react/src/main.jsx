import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import FormCard from './FormCIin.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FormCard />
  </StrictMode>,
)
