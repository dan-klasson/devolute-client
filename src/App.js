import React from 'react'
import { CookiesProvider } from 'react-cookie';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from './header'

function App() {
  return (
    <CookiesProvider>
      <Header />
    </CookiesProvider>
  )
}

export default App
