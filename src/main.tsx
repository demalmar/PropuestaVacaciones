import React from 'react'
import { createRoot } from 'react-dom/client'
import 'bulma/css/bulma.min.css'
import './index.css'
import CalendarApp from '../index.tsx'

const rootEl = document.getElementById('root')
if (rootEl) {
  const root = createRoot(rootEl)
  root.render(<CalendarApp />)
}
