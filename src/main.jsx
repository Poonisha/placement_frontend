import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext.jsx'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            className:
              '!text-sm !font-medium !text-[#1e293b] !bg-[#ffffff] !border !border-[#e2e8f0] !shadow-[0_4px_12px_rgba(15,23,42,0.08)]',
            error: {
              className:
                '!text-sm !font-medium !text-[#1e293b] !bg-[#ffffff] !border !border-[#e2e8f0] !shadow-[0_4px_12px_rgba(15,23,42,0.08)]',
            },
            success: {
              className:
                '!text-sm !font-medium !text-[#1e293b] !bg-[#ffffff] !border !border-[#e2e8f0] !shadow-[0_4px_12px_rgba(15,23,42,0.08)]',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
