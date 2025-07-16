
import Car from "@/app/(models)/Car";
import Booking from "@/app/(models)/Booking";
import AdminTables from "./AdminTables";

export default async function AdminPage() {
  const cars = await Car.find({});
  const bookings = await Booking.find({}).populate("car").populate("user");

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold ">Admin Panel</h1>
      <AdminTables cars={JSON.parse(JSON.stringify(cars))} bookings={JSON.parse(JSON.stringify(bookings))} />
    </div>
  );
} 