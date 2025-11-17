// FILE: src/App.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Audio from './pages/Audio'
import DailyRoutine from './pages/DailyRoutine'
import MiniGames from './pages/MiniGames'
import Video from './pages/Video'
import Product from './pages/Product'
import InsomniaCheck from './pages/InsomniaCheck'
import Sleeptube from './pages/Sleeptube'
import VideoDetail from './pages/VideoDetail'
import Dreamlog from './pages/Dreamlog'
import DreamlogDetail from './pages/DreamlogDetail'
import AddDreamlog from './pages/AddDreamlog'
import AddVideo from './pages/AddVideo'
// Import product management components
import Products from './pages/Products'
import AddProduct from './pages/AddProduct'
import EditProduct from './pages/EditProduct'
// Import audio management components
import AddAudio from './pages/AddAudio'
import EditAudio from './pages/EditAudio'
import LoginView from './pages/LoginView' 
import RegisterView from './pages/RegisterView'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />
}

// Admin Route component
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth()
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }
  
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/" />
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen font-sans text-white bg-gradient-to-b from-gray-900 to-black">
        <Navbar />
        {/* Tambahkan padding-top untuk memberikan ruang di bawah Navbar */}
        {/* Navbar memiliki tinggi h-16 (64px) + padding py-2 atau py-4 (8px atau 16px) */}
        {/* Total tinggi sekitar 80px atau 96px, jadi kita gunakan pt-24 (96px) untuk amannya */}
        <main className="pt-24 pb-32">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/audio" element={<Audio />} />
            <Route path="/daily-routine" element={<DailyRoutine />} />
            <Route path="/mini-games" element={<MiniGames />} />
            <Route path="/video" element={<Video />} />
            <Route path="/product" element={<Product />} />
            <Route path="/insomnia-check" element={<InsomniaCheck />} />
            <Route path="/sleeptube" element={<Sleeptube />} />
            <Route path="/sleeptube/:id" element={<VideoDetail />} />
            <Route path="/dreamlog" element={<Dreamlog />} />
            <Route path="/dreamlog/:id" element={<DreamlogDetail />} />
            <Route path="/login" element={<LoginView />} />
            <Route path="/register" element={<RegisterView />} />
            
            {/* Product management routes */}
            <Route path="/products" element={<Products />} />
            <Route path="/products/add" element={
              <AdminRoute>
                <AddProduct />
              </AdminRoute>
            } />
            <Route path="/products/edit/:id" element={
              <AdminRoute>
                <EditProduct />
              </AdminRoute>
            } />
            
            {/* Audio management routes */}
            <Route path="/audios/add" element={
              <AdminRoute>
                <AddAudio />
              </AdminRoute>
            } />
            <Route path="/audios/edit/:id" element={
              <AdminRoute>
                <EditAudio />
              </AdminRoute>
            } />
            
            {/* Admin routes for other content */}
            <Route path="/admin/dreamlog-create" element={
              <AdminRoute>
                <AddDreamlog />
              </AdminRoute>
            } />
            <Route path="/admin/product-create" element={
              <AdminRoute>
                <AddProduct />
              </AdminRoute>
            } />
            <Route path="/admin/audio-create" element={
              <AdminRoute>
                <AddAudio />
              </AdminRoute>
            } />
            <Route path="/admin/video-create" element={
              <AdminRoute>
                <AddVideo />
              </AdminRoute>
            } />
          </Routes>
        </main>
        <BottomNav />
        <Footer />
        <ToastContainer position="bottom-right" />
      </div>
    </AuthProvider>
  )
}

export default App