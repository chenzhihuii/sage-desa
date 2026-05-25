import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ThemeProvider } from './context/ThemeContext'

const App = () => {
  return (
    <ThemeProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App
