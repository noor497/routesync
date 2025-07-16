"use client"
import { useEffect, useState } from "react"
import { SearchParams } from "@/lib/types"
import { slugify } from "@/lib/utils"

import { CarCard } from "./car-card"

interface CarCatalogProps {
  searchParams: {
    [SearchParams.MIN_PRICE]?: string
    [SearchParams.MAX_PRICE]?: string
    [SearchParams.BODY_STYLE]?: string[]
    [SearchParams.POWERTRAIN]?: string
    [SearchParams.TRANSMISSION]?: string[]
    [SearchParams.MIN_SEATS]?: string
  }
}

export default function CarCatalog({ searchParams }: CarCatalogProps) {
  const [cars, setCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCars() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/cars")
        if (!res.ok) throw new Error("Failed to fetch cars")
        const data = await res.json()
        setCars(data)
      } catch (err) {
        setError("Failed to fetch cars")
      } finally {
        setLoading(false)
      }
    }
    fetchCars()
  }, [])

  const {
    [SearchParams.MIN_PRICE]: minPrice,
    [SearchParams.MAX_PRICE]: maxPrice,
    [SearchParams.BODY_STYLE]: bodyStyles,
    [SearchParams.POWERTRAIN]: powertrain,
    [SearchParams.TRANSMISSION]: transmissions,
    [SearchParams.MIN_SEATS]: minSeats,
  } = searchParams

  const filteredCars = cars.filter((car) => {
    return (
      (!minPrice || Number(car.pricePerDay) >= Number(minPrice)) &&
      (!maxPrice || Number(car.pricePerDay) <= Number(maxPrice)) &&
      (!bodyStyles || bodyStyles.includes(slugify(car.bodyStyle))) &&
      (!powertrain || powertrain === car.powertrain) &&
      (!transmissions || transmissions.includes(slugify(car.transmission))) &&
      (!minSeats || car.seats >= Number(minSeats))
    )
  })

  if (loading) {
    return <div>Loading cars...</div>
  }
  if (error) {
    return <div>{error}</div>
  }
  if (!filteredCars.length)
    return (
      <div className="col-span-full text-balance">
        <h1 className="text-xl font-semibold">No exact matches</h1>
        <p className="mt-3 text-slate-700">
          Try changing or removing some of your filters.
        </p>
      </div>
    )

  return (
    <>
      {filteredCars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </>
  )
}
