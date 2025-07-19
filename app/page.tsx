import DashboardHeader from "@/components/dashboard-header"
import EmployeeList from "@/components/employee-list"
import MainLayout from "@/components/main-layout"
import { Suspense } from "react"

export default function Home() {
  return (
    <MainLayout>
      <DashboardHeader title="Employee Dashboard" />
      <Suspense fallback={<div className="p-8 text-center">Loading employees...</div>}>
        <EmployeeList />
      </Suspense>
    </MainLayout>
  )
}
