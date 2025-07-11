import React from 'react'
import { motion } from 'framer-motion'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <motion.h3 
              className="text-lg font-semibold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              🏟️ TurfBook
            </motion.h3>
            <p className="text-gray-300">
              Your premier destination for turf booking. Easy, fast, and reliable.
            </p>
          </div>
          
          <div>
            <motion.h4 
              className="text-md font-semibold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Quick Links
            </motion.h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">Login</a></li>
              <li><a href="/register" className="hover:text-white transition-colors">Register</a></li>
            </ul>
          </div>
          
          <div>
            <motion.h4 
              className="text-md font-semibold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Contact Info
            </motion.h4>
            <div className="text-gray-300 space-y-2">
              <p>📞 +92 300 1234567</p>
              <p>📧 info@turfbook.com</p>
              <p>📍 Karachi, Pakistan</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 TurfBook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer