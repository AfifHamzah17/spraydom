// FILE: src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import TopHeader from './components/TopHeader'
import BottomNav from './components/BottomNav'
import Footer from './components/Footer'

import Home from './pages/Home'
import Audio from './pages/Audio'
import DailyRoutine from './pages/DailyRoutine'
import MiniGames from './pages/MiniGames'
import Video from './pages/Video'
import Product from './pages/Product'
import InsomniaCheck from './pages/InsomniaCheck';
import Sleeptube from './pages/Sleeptube'; 
import Dreamlog from './pages/Dreamlog'; 

export default function App() {
  return (
    <div className="min-h-screen font-sans text-white bg-gradient-to-b from-gray-900 to-black">
      <TopHeader />
      <main className="pt-4 pb-32">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/audio" element={<Audio />} />
          <Route path="/daily-routine" element={<DailyRoutine />} />
          <Route path="/mini-games" element={<MiniGames />} />
          <Route path="/video" element={<Video />} />
          <Route path="/product" element={<Product />} />
          <Route path="/insomnia-check" element={<InsomniaCheck />} /> 
          <Route path="/sleeptube" element={<Sleeptube />} />
          <Route path="/dreamlog" element={<Dreamlog />} />
        </Routes>
      </main>
      <BottomNav />
      <Footer />
    </div>
  )
}