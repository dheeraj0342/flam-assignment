import type { Employee, PerformanceHistory, Project } from "./types"

const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Product", "Design"]

export function assignDepartmentsAndRatings(users: any[]): Employee[] {
  return users.map((user) => {

    const departmentIndex = user.id % departments.length
    const department = departments[departmentIndex]
    const performanceRating = ((user.id * 17) % 5) + 1

    return {
      ...user,
      department,
      performanceRating,
    }
  })
}

export function generatePerformanceHistory(employeeId: number): PerformanceHistory[] {
  const reviewers = [
    "Sarah Johnson (Manager)",
    "Michael Chen (Team Lead)",
    "David Rodriguez (Director)",
    "Emily Wong (HR)",
    "Robert Smith (Department Head)",
  ]

  const periods = ["Jan - Jun 2023", "Jul - Dec 2022", "Jan - Jun 2022", "Jul - Dec 2021"]

  const comments = [
    "Consistently exceeds expectations and delivers high-quality work.",
    "Strong team player who collaborates effectively with colleagues.",
    "Shows initiative and takes ownership of projects.",
    "Has improved significantly in communication skills.",
    "Demonstrates excellent problem-solving abilities.",
    "Needs improvement in meeting deadlines.",
    "Could benefit from developing leadership skills.",
    "Excellent at mentoring junior team members.",
    "Consistently brings innovative ideas to the team.",
    "Has shown remarkable growth in technical skills.",
  ]

  const feedback = [
    "An exceptional team member who consistently goes above and beyond.",
    "Demonstrates strong leadership potential and mentors others effectively.",
    "Needs to work on time management but delivers quality work.",
    "Has become an invaluable asset to the team over the past year.",
    "Shows great attention to detail in all assignments.",
    "Could improve communication with cross-functional teams.",
    "Consistently delivers projects on time and within scope.",
    "Has shown remarkable improvement in technical skills.",
    "Excellent problem solver who tackles complex challenges effectively.",
    "Needs to be more proactive in seeking feedback and implementing changes.",
  ]


  const count = ((employeeId * 13) % 2) + 3
  const history: PerformanceHistory[] = []

  for (let i = 0; i < count; i++) {
    
    const reviewerIndex = (employeeId + i) % reviewers.length
    const periodIndex = i % periods.length
    const commentIndex = (employeeId * (i + 1)) % comments.length
    const feedbackIndex = (employeeId * (i + 2)) % feedback.length

  
    const baseRating = ((employeeId * 17) % 5) + 1
    const rating = Math.max(1, Math.min(5, baseRating + (i % 2 === 0 ? -1 : 1)))

    history.push({
      id: i + 1,
      reviewPeriod: periods[periodIndex],
      reviewer: reviewers[reviewerIndex],
      rating,
      comments: comments[commentIndex],
      feedback: feedback[feedbackIndex],
    })
  }

  return history
}


export function generateProjects(employeeId: number): Project[] {
  const projectNames = [
    "Website Redesign",
    "Mobile App Development",
    "Customer Portal",
    "Data Migration",
    "Marketing Campaign",
    "Product Launch",
    "Internal Tools",
    "Analytics Dashboard",
    "API Integration",
    "Security Audit",
  ]

  const descriptions = [
    "Redesigned the company website to improve user experience and conversion rates.",
    "Developed a mobile application for iOS and Android platforms.",
    "Created a customer portal for self-service account management.",
    "Migrated legacy data to a new cloud-based system.",
    "Executed a multi-channel marketing campaign for product launch.",
    "Coordinated the launch of a new product line.",
    "Built internal tools to improve team productivity.",
    "Developed analytics dashboards for business intelligence.",
    "Integrated third-party APIs for enhanced functionality.",
    "Conducted a comprehensive security audit and implemented improvements.",
  ]

  const roles = ["Project Lead", "Developer", "Designer", "Analyst", "Coordinator", "Tester", "Consultant", "Manager"]

  const statuses = ["Completed", "In Progress", "Planning"] as const


  const count = ((employeeId * 7) % 3) + 2
  const projects: Project[] = []

  const currentYear = new Date().getFullYear()

  for (let i = 0; i < count; i++) {
    
    const nameIndex = (employeeId + i) % projectNames.length
    const descIndex = (employeeId * (i + 1)) % descriptions.length
    const roleIndex = (employeeId + i * 3) % roles.length
    const statusIndex = i === 0 ? 1 : (employeeId * i) % statuses.length 

   
    const startYear = currentYear - (i % 3)
    const startMonth = ((employeeId + i) % 12) + 1
    const startDate = `${startYear}-${startMonth.toString().padStart(2, "0")}`

    let endDate: string | null = null
    if (statuses[statusIndex] === "Completed") {
      const endYear = startYear + (i % 2)
      const endMonth = ((startMonth + 3) % 12) + 1
      endDate = `${endYear}-${endMonth.toString().padStart(2, "0")}`
    }

    projects.push({
      id: i + 1,
      name: projectNames[nameIndex],
      description: descriptions[descIndex],
      startDate,
      endDate,
      role: roles[roleIndex],
      status: statuses[statusIndex],
    })
  }

  return projects
}
