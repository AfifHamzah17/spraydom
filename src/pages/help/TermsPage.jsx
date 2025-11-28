import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaGavel, 
  FaBox, 
  FaBan, 
  FaExclamationTriangle,
  FaCreditCard,
  FaShippingFast,
  FaSyncAlt,
  FaUserCheck
} from 'react-icons/fa';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-green-500 hover:text-green-400 mb-4 transition-colors">
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">Terms & Conditions</h1>
          <p className="text-gray-400">Please read these terms and conditions carefully before using our service.</p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <section className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:bg-gray-800/40 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 flex items-center"><FaGavel className="mr-3 text-green-500"/> 1. Acceptance of Terms</h2>
            <p className="text-gray-300">By using the Spraydom website and products, users agree to all applicable Terms & Conditions.</p>
          </section>

          <section className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:bg-gray-800/40 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 flex items-center"><FaUserCheck className="mr-3 text-green-500"/> 2. Use of Services</h2>
            <p className="text-gray-300">Users must provide accurate information and refrain from misusing the service or engaging in unlawful activities.</p>
          </section>

          <section className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:bg-gray-800/40 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 flex items-center"><FaBox className="mr-3 text-green-500"/> 3. Product Availability</h2>
            <p className="text-gray-300">Aromatherapy spray availability may vary. Spraydom reserves the right to cancel orders in the event of out-of-stock items, with a full refund provided.</p>
          </section>

          <section className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:bg-gray-800/40 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 flex items-center"><FaCreditCard className="mr-3 text-green-500"/> 4. Payments</h2>
            <p className="text-gray-300">All transactions must be made using official payment methods listed on the website.</p>
          </section>

          <section className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:bg-gray-800/40 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 flex items-center"><FaShippingFast className="mr-3 text-green-500"/> 5. Shipping</h2>
            <p className="text-gray-300">Delivery times may vary based on location. Delays caused by courier services are beyond our control.</p>
          </section>

          <section className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:bg-gray-800/40 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 flex items-center"><FaBan className="mr-3 text-green-500"/> 6. Prohibited Activities</h2>
            <p className="mb-2 text-gray-300">Users are prohibited from:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
              <li>Misusing the sleep management system</li>
              <li>Engaging in hacking, spamming, or system abuse</li>
              <li>Duplicating or reselling Spraydom products without written permission</li>
            </ul>
          </section>

          <section className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:bg-gray-800/40 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 flex items-center"><FaExclamationTriangle className="mr-3 text-green-500"/> 7. Limitation of Liability</h2>
            <p className="text-gray-300">Spraydom is not responsible for sleep disturbances caused by underlying medical conditions. Results may vary among users.</p>
          </section>

          <section className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:bg-gray-800/40 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 flex items-center"><FaSyncAlt className="mr-3 text-green-500"/> 8. Changes to Terms & Conditions</h2>
            <p className="text-gray-300">Spraydom reserves the right to modify these Terms & Conditions at any time to improve service quality.</p>
          </section>
        </div>

        {/* Last Updated Note */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}