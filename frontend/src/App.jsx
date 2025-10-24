import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

function App() {
  const [message, setMessage] = useState('')

  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE}/`)
        setMessage(response.data.message)
      } catch (error) {
        console.error('Error fetching data:', error)
        setMessage('Error connecting to backend')
      }
      try {
        // Fetch initial counter value
        const counterRes = await axios.get(`${API_BASE}/counter`)
        setCount(counterRes.data.count)
      } catch (error) {
        console.error('Error fetching counter:', error)
      }
    }
    fetchData()
  }, [])

  async function handleIncrement() {
    setLoading(true)
    try {
      console.log('Incrementing...')
      const res = await fetch(`${API_BASE}/counter/increment`, { method: 'POST' });
      const data = await res.json()
      setCount(data.count)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8">
                <Link to="/" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-gray-500">
                  Home
                </Link>
                <Link to="/about" className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-gray-500">
                  About
                </Link>
              </div>
              <div style={{ textAlign: 'center', marginTop: 50 }}>
                <h1>FastAPI + React Counter</h1>
                <p>Current count: <strong>{count}</strong></p>
                <button onClick={handleIncrement} disabled={loading}>
                  {loading ? 'Incrementing...' : 'Increment'}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Routes>
              <Route path="/" element={
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h1 className="text-2xl font-bold text-gray-900">FastAPI + React App</h1>
                    <p className="mt-4 text-gray-500">{message}</p>
                  </div>
                </div>
              } />
              <Route path="/about" element={
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h1 className="text-2xl font-bold text-gray-900">About</h1>
                    <p className="mt-4 text-gray-500">This is a starter template using FastAPI and React.</p>
                  </div>
                </div>
              } />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
