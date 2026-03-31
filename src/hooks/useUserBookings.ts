"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useMockMode } from "@/hooks/useMockMode"
import { subscribeToUserBookings } from "@/lib/services/bookings.service"
import { mockBookings } from "@/mocks"
import type { Booking } from "@/types/booking"

export function useUserBookings(maxResults?: number) {
  const { user } = useAuth()
  const { isMockMode } = useMockMode()

  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isMockMode) {
      setBookings(mockBookings)
      setLoading(false)
      return
    }

    if (!user) {
      setBookings([])
      setLoading(false)
      return
    }

    const unsub = subscribeToUserBookings(
      user.uid,
      (items) => {
        setBookings(items)
        setLoading(false)
      },
      () => setLoading(false),
      maxResults,
    )

    return unsub
  }, [user, isMockMode, maxResults])

  return { bookings, loading }
}
