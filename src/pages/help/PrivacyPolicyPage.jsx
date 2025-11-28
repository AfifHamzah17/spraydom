import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaShieldAlt, FaDatabase, FaLock, FaUserCheck, FaSyncAlt } from 'react-icons/fa';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-green-500 hover:text-green-400 mb-4 transition-colors">
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-gray-400">Your privacy is important to us. This policy explains how we collect, use, and protect your data.</p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <section className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center"><FaDatabase className="mr-3 text-green-500"/> 1. Information Collection</h2>
            <p className="mb-2">We collect the following data to provide you with our services:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
              <li>Name, address, email, phone number</li>
              <li>Order and transaction details</li>
              <li>Sleep pattern data entered by users</li>
              <li>Technical information such as IP address and website activity</li>
            </ul>
          </section>

          <section className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center"><FaSyncAlt className="mr-3 text-green-500"/> 2. Use of Information</h2>
            <p className="mb-2">Collected data is used to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
              <li>Process orders and deliveries</li>
              <li>Provide sleep management services</li>
              <li>Improve platform performance</li>
              <li>Send updates, notifications, or promotional materials (optional)</li>
            </ul>
          </section>

          <section className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center"><FaShieldAlt className="mr-3 text-green-500"/> 3. Data Storage and Security</h2>
            <p className="text-gray-300">User data is stored using encrypted security systems and can only be accessed by authorized personnel.</p>
          </section>

          <section className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center"><FaLock className="mr-3 text-green-500"/> 4. Information Sharing with Third Parties</h2>
            <p className="text-gray-300">Spraydom does not sell or share user data with third parties, except when required for shipping, payment processing, or legal obligations.</p>
          </section>

          <section className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center"><FaUserCheck className="mr-3 text-green-500"/> 5. User Rights</h2>
            <p className="mb-2">Users have the right to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
              <li>Access and update their personal data</li>
              <li>Request account deletion</li>
              <li>Opt out of promotional communications</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}