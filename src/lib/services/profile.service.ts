import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { UserProfile, UserPreferences } from "@/types/user"

/**
 * Fetch the user profile from Firestore.
 * Returns null if the profile document does not exist.
 */
export async function getProfile(uid: string): Promise<UserProfile | null> {
  const ref = doc(db, "users", uid, "profile", "main")
  const snap = await getDoc(ref)
  return snap.exists() ? (snap.data() as UserProfile) : null
}

/**
 * Save (merge) profile fields to Firestore.
 */
export async function saveProfile(
  uid: string,
  fields: {
    displayName: string
    phone: string
    preferences: {
      travelStyle: UserPreferences["travelStyle"] | null
      budgetRange: UserPreferences["budgetRange"] | null
    }
  },
): Promise<void> {
  const ref = doc(db, "users", uid, "profile", "main")
  await setDoc(
    ref,
    {
      ...fields,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}
