import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios"
import { auth } from "@/lib/firebase/client"

// ---------------------------------------------------------------------------
// Normalized error shape returned by all API calls
// ---------------------------------------------------------------------------
export interface ApiError {
  message: string
  code: string
  status: number
}

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
})

// ---------------------------------------------------------------------------
// Request interceptor — attach Firebase Auth token automatically
// ---------------------------------------------------------------------------
apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  try {
    const user = auth.currentUser
    if (user) {
      const token = await user.getIdToken()
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch {
    // If token retrieval fails, send the request unauthenticated.
    // The server will reject it if auth is required.
  }
  return config
})

// ---------------------------------------------------------------------------
// Response interceptor — normalize errors
// ---------------------------------------------------------------------------
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string; message?: string }>) => {
    const status = error.response?.status ?? 0
    const message =
      error.response?.data?.error ??
      error.response?.data?.message ??
      error.message ??
      "An unexpected error occurred"
    const code = error.code ?? "UNKNOWN"

    if (process.env.NODE_ENV === "development") {
      console.error(`[API ${status}] ${code}: ${message}`)
    }

    return Promise.reject({ message, code, status } satisfies ApiError)
  },
)

export default apiClient
