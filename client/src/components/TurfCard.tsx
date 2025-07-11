import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, DollarSign, Clock } from 'lucide-react'

interface Turf {
  id: number
  name: string
  location: string
  price_per_slot: number
}

interface TurfCardProps {
  turf: Turf
  index: number
}

const TurfCard: React.FC<TurfCardProps> = ({ turf, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="card group cursor-pointer"
    >
      <Link to={`/turf/${turf.id}`}>
        <div className="relative overflow-hidden rounded-lg mb-4">
          <img
            src={`https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=400`}
            alt={turf.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {turf.name}
          </h3>
          
          <div className="flex items-center text-gray-600">
            <MapPin size={16} className="mr-2" />
            <span className="text-sm">{turf.location}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-success-600">
              <DollarSign size={16} className="mr-1" />
              <span className="font-semibold">Rs. {turf.price_per_slot}</span>
              <span className="text-gray-500 text-sm ml-1">per slot</span>
            </div>
            
            <div className="flex items-center text-gray-500">
              <Clock size={16} className="mr-1" />
              <span className="text-sm">1 hour</span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-primary mt-4"
          >
            View Available Slots
          </motion.button>
        </div>
      </Link>
    </motion.div>
  )
}

export default TurfCard