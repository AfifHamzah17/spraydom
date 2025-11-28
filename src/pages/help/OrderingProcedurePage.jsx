import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaWhatsapp, FaTruck, FaCreditCard, FaHome, FaUserEdit, FaShoppingCart } from 'react-icons/fa';

const steps = [
  { icon: FaHome, title: "Visit the Spraydom Website", content: "Access the official Spraydom platform to explore product information, sleep management features, and available package options." },
  { icon: FaShoppingCart, title: "Choose Your Aromatherapy Spray", content: "Select your preferred aroma variant and quantity. Detailed information on benefits and composition is available on the product page." },
  { icon: FaWhatsapp, title: "Click the Order Button", content: "Click \"Order\" to proceed with your purchase via WhatsApp." },
  { icon: FaUserEdit, title: "Fill in Personal and Shipping Information", content: "Provide your full name, address, and an active phone number to ensure smooth processing." },
  { icon: FaCreditCard, title: "Select Payment Method", content: "Spraydom accepts payments via bank transfer, e-wallet, and virtual account." },
  { icon: FaCheckCircle, title: "Payment Confirmation", content: "After completing payment, upload proof of payment or wait for the system’s automatic verification." },
  { icon: FaTruck, title: "Order Processing", content: "Your order will be processed and shipped within 1–3 business days. You will receive a tracking number via WhatsApp." }
];

// Enhanced Intersection Observer Hook with animation trigger tracking
const useOnScreen = (ref) => {
  const [isIntersecting, setIntersecting] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // Only trigger the animation once
      if (entry.isIntersecting && !hasAnimated) {
        setIntersecting(true);
        setHasAnimated(true);
      }
    }, { threshold: 0.2 }); // Trigger when 20% of the element is visible

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, hasAnimated]);

  return isIntersecting;
};

export default function OrderingProcedurePage() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <Link to="/" className="inline-flex items-center text-green-500 hover:text-green-400 mb-4 transition-colors">
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">How to Order</h1>
          <p className="text-gray-400">Follow these simple steps to get your Spraydom product.</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-700"></div>

          {steps.map((step, index) => {
            const ref = useRef();
            const isVisible = useOnScreen(ref);
            const isLeft = index % 2 === 0;

            return (
              <div
                key={index}
                ref={ref}
                className={`flex items-center mb-10 w-full ${
                  isLeft ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`w-5/12 bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 transform transition-all duration-700 ${
                    isVisible
                      ? 'translate-x-0 opacity-100'
                      : isLeft
                      ? '-translate-x-full opacity-0'
                      : 'translate-x-full opacity-0'
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <step.icon className="text-green-500 text-2xl mr-3" />
                    <h3 className="text-xl font-bold">{step.title}</h3>
                  </div>
                  <p className="text-gray-300">{step.content}</p>
                </div>

                {/* Center Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-900 flex items-center justify-center">
                  <span className="text-black font-bold">{index + 1}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}