export type Category = 'portrait' | 'event' | 'landscape' | 'editorial' | 'general'

export type Photo = {
  id: string
  title: string
  storage_path: string
  category: Category
  is_featured: boolean
  sort_order: number
  created_at: string
  url?: string  // derived from storage_path at runtime
}

export type Enquiry = {
  id: string
  first_name: string
  last_name: string
  email: string
  service: string
  message: string
  status: 'new' | 'read' | 'booked'
  created_at: string
}

export type Service = {
  id: string
  name: string
  description: string
  price_from: number
  sort_order: number
  is_active: boolean
}