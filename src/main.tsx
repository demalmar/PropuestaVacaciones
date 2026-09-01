import React from 'react'
import { createRoot } from 'react-dom/client'
import CalendarApp from '../index'

const rootEl = document.getElementById('root')
if (rootEl) {
  const root = createRoot(rootEl)
  root.render(<CalendarApp />)
}
