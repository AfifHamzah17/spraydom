import articles from '../data/articles.json';

function DailyRoutine() {
  return (
    <div>
      <h2>Artikel</h2>
      {articles.map((item, index) => (
        <div key={index}>
          <h3>{item.title}</h3>
          <p>{item.content}</p>
        </div>
      ))}

      <h2>Infografis</h2>
      <img src="/img/infografis1.png" alt="Infografis" />
    </div>
  );
}

export default DailyRoutine;

// FILE: src/pages/DailyRoutine.jsx
import React from 'react'


// export default function DailyRoutine() {
// const articles = [
// { id: 1, title: 'Cara Mengatasi Insomnia Tanpa Obat', excerpt: 'Rutin tidur, kurangi kafein, dan coba teknik pernapasan.' },
// { id: 2, title: 'Infografis: Langkah Relaksasi Sebelum Tidur', excerpt: 'Langkah sederhana yang bisa dilakukan setiap malam.' }
// ]
// return (
// <div className="max-w-5xl mx-auto px-4 py-8">
// <h2 className="text-2xl font-bold mb-4">Daily Routine - Pencegah Insomnia</h2>
// <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// {articles.map(a => (
// <article key={a.id} className="bg-white p-4 rounded-xl shadow">
// <h3 className="font-semibold">{a.title}</h3>
// <p className="text-sm text-gray-600 mt-2">{a.excerpt}</p>
// </article>
// ))}
// </div>
// </div>
// )
// }