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
import InsomniaCheck from './pages/InsomniaCheck'
import Sleeptube from './pages/Sleeptube'
import VideoDetail from './pages/VideoDetail'
import Dreamlog from './pages/Dreamlog'
import DreamlogDetail from './pages/DreamlogDetail'
import AddDreamlog from './pages/AddDreamlog'
import AddVideo from './pages/AddVideo'

// PERBAIKAN: Sesuaikan impor dengan nama file yang benar
import Product from './pages/Product' // Diubah dari 'Products'
import ProductDetail from './pages/ProductDetail' // Diubah dari 'ProductsDetail'
import AddProduct from './pages/AddProduct'
import EditProduct from './pages/EditProduct'

// Import audio management components
import AddAudio from './pages/AddAudio'
import EditAudio from './pages/EditAudio'
import LoginView from './pages/LoginView' 
import RegisterView from './pages/RegisterView'
import FavoriteProducts from './pages/FavoriteProducts'

// Import help pages
import FaqPage from './pages/help/FaqPage'
import OrderingProcedurePage from './pages/help/OrderingProcedurePage'
import PrivacyPolicyPage from './pages/help/PrivacyPolicyPage'
import TermsPage from './pages/help/TermsPage'

// TAMBAHKAN import react-hot-toast
import { Toaster } from 'react-hot-toast'

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
        <main className="pt-24 pb-32">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/audio" element={<Audio />} />
            <Route path="/daily-routine" element={<DailyRoutine />} />
            <Route path="/mini-games" element={<MiniGames />} />
            <Route path="/video" element={<Video />} />
            <Route path="/insomnia-check" element={<InsomniaCheck />} />
            <Route path="/sleeptube" element={<Sleeptube />} />
            <Route path="/sleeptube/:id" element={<VideoDetail />} />
            
            {/* PERBAIKAN: Gunakan komponen yang sudah diimpor dengan benar */}
            <Route path="/products" element={<Product />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            
            <Route path="/dreamlog" element={<Dreamlog />} />
            <Route path="/dreamlog/:id" element={<DreamlogDetail />} />
            <Route path="/login" element={<LoginView />} />
            <Route path="/register" element={<RegisterView />} />
            
            {/* Favorites route - public access */}
            <Route path="/favorites" element={<FavoriteProducts />} />
            
            {/* Help pages routes */}
            <Route path="/help/faq" element={<FaqPage />} />
            <Route path="/help/ordering-procedure" element={<OrderingProcedurePage />} />
            <Route path="/help/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/help/terms" element={<TermsPage />} />
            
            {/* Product management routes */}
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
        
        {/* GANTI ToastContainer dengan Toaster dari react-hot-toast */}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#374151',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </AuthProvider>
  )
}

export default App