export interface User {
  id: number
  username: string
  role: string
}

export interface Community {
  id: number
  name: string
  district?: string
  address?: string
  property_fee?: string
  parking?: string
  build_year?: number
  metro?: string
  primary_school?: string
  middle_school?: string
  environment_score?: number
  photos?: string
  videos?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Property {
  id: number
  community_id: number
  community?: Community
  building?: string
  unit?: string
  room?: string
  area?: number
  layout?: string
  floor?: string
  orientation?: string
  decoration?: string
  price?: number
  price_per_sqm?: number
  rent?: number
  rent_ratio?: number
  expected_price?: number
  visit_date?: string
  photos?: string
  videos?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
}

export interface DashboardStats {
  total_properties: number
  total_communities: number
  average_price?: number
  average_rent?: number
  average_rent_ratio?: number
  district_stats: { district: string; count: number }[]
}
