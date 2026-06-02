import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, CssBaseline } from '@mui/material'
import App from './App'
import { lightTheme, darkTheme } from '@/shared/theme'
import { useThemeStore } from '@/shared/stores/themeStore'
import { useThemeColorStore } from '@/shared/stores/themeColorStore'
import './index.css'
import '@/shared/i18n'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function Root() {
  const mode = useThemeStore((state) => state.mode)
  const color = useThemeColorStore((state) => state.color)
  const currentTheme = mode === 'dark' ? darkTheme(color) : lightTheme(color)

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={currentTheme}>
          <CssBaseline />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<Root />)
