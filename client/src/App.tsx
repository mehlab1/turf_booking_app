import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { SocketProvider } from './contexts/SocketContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import TurfDetail from './pages/TurfDetail'
import BookSlot from './pages/BookSlot'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import AdminBookings from './pages/AdminBookings'
import AdminUpcoming from './pages/AdminUpcoming'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/turf/:id" element={<TurfDetail />} />
              <Route path="/book/:slotId" element={<BookSlot />} />
              
              {/* Protected User Routes */}
              <Route path="/user/dashboard" element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } />
              
              {/* Protected Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/bookings" element={
                <ProtectedRoute adminOnly>
                  <AdminBookings />
                </ProtectedRoute>
              } />
              <Route path="/admin/upcoming" element={
                <ProtectedRoute adminOnly>
                  <AdminUpcoming />
                </ProtectedRoute>
              } />
            </Routes>
          </Layout>
        </SocketProvider>
      </AuthProvider>
    </Router>
  )
}

export default App