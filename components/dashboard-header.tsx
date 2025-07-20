import { SearchFilter } from "./search-filter"

interface DashboardHeaderProps {
  title: string
}

export default function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <h1 className="text-2xl md:text-3xl font-bold animate-fade-in">{title}</h1>
      <div className="animate-fade-in animation-delay-200">
        <SearchFilter />
      </div>
    </div>
  )
}
