"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface BookmarksContextType {
  bookmarks: number[]
  addBookmark: (id: number) => void
  removeBookmark: (id: number) => void
  clearBookmarks: () => void
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined)

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<number[]>([])

  useEffect(() => {
    const storedBookmarks = localStorage.getItem("hr-dashboard-bookmarks")
    if (storedBookmarks) {
      try {
        setBookmarks(JSON.parse(storedBookmarks))
      } catch (error) {
        console.error("Failed to parse bookmarks from localStorage:", error)
        setBookmarks([])
      }
    }
  }, [])


  useEffect(() => {
    localStorage.setItem("hr-dashboard-bookmarks", JSON.stringify(bookmarks))
  }, [bookmarks])

  const addBookmark = (id: number) => {
    setBookmarks((prev) => {
      if (prev.includes(id)) return prev
      return [...prev, id]
    })
  }

  const removeBookmark = (id: number) => {
    setBookmarks((prev) => prev.filter((bookmarkId) => bookmarkId !== id))
  }

  const clearBookmarks = () => {
    setBookmarks([])
  }

  return (
    <BookmarksContext.Provider value={{ bookmarks, addBookmark, removeBookmark, clearBookmarks }}>
      {children}
    </BookmarksContext.Provider>
  )
}

export function useBookmarks() {
  const context = useContext(BookmarksContext)
  if (context === undefined) {
    throw new Error("useBookmarks must be used within a BookmarksProvider")
  }
  return context
}
