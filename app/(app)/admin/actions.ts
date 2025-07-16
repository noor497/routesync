"use server";
import Car from "@/app/(models)/Car";
import Booking from "@/app/(models)/Booking";

export async function deleteCarAndBookings(carId: string) {
  try {
    await Booking.deleteMany({ car: carId });
    await Car.findByIdAndDelete(carId);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function deleteBooking(bookingId: string) {
  try {
    await Booking.findByIdAndDelete(bookingId);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function updateCar(carId: string, update: any) {
  try {
    // Exclude image fields from update
    const { imageUrls, ...rest } = update;
    await Car.findByIdAndUpdate(carId, rest);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function updateBooking(bookingId: string, update: any) {
  try {
    await Booking.findByIdAndUpdate(bookingId, update);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
} 