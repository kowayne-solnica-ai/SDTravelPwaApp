import apiClient from "./client"
import type { Accommodation } from "@/types/tour"

export async function fetchAccommodation(
  id: string,
): Promise<Accommodation | null> {
  const { data } = await apiClient.get("/api/wix/debug/accommodations", {
    params: { id },
  })
  return data?.accommodation ?? data ?? null
}
