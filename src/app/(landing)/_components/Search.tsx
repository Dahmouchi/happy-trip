/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getAllTours } from "@/actions/toursActions"

export function SearchInput() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Fetch all tours when input is focused
  const fetchAllTours = async () => {
    setIsLoading(true)
    try {
      const res = await getAllTours()
      const data = res.data?.filter((tour: any) => tour.active === true)
      setResults(data || [])
    } catch (error) {
      console.error("Error fetching tours:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch filtered tours based on search term
  const fetchFilteredTours = async (searchTerm: string) => {
    setIsLoading(true)
    try {
      const res = await getAllTours()
      const data = res.data?.filter(
        (tour: any) =>
          tour.active === true &&
          tour.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setResults(data || [])
    } catch (error) {
      console.error("Error fetching tours:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        fetchFilteredTours(query)
      } else if (showSuggestions) {
        fetchAllTours()
      }
    }, 300) // Debounce for input

    return () => clearTimeout(delayDebounce)
  }, [query, showSuggestions])

  const handleFocus = () => {
    setShowSuggestions(true)
    if (!query.trim()) {
      fetchAllTours()
    }
  }

  const handleBlur = () => {
    // Delay hiding to allow click on suggestions
    setTimeout(() => setShowSuggestions(false), 200)
  }

  const handleSelect = (tour: any) => {
    router.push(`/voyage/${tour.id}`)
    setShowSuggestions(false)
    setQuery("")
  }

  return (
    <div className="relative w-full max-w-xl z-50 lg:h-12">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 h-full pr-20"
      />
      <button className="rounded-bl-full rounded-r-full h-full bg-gradient-to-b from-[#8EBD22] to-[#d0f47c] px-3 text-white absolute right-0 top-0 flex items-center justify-center">
        Rechercher
      </button>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <ul className="absolute mt-1 text-slate-800 text-left w-full bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-y-auto z-20">
          {isLoading ? (
            // Skeleton loading state
            Array(5).fill(0).map((_, index) => (
              <li key={index} className="px-4 py-3 hover:bg-gray-100">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </li>
            ))
          ) : results.length > 0 ? (
            // Actual results
            results.map((tour: any) => (
              <li
                key={tour?.id}
                onClick={() => window.location.href = `/voyage/${tour.id}`}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 "
              >
                {tour?.title}
              </li>
            ))
          ) : (
            // No results found
            <li className="px-4 py-2 text-gray-500">
              {query.trim() ? "No tours found" : "No tours available"}
            </li>
          )}
        </ul>
      )}
    </div>
  )
}