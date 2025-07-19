import type { Employee } from "./types"
import { assignDepartmentsAndRatings } from "./mock-data"


let employeesCache: Employee[] | null = null

export async function getEmployees(): Promise<Employee[]> {

  if (employeesCache) {
    return employeesCache
  }

  try {
  
    const response = await fetch("https://dummyjson.com/users?limit=20")

    if (!response.ok) {
      throw new Error(`Failed to fetch employees: ${response.status}`)
    }

    const data = await response.json()


    const enhancedEmployees = assignDepartmentsAndRatings(data.users)


    employeesCache = enhancedEmployees

    return enhancedEmployees
  } catch (error) {
    console.error("Error fetching employees:", error)
    throw error
  }
}

export async function getEmployeeById(id: number): Promise<Employee | null> {
  try {
    
    if (employeesCache) {
      const cachedEmployee = employeesCache.find((emp) => emp.id === id)
      if (cachedEmployee) {
        return cachedEmployee
      }
    }

    // If not in cache, fetch directly
    const response = await fetch(`https://dummyjson.com/users/${id}`)

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch employee: ${response.status}`)
    }

    const data = await response.json()

  
    const enhancedEmployee = assignDepartmentsAndRatings([data])[0]

    return enhancedEmployee
  } catch (error) {
    console.error(`Error fetching employee with ID ${id}:`, error)
    throw error
  }
}

export async function getEmployeesByIds(ids: number[]): Promise<Employee[]> {
  try {

    const allEmployees = await getEmployees()

    return allEmployees.filter((employee) => ids.includes(employee.id))
  } catch (error) {
    console.error("Error fetching employees by IDs:", error)
    throw error
  }
}
