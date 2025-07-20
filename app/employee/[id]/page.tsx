import DashboardHeader from "@/components/dashboard-header"
import EmployeeDetails from "@/components/employee-details"
import MainLayout from "@/components/main-layout"
import { getEmployeeById } from "@/lib/data"
import { notFound } from "next/navigation"
import { Suspense } from "react"

export default async function EmployeePage({
  params,
}: {
  params: { id: string }
}) {
  const employeeId = Number.parseInt(params.id)

  if (isNaN(employeeId)) {
    notFound()
  }

  const employee = await getEmployeeById(employeeId)

  if (!employee) {
    notFound()
  }

  return (
    <MainLayout>
      <DashboardHeader title={`${employee.firstName} ${employee.lastName}`} />
      <Suspense fallback={<div className="p-8 text-center">Loading employee details...</div>}>
        <EmployeeDetails employee={employee} />
      </Suspense>
    </MainLayout>
  )
}
