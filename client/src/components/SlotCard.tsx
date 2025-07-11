import React from 'react'
import { motion } from 'framer-motion'
import { Clock, CheckCircle, XCircle } from 'lucide-react'
import { format } from 'date-fns'

interface Slot {
  id: number
  start: string
  booked: boolean
}

interface SlotCardProps {
  slot: Slot
  onBook: (slotId: number) => void
  index: number
}

const SlotCard: React.FC<SlotCardProps> = ({ slot, onBook, index }) => {
  const startTime = new Date(slot.start)
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // Add 1 hour

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
        slot.booked
          ? 'border-red-200 bg-red-50'
          : 'border-success-200 bg-success-50 hover:border-success-400 hover:shadow-md cursor-pointer'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${slot.booked ? 'bg-red-100' : 'bg-success-100'}`}>
            <Clock size={20} className={slot.booked ? 'text-red-600' : 'text-success-600'} />
          </div>
          
          <div>
            <p className="font-semibold text-gray-900">
              {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
            </p>
            <p className="text-sm text-gray-600">
              {format(startTime, 'MMM dd, yyyy')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {slot.booked ? (
            <>
              <XCircle size={20} className="text-red-600" />
              <span className="text-red-600 font-medium">Booked</span>
            </>
          ) : (
            <>
              <CheckCircle size={20} className="text-success-600" />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onBook(slot.id)}
                className="btn-success text-sm px-3 py-1"
              >
                Book Now
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default SlotCard