import type { PickupDetails } from "@/types/booking"

/**
 * Validate whether all required booking fields are present.
 */
export function isBookingValid(params: {
  tourDate: string
  guests: number
  arrivingByAir: boolean | null
  pickup: PickupDetails | null
}): boolean {
  if (!params.tourDate || params.guests < 1 || params.arrivingByAir === null) {
    return false
  }
  if (!params.pickup) return false
  return isPickupValid(params.pickup)
}

export function isPickupValid(pickup: PickupDetails): boolean {
  switch (pickup.type) {
    case "flight":
      return !!(
        pickup.departureCountry &&
        pickup.departureAirport &&
        pickup.arrivalAirport &&
        pickup.arrivalDate &&
        pickup.arrivalTime
      )
    case "resort":
      return !!(pickup.hotelName && pickup.hotelAddress && pickup.roomNumber)
    case "airbnb":
      return !!pickup.address
    default:
      return false
  }
}
