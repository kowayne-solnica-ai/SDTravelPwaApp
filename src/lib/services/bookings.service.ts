import {
  collection,
  query,
  where,
  orderBy,
  limit as fbLimit,
  onSnapshot,
  type QueryConstraint,
  type Unsubscribe,
} from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { Booking } from "@/types/booking"

/**
 * Subscribe to a user's bookings in real time.
 * Returns an unsubscribe function.
 */
export function subscribeToUserBookings(
  uid: string,
  onData: (bookings: Booking[]) => void,
  onError?: (err: Error) => void,
  maxResults?: number,
): Unsubscribe {
  const ref = collection(db, "bookings")
  const constraints: QueryConstraint[] = [
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
  ]
  if (maxResults) constraints.push(fbLimit(maxResults))

  const q = query(ref, ...constraints)

  return onSnapshot(
    q,
    (snap) => {
      const items: Booking[] = snap.docs.map((d) => ({
        _id: d.id,
        ...(d.data() as Omit<Booking, "_id">),
      }))
      onData(items)
    },
    (err) => {
      console.error("[BookingsService] Listener error:", err)
      onError?.(err)
    },
  )
}
