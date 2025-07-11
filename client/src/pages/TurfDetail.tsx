import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, DollarSign, Clock, Wifi, Car, Users } from 'lucide-react'
import SlotCard from '../components/SlotCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useSocket } from '../contexts/SocketContext'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

interface Turf {
  id: number
  name: string
  location: string
  price_per_slot: number
}

interface Slot {
  id: number
  start: string
  booked: boolean
}

const TurfDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { socket } = useSocket()
  const { user } = useAuth()
  const [turf, setTurf] = useState<Turf | null>(null)
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchTurfDetails()
      requestSlots()
    }
  }, [id])

  useEffect(() => {
    if (socket) {
      socket.on('update_slots', handleSlotsUpdate)
      socket.on('booking_success', handleBookingSuccess)
      socket.on('booking_error', handleBookingError)

      return () => {
        socket.off('update_slots')
        socket.off('booking_success')
        socket.off('booking_error')
      }
    }
  }, [socket])

  const fetchTurfDetails = async () => {
    try {
      // Mock turf data - in real app, fetch from API
      const mockTurf = {
        id: parseInt(id!),
        name: `Premium Turf ${id}`,
        location: 'Karachi, Pakistan',
        price_per_slot: 2000
      }
      setTurf(mockTurf)
    } catch (error) {
      console.error('Error fetching turf details:', error)
      toast.error('Failed to load turf details')
    } finally {
      setLoading(false)
    }
  }

  const requestSlots = () => {
    if (socket && id) {
      socket.emit('request_slots', { turf_id: parseInt(id) })
    }
  }

  const handleSlotsUpdate = (slotsData: Slot[]) => {
    setSlots(slotsData)
  }

  const handleBookingSuccess = (data: { slot_id: number }) => {
    toast.success('Slot booked successfully!')
    requestSlots() // Refresh slots
  }

  const handleBookingError = (data: { msg: string }) => {
    toast.error(data.msg)
  }

  const handleBookSlot = (slotId: number) => {
    if (!user) {
      toast.error('Please login to book a slot')
      navigate('/login')
      return
    }

    navigate(`/book/${slotId}`)
  }

  if (loading) {
    return <LoadingSpinner text="Loading turf details..." />
  }

  if (!turf) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Turf not found</h2>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt={turf.name}
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{turf.name}</h1>
            <div className="flex items-center space-x-6 text-lg">
              <div className="flex items-center">
                <MapPin size={20} className="mr-2" />
                <span>{turf.location}</span>
              </div>
              <div className="flex items-center">
                <DollarSign size={20} className="mr-2" />
                <span>Rs. {turf.price_per_slot} per slot</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="card mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Wifi size={20} className="text-primary-600" />
                  <span>Free WiFi</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <Car size={20} className="text-primary-600" />
                  <span>Parking</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <Users size={20} className="text-primary-600" />
                  <span>Changing Room</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <Clock size={20} className="text-primary-600" />
                  <span>24/7 Available</span>
                </div>
              </div>
            </motion.div>

            {/* Available Slots */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Available Slots</h2>
                <button
                  onClick={requestSlots}
                  className="btn-secondary text-sm"
                >
                  Refresh
                </button>
              </div>

              {slots.length === 0 ? (
                <div className="text-center py-8">
                  <Clock size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No slots available at the moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {slots.map((slot, index) => (
                    <SlotCard
                      key={slot.id}
                      slot={slot}
                      onBook={handleBookSlot}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card sticky top-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Information</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Price per slot</span>
                  <span className="font-semibold text-gray-900">Rs. {turf.price_per_slot}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Advance payment</span>
                  <span className="font-semibold text-success-600">50% required</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-900">1 hour</span>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-yellow-800 mb-2">Payment Instructions</h4>
                  <p className="text-sm text-yellow-700">
                    Send 50% advance payment via Easypaisa or JazzCash to confirm your booking.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TurfDetail