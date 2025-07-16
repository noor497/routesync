"use server"

import Booking from "@/app/(models)/Booking"

export async function createBooking({
  carId,
  userId,
  checkin,
  checkout,
  totalPrice,
  status = "confirmed",
}: {
  carId: string
  userId: string
  checkin: Date
  checkout: Date
  totalPrice: number
  status?: "pending" | "confirmed" | "cancelled"
}) {
  // Debug log
  console.log("createBooking input:", { carId, userId, checkin, checkout, totalPrice, status })
  try {
    const booking = await Booking.create({
      car: carId,
      user: userId,
      checkin,
      checkout,
      totalPrice,
      status,
    })
    console.log("booking created", booking)
    return { success: true, booking }
  } catch (error) {
    console.log("error creating booking", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
} 