export type Category = {
  id: string
  name: string
  slug: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export type Photo = {
  id: string
  title: string
  storage_path: string
  category: string
  is_featured: boolean
  sort_order: number
  created_at: string
  url?: string
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

export type Testimonial = {
  id: string
  client_name: string
  service: string
  quote: string
  is_approved: boolean
  created_at: string
}