import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, User, Phone, Mail } from 'lucide-react'
import { format, isToday, isTomorrow, addDays } from 'date-fns'
import LoadingSpinner from '../components/LoadingSpinner'

interface UpcomingBooking {
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

const AdminUpcoming: React.FC = () => {
  const [bookings, setBookings] = useState<UpcomingBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'today' | 'tomorrow' | 'week'>('all')

  useEffect(() => {
    fetchUpcomingBookings()
  }, [])

  const fetchUpcomingBookings = async () => {
    try {
      // Mock upcoming bookings data - in real app, fetch from API
      const mockBookings: UpcomingBooking[] = [
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
            start_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
            end_time: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString()
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
            booked_at: new Date().toISOString()
          },
          slot: {
            id: 2,
            start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
            end_time: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString()
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
      console.error('Error fetching upcoming bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    return format(date, 'MMM dd, yyyy')
  }

  const filteredBookings = bookings.filter(booking => {
    const slotDate = new Date(booking.slot.start_time)
    const now = new Date()
    
    switch (filter) {
      case 'today':
        return isToday(slotDate)
      case 'tomorrow':
        return isTomorrow(slotDate)
      case 'week':
        return slotDate <= addDays(now, 7)
      default:
        return true
    }
  })

  if (loading) {
    return <LoadingSpinner text="Loading upcoming bookings..." />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Bookings</h1>
          <p className="text-gray-600">View and manage upcoming turf sessions</p>
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
                { key: 'all', label: 'All Upcoming' },
                { key: 'today', label: 'Today' },
                { key: 'tomorrow', label: 'Tomorrow' },
                { key: 'week', label: 'This Week' }
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
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Bookings Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming bookings</h3>
              <p className="text-gray-600">No bookings scheduled for the selected time period.</p>
            </div>
          ) : (
            filteredBookings.map((booking, index) => {
              const slotDate = new Date(booking.slot.start_time)
              const endTime = new Date(booking.slot.end_time)
              
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Date and Time Header */}
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="bg-primary-100 p-2 rounded-lg">
                          <Calendar className="text-primary-600" size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {getDateLabel(slotDate)}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {format(slotDate, 'h:mm a')} - {format(endTime, 'h:mm a')}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {booking.booking.full_paid ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                              Fully Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending Payment
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Turf Details</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <MapPin size={16} className="mr-2" />
                              <span>{booking.turf.name}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock size={16} className="mr-2" />
                              <span>{booking.turf.location}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="mr-2">💰</span>
                              <span>Rs. {booking.turf.price_per_slot}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Customer Details</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <User size={16} className="mr-2" />
                              <span>Customer #{booking.user.id}</span>
                            </div>
                            <div className="flex items-center">
                              <Mail size={16} className="mr-2" />
                              <span>{booking.user.email}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone size={16} className="mr-2" />
                              <span>+92 300 1234567</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Time until booking */}
                    <div className="ml-6 text-right">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Starts in</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {Math.ceil((slotDate.getTime() - Date.now()) / (1000 * 60 * 60))} hours
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AdminUpcoming