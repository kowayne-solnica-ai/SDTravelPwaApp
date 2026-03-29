import apiClient from "./client"

export interface ContactPayload {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export interface ContactResult {
  isExistingUser: boolean
}

export async function submitContactForm(
  payload: ContactPayload,
): Promise<ContactResult> {
  const { data } = await apiClient.post<ContactResult>("/api/contact", payload)
  return data
}
