import React from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  return <h1>OctoFit Tracker</h1>
}

const container = document.getElementById('root')!
createRoot(container).render(<App />)
