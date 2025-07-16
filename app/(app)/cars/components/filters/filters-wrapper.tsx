"use client"
import { ReactNode, useEffect, useState } from "react"

import { FiltersButton } from "./filters-button"

interface FiltersProps {
  trigger?: ReactNode
}

export default function Filters({ trigger }: FiltersProps) {
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

  if (loading) {
    return <div>Loading filters...</div>
  }
  if (error) {
    return <div>{error}</div>
  }
  if (!cars.length) {
    return <div>No cars found.</div>
  }

  const { MIN_PRICE, MAX_PRICE } = cars.reduce(
    (acc, car) => {
      acc.MIN_PRICE = Math.min(acc.MIN_PRICE, Number(car.pricePerDay))
      acc.MAX_PRICE = Math.max(acc.MAX_PRICE, Number(car.pricePerDay))
      return acc
    },
    { MIN_PRICE: Infinity, MAX_PRICE: -Infinity }
  )

  return (
    <FiltersButton
      initialMinPrice={Math.round(MIN_PRICE)}
      initialMaxPrice={Math.round(MAX_PRICE)}
      trigger={trigger}
    />
  )
}
