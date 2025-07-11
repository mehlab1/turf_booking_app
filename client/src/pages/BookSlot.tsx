import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, DollarSign, CreditCard, Smartphone } from 'lucide-react'
import { format } from 'date-fns'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

interface Slot {
  id: number
  start_time: string
  end_time: string
  turf: {
    id: number
    name: string
    price_per_slot: number
  }
}

const BookSlot: React.FC = () => {
  const { slotId } = useParams<{ slotId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [slot, setSlot] = useState<Slot | null>(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchSlotDetails()
  }, [slotId, user, navigate])

  const fetchSlotDetails = async () => {
    try {
      // Mock slot data - in real app, fetch from API
      const mockSlot = {
        id: parseInt(slotId!),
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        turf: {
          id: 1,
          name: 'Premium Turf 1',
          price_per_slot: 2000
        }
      }
      setSlot(mockSlot)
    } catch (error) {
      console.error('Error fetching slot details:', error)
      toast.error('Failed to load slot details')
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async () => {
    if (!slot) return

    setBooking(true)
    try {
      // Mock booking API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Booking confirmed! Check your dashboard for details.')
      navigate('/user/dashboard')
    } catch (error) {
      toast.error('Booking failed. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!slot) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Slot not found</h2>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const advanceAmount = slot.turf.price_per_slot / 2
  const startTime = new Date(slot.start_time)
  const endTime = new Date(slot.end_time)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">Confirm Booking</h1>
            <p className="text-primary-100">Review your booking details and complete payment</p>
          </div>

          <div className="p-8">
            {/* Booking Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Turf</span>
                  <span className="font-semibold text-gray-900">{slot.turf.name}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Date & Time</span>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {format(startTime, 'MMM dd, yyyy')}
                    </div>
                    <div className="text-sm text-gray-600">
                      {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-900">1 hour</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Price</span>
                    <span className="font-semibold text-gray-900">Rs. {slot.turf.price_per_slot}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-success-600 font-medium">Advance Payment (50%)</span>
                    <span className="font-bold text-success-600 text-lg">Rs. {advanceAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Instructions</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <Smartphone className="text-yellow-600 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-2">Mobile Payment</h3>
                    <p className="text-yellow-700 mb-4">
                      Send advance payment via Easypaisa or JazzCash to confirm your booking.
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-yellow-800">Account:</span>
                        <span className="text-yellow-700">03XX-XXXXXXX</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-yellow-800">Amount:</span>
                        <span className="text-yellow-700">Rs. {advanceAmount}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-yellow-800">Reference:</span>
                        <span className="text-yellow-700">Turf Booking #{slot.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 btn-secondary py-3 text-lg font-semibold"
              >
                Go Back
              </button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBooking}
                disabled={booking}
                className="flex-1 btn-success py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {booking ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <CreditCard size={20} />
                    <span>Confirm Booking</span>
                  </div>
                )}
              </motion.button>
            </div>

            <p className="text-sm text-gray-500 text-center mt-4">
              By confirming, you agree that you have made the advance payment as instructed above.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BookSlot