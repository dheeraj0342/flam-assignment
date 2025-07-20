"use client"

import BookmarksList from "@/components/bookmarks-list"
import DashboardHeader from "@/components/dashboard-header"
import MainLayout from "@/components/main-layout"
import { useBookmarks } from "@/lib/bookmarks-context"
import { useEffect, useState } from "react"

export default function BookmarksPage() {
  const { bookmarks } = useBookmarks()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading state
    setIsLoading(false)
  }, [])

  return (
    <MainLayout>
      <DashboardHeader title="Bookmarked Employees" />
      {isLoading ? (
        <div className="p-8 text-center">Loading bookmarks...</div>
      ) : (
        <BookmarksList bookmarkIds={bookmarks} />
      )}
    </MainLayout>
  )
}
