export interface Employee {
  id: number
  firstName: string
  lastName: string
  email: string
  age: number
  phone?: string
  address?: {
    address?: string
    city?: string
    state?: string
    postalCode?: string
  }
  department: string
  performanceRating: number
}

export interface PerformanceHistory {
  id: number
  reviewPeriod: string
  reviewer: string
  rating: number
  comments: string
  feedback: string
}

export interface Project {
  id: number
  name: string
  description: string
  startDate: string
  endDate: string | null
  role: string
  status: "Completed" | "In Progress" | "Planning"
}
