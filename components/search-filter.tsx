"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { ScrollArea } from "./ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Filter, Search, X, ChevronDown } from "lucide-react"

const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Product", "Design"]
const ratings = [1, 2, 3, 4, 5]

export function SearchFilter() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])

  // Initialize filters from URL on component mount
  useEffect(() => {
    const deptParam = searchParams.get("departments")
    const ratingParam = searchParams.get("ratings")

    if (deptParam) {
      setSelectedDepartments(deptParam.split(","))
    }

    if (ratingParam) {
      setSelectedRatings(ratingParam.split(",").map(Number))
    }
  }, [searchParams])

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams],
  )

  const handleSearch = (term: string) => {
    setSearch(term)
    router.push(`${pathname}?${createQueryString("search", term)}`, { scroll: false })
  }

  const handleDepartmentChange = (department: string) => {
    let newDepartments: string[]

    if (selectedDepartments.includes(department)) {
      newDepartments = selectedDepartments.filter((d) => d !== department)
    } else {
      newDepartments = [...selectedDepartments, department]
    }

    setSelectedDepartments(newDepartments)
    router.push(`${pathname}?${createQueryString("departments", newDepartments.join(","))}`, { scroll: false })
  }

  const handleRatingChange = (rating: number) => {
    let newRatings: number[]

    if (selectedRatings.includes(rating)) {
      newRatings = selectedRatings.filter((r) => r !== rating)
    } else {
      newRatings = [...selectedRatings, rating]
    }

    setSelectedRatings(newRatings)
    router.push(`${pathname}?${createQueryString("ratings", newRatings.join(","))}`, { scroll: false })
  }

  const clearFilters = () => {
    setSelectedDepartments([])
    setSelectedRatings([])
    setSearch("")
    router.push(pathname, { scroll: false })
  }

  const hasFilters = search || selectedDepartments.length > 0 || selectedRatings.length > 0
  const activeFiltersCount = selectedDepartments.length + selectedRatings.length

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search employees..."
          className="pl-9 w-full md:w-[280px]"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-between min-w-[120px] bg-transparent">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="h-5 w-5 p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium leading-none mb-3">Departments</h4>
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {departments.map((department) => (
                    <div key={department} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={department}
                        checked={selectedDepartments.includes(department)}
                        onChange={() => handleDepartmentChange(department)}
                        className="rounded border-border"
                      />
                      <label
                        htmlFor={department}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {department}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium leading-none mb-3">Performance Rating</h4>
              <div className="space-y-2">
                {ratings.map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`rating-${rating}`}
                      checked={selectedRatings.includes(rating)}
                      onChange={() => handleRatingChange(rating)}
                      className="rounded border-border"
                    />
                    <label
                      htmlFor={`rating-${rating}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {rating} {rating === 1 ? "Star" : "Stars"}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {hasFilters && (
              <>
                <Separator />
                <Button variant="outline" size="sm" onClick={clearFilters} className="w-full bg-transparent">
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
