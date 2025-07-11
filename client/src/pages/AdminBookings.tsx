import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, DollarSign, CheckCircle, XCircle, User } from 'lucide-react'
import { format } from 'date-fns'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

interface Booking {
  id: number
  booking: {
    id: number
    deposit_paid: boolean
    full_paid: boolean
    booked_at: string
  }
  slot: {
    id: number
    start_time: string
    end_time: string
  }
  turf: {
    id: number
    name: string
    location: string
    price_per_slot: number
  }
  user: {
    id: number
    email: string
  }
}

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid'>('all')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      // Mock bookings data - in real app, fetch from API
      const mockBookings: Booking[] = [
        {
          id: 1,
          booking: {
            id: 1,
            deposit_paid: true,
            full_paid: false,
            booked_at: new Date().toISOString()
          },
          slot: {
            id: 1,
            start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            end_time: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString()
          },
          turf: {
            id: 1,
            name: 'Premium Turf 1',
            location: 'Karachi, Pakistan',
            price_per_slot: 2000
          },
          user: {
            id: 1,
            email: 'user@example.com'
          }
        },
        {
          id: 2,
          booking: {
            id: 2,
            deposit_paid: true,
            full_paid: true,
            booked_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          },
          slot: {
            id: 2,
            start_time: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
            end_time: new Date(Date.now() + 49 * 60 * 60 * 1000).toISOString()
          },
          turf: {
            id: 2,
            name: 'Premium Turf 2',
            location: 'Lahore, Pakistan',
            price_per_slot: 2500
          },
          user: {
            id: 2,
            email: 'customer@example.com'
          }
        }
      ]
      setBookings(mockBookings)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkPaid = async (bookingId: number) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setBookings(prev => prev.map(booking => 
        booking.booking.id === bookingId 
          ? { ...booking, booking: { ...booking.booking, full_paid: true } }
          : booking
      ))
      
      toast.success('Booking marked as fully paid!')
    } catch (error) {
      toast.error('Failed to update payment status')
    }
  }

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'pending') return !booking.booking.full_paid
    if (filter === 'paid') return booking.booking.full_paid
    return true
  })

  if (loading) {
    return <LoadingSpinner text="Loading bookings..." />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Bookings</h1>
          <p className="text-gray-600">Manage all turf bookings and payment status</p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Bookings', count: bookings.length },
                { key: 'pending', label: 'Pending Payment', count: bookings.filter(b => !b.booking.full_paid).length },
                { key: 'paid', label: 'Fully Paid', count: bookings.filter(b => b.booking.full_paid).length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Bookings List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600">No bookings match the selected filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.turf.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {booking.booking.deposit_paid ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                              <CheckCircle size={12} className="mr-1" />
                              Deposit Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircle size={12} className="mr-1" />
                              No Deposit
                            </span>
                          )}
                          
                          {booking.booking.full_paid ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                              <CheckCircle size={12} className="mr-1" />
                              Fully Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Clock size={12} className="mr-1" />
                              Pending Full Payment
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <User size={16} className="mr-2" />
                          <span>{booking.user.email}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-2" />
                          <span>{booking.turf.location}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock size={16} className="mr-2" />
                          <span>
                            {format(new Date(booking.slot.start_time), 'MMM dd, h:mm a')}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <DollarSign size={16} className="mr-2" />
                          <span>Rs. {booking.turf.price_per_slot}</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Booked on: {format(new Date(booking.booking.booked_at), 'MMM dd, yyyy h:mm a')}
                      </div>
                    </div>
                    
                    {!booking.booking.full_paid && (
                      <div className="ml-6">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleMarkPaid(booking.booking.id)}
                          className="btn-success text-sm px-4 py-2"
                        >
                          Mark as Fully Paid
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AdminBookings