/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getAllTours } from "@/actions/toursActions"

export function SearchInput() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const router = useRouter()

  // 🔍 Fetch data (replace with real API later)
  const fetchTours = async (searchTerm: string) => {
    if (!searchTerm.trim()) return setResults([])

    try {
      // Replace with real API endpoint if needed
      const res = await getAllTours() // GET all tours
      const data = res.data

      const filtered = data?.filter(
        (tour:any) =>
          tour.active === true &&
          tour.title.toLowerCase().includes(searchTerm.toLowerCase())
      )

      setResults(filtered)
    } catch (error) {
      console.error("Error fetching tours:", error)
      setResults([])
    }
  }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTours(query)
    }, 100) // Debounce for input

    return () => clearTimeout(delayDebounce)
  }, [query])

  const handleSelect = (tour:any) => {
    const path =
      tour.type === "NATIONAL"
        ? `/destination/national/t/${tour.id}`
        : `/destination/international/t/${tour.id}`
    router.push(path)
    setShowSuggestions(false)
    setQuery("")
  }

  return (
    <div className="relative w-full max-w-xl z-50 lg:h-12">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setShowSuggestions(true)
        }}
        className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 h-full pr-20"
      />
      <button className="rounded-bl-full rounded-r-full h-full bg-gradient-to-b from-[#8EBD22] to-[#d0f47c] px-3 text-white absolute right-0 top-0 flex items-center justify-center">
        Rechercher
      </button>

      {/* Suggestions dropdown */}
      {showSuggestions && results.length > 0 && (
        <ul className="absolute mt-1 text-slate-800 text-left w-full bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-y-auto z-20">
          {results.map((tour:any) => (
            <li
              key={tour?.id}
              onClick={() => handleSelect(tour)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {tour?.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
