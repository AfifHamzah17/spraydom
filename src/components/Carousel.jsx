// src/components/carousel.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Carousel({ items = [] }) {
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      loop={true}
      className="h-[70vh]"
    >
      {items.map((it) => (
        <SwiperSlide key={it.id} className="relative">
          <div className="absolute inset-0">
            <img 
              src={it.cover} 
              alt={it.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{it.title}</h2>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl">{it.subtitle}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}