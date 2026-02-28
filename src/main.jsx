import React from 'react'
import ReactDOM from 'react-dom/client'
// Agrégale la extensión .jsx para que Vite no se pierda en la ruta nueva
import App from './router/routes.jsx' 
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)