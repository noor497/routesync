"use client";
import { useState, useTransition } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { deleteCarAndBookings, deleteBooking, updateCar, updateBooking } from "./actions";
import { carTypes } from "@/data/car-types";

export default function AdminTables({ cars, bookings }: { cars: any[]; bookings: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [editCar, setEditCar] = useState<any | null>(null);
  const [editBooking, setEditBooking] = useState<any | null>(null);

  // Car update form state
  const [carForm, setCarForm] = useState<any>({});
  // Booking update form state
  const [bookingForm, setBookingForm] = useState<any>({});

  const handleDeleteCar = (carId: string) => {
    startTransition(async () => {
      await deleteCarAndBookings(carId);
      window.location.reload();
    });
  };
  const handleDeleteBooking = (bookingId: string) => {
    startTransition(async () => {
      await deleteBooking(bookingId);
      window.location.reload();
    });
  };

  const handleOpenEditCar = (car: any) => {
    setEditCar(car);
    setCarForm({
      name: car.name,
      type: car.type || "",
      bodyStyle: car.bodyStyle,
      seats: car.seats,
      powertrain: car.powertrain,
      transmission: car.transmission,
      unlimitedMileage: car.unlimitedMileage,
      description: car.description,
      features: car.features?.join(", ") || "",
      pricePerDay: car.pricePerDay,
      status: car.status,
    });
  };
  const handleOpenEditBooking = (booking: any) => {
    setEditBooking(booking);
    setBookingForm({
      checkin: booking.checkin ? new Date(booking.checkin).toISOString().slice(0, 10) : "",
      checkout: booking.checkout ? new Date(booking.checkout).toISOString().slice(0, 10) : "",
      totalPrice: booking.totalPrice,
      status: booking.status,
    });
  };

  const handleCarFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setCarForm({ ...carForm, [e.target.name]: e.target.value });
  };
  const handleBookingFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  const handleUpdateCar = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await updateCar(editCar._id, {
        ...carForm,
        seats: Number(carForm.seats),
        pricePerDay: Number(carForm.pricePerDay),
        features: carForm.features.split(",").map((f: string) => f.trim()),
        unlimitedMileage: carForm.unlimitedMileage === "true" || carForm.unlimitedMileage === true,
      });
      setEditCar(null);
      window.location.reload();
    });
  };
  const handleUpdateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await updateBooking(editBooking._id, {
        ...bookingForm,
        checkin: new Date(bookingForm.checkin),
        checkout: new Date(bookingForm.checkout),
        totalPrice: Number(bookingForm.totalPrice),
      });
      setEditBooking(null);
      window.location.reload();
    });
  };

  return (
    <>
      {/* Car Update Modal */}
      <Dialog open={!!editCar} onOpenChange={(open) => !open && setEditCar(null)}>
        <DialogContent className="max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Car</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateCar} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Vehicle Type</label>
              <select
                name="type"
                value={carForm.type || ""}
                onChange={handleCarFormChange}
                required
                className="w-full rounded border px-3 py-2"
              >
                <option value="" disabled>Select a type</option>
                {carTypes.map((type) => (
                  <option key={type.id} value={type.name}>{type.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Car Name</label>
              <input name="name" value={carForm.name || ""} onChange={handleCarFormChange} required className="w-full rounded border px-3 py-2" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Number of Seats</label>
              <input name="seats" type="number" min="1" value={carForm.seats || ""} onChange={handleCarFormChange} required className="w-full rounded border px-3 py-2" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Powertrain</label>
              <select
                name="powertrain"
                value={carForm.powertrain || ""}
                onChange={handleCarFormChange}
                required
                className="w-full rounded border px-3 py-2"
              >
                <option value="" disabled>Select powertrain</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Transmission</label>
              <select
                name="transmission"
                value={carForm.transmission || ""}
                onChange={handleCarFormChange}
                required
                className="w-full rounded border px-3 py-2"
              >
                <option value="" disabled>Select transmission</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input name="unlimitedMileage" type="checkbox" checked={carForm.unlimitedMileage === true || carForm.unlimitedMileage === "true"} onChange={e => setCarForm(f => ({ ...f, unlimitedMileage: e.target.checked }))} id="unlimitedMileage" />
              <label htmlFor="unlimitedMileage" className="font-medium">Unlimited Mileage</label>
            </div>
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea name="description" value={carForm.description || ""} onChange={handleCarFormChange} required className="w-full rounded border px-3 py-2" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Features <span className="text-xs text-gray-500">(comma separated)</span></label>
              <input name="features" value={carForm.features || ""} onChange={handleCarFormChange} className="w-full rounded border px-3 py-2" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Price Per Day (USD)</label>
              <input
                name="pricePerDay"
                type="number"
                min="1"
                value={carForm.pricePerDay || ""}
                onChange={handleCarFormChange}
                required
                className="w-full rounded border px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Status</label>
              <select name="status" value={carForm.status || "active"} onChange={handleCarFormChange} className="w-full rounded border px-3 py-2">
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <button type="button" className="px-4 py-2 rounded bg-gray-200">Cancel</button>
              </DialogClose>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white" disabled={isPending}>
                {isPending ? "Updating..." : "Update"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Booking Update Modal */}
      <Dialog open={!!editBooking} onOpenChange={(open) => !open && setEditBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Booking</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateBooking} className="space-y-4">
            <input name="checkin" type="date" value={bookingForm.checkin || ""} onChange={handleBookingFormChange} className="w-full border p-2 rounded" required />
            <input name="checkout" type="date" value={bookingForm.checkout || ""} onChange={handleBookingFormChange} className="w-full border p-2 rounded" required />
            <input name="totalPrice" type="number" value={bookingForm.totalPrice || ""} onChange={handleBookingFormChange} className="w-full border p-2 rounded" required />
            <select name="status" value={bookingForm.status || "confirmed"} onChange={handleBookingFormChange} className="w-full border p-2 rounded">
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <DialogFooter>
              <DialogClose asChild>
                <button type="button" className="px-4 py-2 rounded bg-gray-200">Cancel</button>
              </DialogClose>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white" disabled={isPending}>
                {isPending ? "Updating..." : "Update"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <h2 className="text-xl font-bold mb-4">All Cars</h2>
      <div className="overflow-x-auto mb-12">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Owner</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car: any) => (
              <tr key={car._id} className="border-t">
                <td className="px-4 py-2 border">{car.name}</td>
                <td className="px-4 py-2 border">{car.userEmail || "-"}</td>
                <td className="px-4 py-2 border">{car.status}</td>
                <td className="px-4 py-2 border">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="text-red-600 hover:underline mr-2">Delete</button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this car? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <button className="px-4 py-2 rounded bg-gray-200">Cancel</button>
                        </DialogClose>
                        <button
                          className="px-4 py-2 rounded bg-red-600 text-white"
                          onClick={() => handleDeleteCar(car._id.toString())}
                          disabled={isPending}
                        >
                          {isPending ? "Deleting..." : "Delete"}
                        </button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleOpenEditCar(car)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold mb-4">All Bookings</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Car</th>
              <th className="px-4 py-2 border">Renter</th>
              <th className="px-4 py-2 border">Check-in</th>
              <th className="px-4 py-2 border">Check-out</th>
              <th className="px-4 py-2 border">Total Price</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking: any) => (
              <tr key={booking._id} className="border-t">
                <td className="px-4 py-2 border">{booking.car?.name || "-"}</td>
                <td className="px-4 py-2 border">{booking.user?.email || "-"}</td>
                <td className="px-4 py-2 border">{new Date(booking.checkin).toLocaleDateString()}</td>
                <td className="px-4 py-2 border">{new Date(booking.checkout).toLocaleDateString()}</td>
                <td className="px-4 py-2 border">${booking.totalPrice.toFixed(2)}</td>
                <td className="px-4 py-2 border">{booking.status}</td>
                <td className="px-4 py-2 border">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="text-red-600 hover:underline mr-2">Delete</button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this booking? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <button className="px-4 py-2 rounded bg-gray-200">Cancel</button>
                        </DialogClose>
                        <button
                          className="px-4 py-2 rounded bg-red-600 text-white"
                          onClick={() => handleDeleteBooking(booking._id.toString())}
                          disabled={isPending}
                        >
                          {isPending ? "Deleting..." : "Delete"}
                        </button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleOpenEditBooking(booking)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
} 