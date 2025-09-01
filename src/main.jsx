import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@emotion/react'
import theme from './Theme.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/Projeto-kaio">
    <ThemeProvider theme={theme}>
       <App />
    </ThemeProvider>  
    </BrowserRouter>
  </StrictMode>,
)
