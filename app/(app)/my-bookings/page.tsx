import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import Booking from "@/app/(models)/Booking";
import Car from "@/app/(models)/Car";
import User from "@/app/(models)/User";

export default async function MyBookingsPage() {
  const session = await getServerSession(options);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return <div className="p-8">You must be logged in to view your bookings.</div>;
  }
  // Find the user in MongoDB
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    return <div className="p-8">User not found.</div>;
  }
  // Get bookings for this user
  const bookings = await Booking.find({ user: user._id }).populate("car");

  // Get all cars owned by this user
  const myCars = await Car.find({ user: user._id });
  const myCarIds = myCars.map((car: any) => car._id);
  // Get all bookings on my cars (by other users)
  const bookingsOnMyCars = await Booking.find({ car: { $in: myCarIds }, user: { $ne: user._id } }).populate("car").populate("user");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <div>No bookings found.</div>
      ) : (
        <div className="overflow-x-auto mb-12">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Car</th>
                <th className="px-4 py-2 border">Check-in</th>
                <th className="px-4 py-2 border">Check-out</th>
                <th className="px-4 py-2 border">Total Price</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking: any) => (
                <tr key={booking._id} className="border-t">
                  <td className="px-4 py-2 border">{booking.car?.name || "-"}</td>
                  <td className="px-4 py-2 border">{new Date(booking.checkin).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border">{new Date(booking.checkout).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border">${booking.totalPrice.toFixed(2)}</td>
                  <td className="px-4 py-2 border">{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Bookings on My Cars</h2>
      {bookingsOnMyCars.length === 0 ? (
        <div>No bookings by other users on your cars.</div>
      ) : (
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
              </tr>
            </thead>
            <tbody>
              {bookingsOnMyCars.map((booking: any) => (
                <tr key={booking._id} className="border-t">
                  <td className="px-4 py-2 border">{booking.car?.name || "-"}</td>
                  <td className="px-4 py-2 border">{booking.user?.email || "-"}</td>
                  <td className="px-4 py-2 border">{new Date(booking.checkin).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border">{new Date(booking.checkout).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border">${booking.totalPrice.toFixed(2)}</td>
                  <td className="px-4 py-2 border">{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 