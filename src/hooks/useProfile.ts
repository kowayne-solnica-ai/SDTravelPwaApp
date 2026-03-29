"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useMockMode } from "@/hooks/useMockMode"
import { getProfile, saveProfile } from "@/lib/services/profile.service"
import { mockUserProfile } from "@/mocks"
import type { UserProfile, UserPreferences } from "@/types/user"

export function useProfile() {
  const { user } = useAuth()
  const { isMockMode } = useMockMode()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isMockMode) {
      setProfile(mockUserProfile)
      setLoading(false)
      return
    }
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    getProfile(user.uid)
      .then(setProfile)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [user, isMockMode])

  const save = useCallback(
    async (fields: {
      displayName: string
      phone: string
      preferences: {
        travelStyle: UserPreferences["travelStyle"] | null
        budgetRange: UserPreferences["budgetRange"] | null
      }
    }) => {
      if (isMockMode || !user) return
      setSaving(true)
      setError(null)
      try {
        await saveProfile(user.uid, fields)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Save failed")
      } finally {
        setSaving(false)
      }
    },
    [user, isMockMode],
  )

  return { profile, loading, saving, error, save }
}
