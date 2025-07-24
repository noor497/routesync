"use client"
import { carTypes } from "@/data/car-types"
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { getCarsByUserEmail } from "./actions";
import { useDebounce } from "@/hooks/use-debounce";
import { locations } from "@/data/locations";
import { useToast } from "@/hooks/use-toast";

export default function ListYourCarPage() {
  const [form, setForm] = useState({
    name: "",
    type: "",
    seats: "",
    powertrain: "",
    transmission: "",
    unlimitedMileage: false,
    description: "",
    features: "",
    pricePerDay: "",
    images: [] as File[],
    location: "", // city name
    latitude: "", // city latitude
    longitude: "", // city longitude
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const { data: session } = useSession();
  // Extend the session user type to include id and userId
  type SessionUser = typeof session extends { user: infer U } ? U & { id?: string; userId?: string } : { id?: string; userId?: string };
  const userEmail = session?.user?.email;
  const userId = (session?.user as SessionUser)?.id || (session?.user as SessionUser)?.userId;
  console.log("userEmail", userEmail , userId);
  const [userCars, setUserCars] = useState<any[]>([]);
  const [loadingCars, setLoadingCars] = useState(false);

  const [cityQuery, setCityQuery] = useState("");
  const [cityOptions, setCityOptions] = useState<any[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const debouncedCityQuery = useDebounce(cityQuery, 400);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userEmail) {
      setLoadingCars(true);
      getCarsByUserEmail(userEmail).then(res => {
        if (res.success) setUserCars(res.cars || []);
        setLoadingCars(false);
      });
    }
  }, [userEmail]);

  useEffect(() => {
    if (!debouncedCityQuery) {
      setCityOptions([]);
      return;
    }
    setCityLoading(true);
    fetch(`/api/ninja-city?q=${encodeURIComponent(debouncedCityQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        setCityOptions(data);
        setCityLoading(false);
      })
      .catch(() => setCityLoading(false));
  }, [debouncedCityQuery]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type, checked, files } = e.target as any;
    if (type === "checkbox") {
      setForm(f => ({ ...f, [name]: checked }));
    } else if (type === "file") {
      setForm(f => ({ ...f, images: Array.from(files) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
    setErrors({});
  }

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors({});
  }

  function validate() {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "Car name is required.";
    if (!form.type) newErrors.type = "Vehicle type is required.";
    if (!form.seats || isNaN(Number(form.seats)) || Number(form.seats) < 1) newErrors.seats = "Seats must be a positive number.";
    if (!form.powertrain.trim()) newErrors.powertrain = "Powertrain is required.";
    if (!form.transmission.trim()) newErrors.transmission = "Transmission is required.";
    if (!form.description.trim()) newErrors.description = "Description is required.";
    if (!form.features.trim()) newErrors.features = "At least one feature is required.";
    if (!form.images || form.images.length !== 3) newErrors.images = "You must upload exactly three images.";
    if (!form.pricePerDay || isNaN(Number(form.pricePerDay)) || Number(form.pricePerDay) <= 0) newErrors.pricePerDay = "Price per day must be a positive number.";
    if (!form.location) newErrors.location = "City is required.";
    if (!form.latitude || !form.longitude) newErrors.location = "Please select a city from the dropdown.";
    return newErrors;
  }

  function handleCitySelect(city: any) {
    setForm((f) => ({
      ...f,
      location: city.name + (city.country ? ", " + city.country : ""),
      latitude: city.latitude,
      longitude: city.longitude,
    }));
    setShowCityDropdown(false);
    setCityQuery(city.name + (city.country ? ", " + city.country : ""));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    // Guard clause for userId and userEmail
    if (!userId || !userEmail) {
      setErrors({ user: "User not authenticated. Please sign in again." });
      setSubmitting(false);
      return;
    }
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    toast({ title: "Uploading car...", description: "Your car is being uploaded. Please wait.", duration: 3000 });
    try {
      // Upload images to Cloudinary
      const uploadPromises = form.images.map((file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "noorfyp");
        return fetch("https://api.cloudinary.com/v1_1/dox5aqlfk/image/upload", {
          method: "POST",
          body: data,
        })
          .then(res => res.json())
          .then(res => {
            if (!res.secure_url) throw new Error("Upload failed");
            return res.secure_url;
          });
      });
      const imageUrls = await Promise.all(uploadPromises);
      // Call server action to insert car
      const carData = {
        name: form.name,
        type: form.type,
        seats: Number(form.seats),
        powertrain: form.powertrain,
        transmission: form.transmission,
        unlimitedMileage: form.unlimitedMileage,
        description: form.description,
        features: form.features.split(",").map(f => f.trim()),
        pricePerDay: Number(form.pricePerDay),
        imageUrls,
        user: userId, // Add user id here
        userEmail: userEmail,
        location: form.location, // pass city
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      };
      const res = await (await import("./actions")).insertCarToMongo(carData as any);
      if (res.success) {
        toast({ title: "Car uploaded!", description: "Your car listing was successfully created.", duration: 3000 });
        alert("Car listing submitted and saved to database!");
        console.log(res.car);
        setUserCars(prev => [res.car, ...prev]);
      } else {
        setErrors({ pricePerDay: res.error || "Failed to save car." });
      }
    } catch (err) {
    //   setErrors({ images: "Image upload failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className=" mx-auto  max-w-xl px-4 py-10  ">
      <h1 className="mb-6 text-2xl font-bold">List Your Car</h1>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block font-medium">Vehicle Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleSelectChange}
            required
            className="w-full rounded border px-3 py-2"          >
            <option value="" disabled>Select a type</option>
            {carTypes.map((type) => (
              <option key={type.id} value={type.name}>{type.name}</option>
            ))}
          </select>
          {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
        </div>
        <div>
          <label className="mb-1 block font-medium">Car Name</label>
          <input name="name" value={form.name} onChange={handleChange} required className="w-full rounded border px-3 py-2" />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label className="mb-1 block font-medium">Number of Seats</label>
          <input name="seats" type="number" min="1" value={form.seats} onChange={handleChange} required className="w-full rounded border px-3 py-2" />
          {errors.seats && <p className="mt-1 text-sm text-red-600">{errors.seats}</p>}
        </div>
        <div>
          <label className="mb-1 block font-medium">Powertrain</label>
          <select
            name="powertrain"
            value={form.powertrain}
            onChange={e => setForm(f => ({ ...f, powertrain: e.target.value }))}
            required
            className="w-full rounded border px-3 py-2"
          >
            <option value="" disabled>Select powertrain</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Electric">Electric</option>
          </select>
          {errors.powertrain && <p className="mt-1 text-sm text-red-600">{errors.powertrain}</p>}
        </div>
        <div>
          <label className="mb-1 block font-medium">Transmission</label>
          <select
            name="transmission"
            value={form.transmission}
            onChange={e => setForm(f => ({ ...f, transmission: e.target.value }))}
            required
            className="w-full rounded border px-3 py-2"          >
            <option value="" disabled>Select transmission</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
          {errors.transmission && <p className="mt-1 text-sm text-red-600">{errors.transmission}</p>}
        </div>
        <div className="flex items-center gap-2">
          <input name="unlimitedMileage" type="checkbox" checked={form.unlimitedMileage} onChange={handleChange} id="unlimitedMileage" />
          <label htmlFor="unlimitedMileage" className="font-medium">Unlimited Mileage</label>
        </div>
        <div>
          <label className="mb-1 block font-medium">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required className="w-full rounded border px-3 py-2" />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>
        <div>
          <label className="mb-1 block font-medium">Features <span className="text-xs text-gray-500">(comma separated)</span></label>
          <input name="features" value={form.features} onChange={handleChange} className="w-full rounded border px-3 py-2"/>
          {errors.features && <p className="mt-1 text-sm text-red-600">{errors.features}</p>}
        </div>
        <div>
          <label className="mb-1 block font-medium">Price Per Day (USD)</label>
          <input
            name="pricePerDay"
            type="number"
            min="1"
            value={form.pricePerDay}
            onChange={handleChange}
            required
            className="w-full rounded border px-3 py-2"          />
          {errors.pricePerDay && <p className="mt-1 text-sm text-red-600">{errors.pricePerDay}</p>}
        </div>
        <div className="relative">
          <label className="mb-1 block font-medium">City</label>
          <input
            name="location"
            value={cityQuery}
            onChange={e => {
              setCityQuery(e.target.value);
              setShowCityDropdown(true);
              setForm(f => ({ ...f, location: "", latitude: "", longitude: "" }));
            }}
            autoComplete="off"
            required
            className="w-full rounded border px-3 py-2"
            placeholder="Type to search city..."
          />
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          {showCityDropdown && cityQuery && (
            <div ref={cityDropdownRef} className="absolute z-10 mt-1 w-full rounded border bg-white shadow-lg max-h-56 overflow-y-auto">
              {cityLoading ? (
                <div className="p-2 text-gray-500">Loading...</div>
              ) : cityOptions.length === 0 ? (
                <div className="p-2 text-gray-500">No cities found.</div>
              ) : (
                cityOptions.map((city, idx) => (
                  <div
                    key={city.name + city.country + idx}
                    className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                    onClick={() => handleCitySelect(city)}
                  >
                    {city.name}{city.country ? ", " + city.country : ""}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <div>
          <label className="mb-1 block font-medium">Car Images <span className="text-xs text-gray-500">(exactly 3)</span></label>
          <input
            name="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="w-full"
          />
          {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
        </div>
        <button
          type="submit"
          className="w-full rounded bg-black py-2 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      {/* Show errors for other fields (already shown inline) */}
      {/* User's Cars Table */}
      {userEmail && (
        <div className="mt-12">
          <h2 className="mb-4 text-xl font-bold">Your Cars</h2>
          {loadingCars ? (
            <p>Loading...</p>
          ) : userCars.length === 0 ? (
            <p>No cars listed yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Type</th>
                    <th className="border px-4 py-2">Price Per Day</th>
                    <th className="border px-4 py-2">Status</th>
                    <th className="border px-4 py-2">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {userCars.map(car => (
                    <tr key={car._id}>
                      <td className="border px-4 py-2">{car.name}</td>
                      <td className="border px-4 py-2">{car.bodyStyle}</td>
                      <td className="border px-4 py-2">${car.pricePerDay}</td>
                      <td className="border px-4 py-2">{car.status}</td>
                      <td className="border px-4 py-2">{new Date(car.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 