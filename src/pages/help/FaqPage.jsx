import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaArrowLeft } from 'react-icons/fa';

const faqs = [
  {
    question: "What is Spraydom?",
    answer: "Spraydom is an innovative web-based sleep management system combined with an aromatherapy spray designed to help reduce insomnia symptoms."
  },
  {
    question: "How does the aromatherapy spray help improve sleep?",
    answer: "The essential oils in Spraydom are made from natural ingredients sourced from North Sumatra plants. These ingredients provide relaxation, calm the mind, reduce anxiety, and improve overall sleep quality."
  },
  {
    question: "Is Spraydom safe for daily use?",
    answer: "Yes. The product is formulated from natural ingredients and has undergone basic safety testing, making it suitable for daily use."
  },
  {
    question: "Do I need to use the website to benefit from Spraydom?",
    answer: "For best results, it is recommended to use both components together: the aromatherapy spray and the sleep management features on the website."
  },
  {
    question: "How long does it take to feel the effects?",
    answer: "The relaxation effect usually begins within 5–15 minutes. Noticeable improvements in sleep quality can appear within 3–7 days of consistent use."
  },
  {
    question: "Is there an age restriction for use?",
    answer: "The product is suitable for individuals aged 13 and above. Children, pregnant women, or individuals with certain allergies should consult a professional beforehand."
  },
  {
    question: "What should I do if my product arrives damaged?",
    answer: "Please contact customer service via the WhatsApp number provided within 24 hours, and include photos/videos of the damaged product for replacement."
  },
  {
    question: "Is my data safe when using the Spraydom website?",
    answer: "Yes. User data is stored securely using encryption and is not shared with third parties without consent."
  }
];

export default function FaqPage() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-green-500 hover:text-green-400 mb-4 transition-colors">
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-400">Find answers to common questions about Spraydom.</p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 transition-all duration-300">
              <button
                className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-800/70 transition-colors"
                onClick={() => toggleAccordion(index)}
              >
                <span className="font-semibold text-lg">{faq.question}</span>
                <FaChevronDown className={`text-green-500 transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`} />
              </button>
              <div className={`px-5 overflow-hidden transition-all duration-500 ease-in-out ${activeIndex === index ? 'max-h-96 py-5' : 'max-h-0'}`}>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}