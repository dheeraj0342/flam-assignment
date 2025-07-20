import AnalyticsDashboard from "@/components/analytics-dashboard"
import DashboardHeader from "@/components/dashboard-header"
import MainLayout from "@/components/main-layout"
import { Suspense } from "react"

export default function AnalyticsPage() {
  return (
    <MainLayout>
      <DashboardHeader title="Analytics Dashboard" />
      <Suspense fallback={<div className="p-8 text-center">Loading analytics...</div>}>
        <AnalyticsDashboard />
      </Suspense>
    </MainLayout>
  )
}
