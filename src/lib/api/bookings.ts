import apiClient from "./client"
import type { EnrichedBooking, BookingStatus } from "@/types/booking"

export async function fetchAdminBookings(): Promise<EnrichedBooking[]> {
  const { data } = await apiClient.get<{ bookings: EnrichedBooking[] }>(
    "/api/bookings/admin-list",
  )
  return data.bookings
}

export async function updateBookingStatus(
  bookingId: string,
  newStatus: BookingStatus,
): Promise<void> {
  await apiClient.patch("/api/bookings/update-status", { bookingId, newStatus })
}

export async function resolveHeroImages(
  tourIds: string[],
): Promise<Record<string, string | null>> {
  const { data } = await apiClient.post<Record<string, string | null>>(
    "/api/bookings/resolve-heroes",
    { tourIds },
  )
  return data
}
