"use client"
import { LogoLink } from "./logoLink"
import { UserMenuButton } from "./user-menu-button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export function SiteHeader() {
  const [isRent, setIsRent] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchUserRole() {
      if (session?.user?.email) {
        try {
          const res = await fetch(`/api/user-by-email?email=${encodeURIComponent(session.user.email)}`);
          const data = await res.json();
          setIsAdmin(data?.role === "admin");
        } catch (e) {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    }
    fetchUserRole();
  }, [session]);

  const carTypes = [
    { label: "SUVs", value: "suv" },
    { label: "Sports Car", value: "sports-car" },
    { label: "Sedan", value: "sedan" },
    { label: "Hatchback", value: "hatchback" },
    { label: "Minivan", value: "minivan" },
    { label: "Pickup Truck", value: "pickup-truck" },
  ];

  return (
    <header className="flex h-full items-center justify-between">
      <LogoLink />
      <nav className="flex items-center gap-6">
        <Link href="/" className="font-medium text-gray-700 transition hover:text-blue-600">Home</Link>
        <Link href="/cars" className="font-medium text-gray-700 transition hover:text-blue-600">All Cars</Link>
        {/* Car Types Dropdown here if needed */}
        {isAdmin && (
          <Link href="/admin" className="font-medium  text-red-600 underline transition ">Admin</Link>
        )}
      </nav>
      <div className="inline-flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="flex cursor-pointer items-center gap-2">
            <span className={!isRent ? 'font-bold text-blue-600' : 'text-gray-500'}>Book</span>
            <button
              type="button"
              role="switch"
              aria-checked={isRent}
              onClick={() => setIsRent((prev) => !prev)}
              className={`relative h-6 w-10 rounded-full outline-none transition-colors duration-200 focus:ring-2 focus:ring-blue-400 ${isRent ? 'bg-blue-600' : 'bg-gray-200'}`}
              id="book-rent-switch"
            >
              <span
                className={`absolute left-0.5 top-0.5 block size-5 rounded-full bg-white shadow transition-transform duration-200 ${isRent ? 'translate-x-4' : ''}`}
              />
            </button>
            <span className={isRent ? 'font-bold text-blue-600' : 'text-gray-500'}>Rent</span>
          </label>
          {isRent ? (
            <Link href="/list-your-car" className="font-medium  text-blue-600 underline transition">
              List Your Car
            </Link>
          ) : (
            <Link href="/my-bookings" className="font-medium  text-blue-600 underline transition">
              My Bookings
            </Link>
          )}
        </div>
        <UserMenuButton />
      </div>
    </header>
  )
}
