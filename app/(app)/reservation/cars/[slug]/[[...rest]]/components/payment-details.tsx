import { getServerSession } from "next-auth"
import { options } from "@/app/api/auth/[...nextauth]/options"

import ElementsForm from "./elements-form"

export async function PaymentDetails({
  amount,
  currency,
  carId,
  userId,
  checkin,
  checkout,
}: {
  amount: number
  currency: string
  carId: string
  userId: string
  checkin: string
  checkout: string
}) {
  const session = await getServerSession(options)
  const userEmail = session?.user?.email || ""

  // Always pass ISO strings
  let checkinIso = "";
  let checkoutIso = "";
  try {
    checkinIso = new Date(checkin).toISOString();
    checkoutIso = new Date(checkout).toISOString();
  } catch (e) {
    console.error("Invalid checkin/checkout value", { checkin, checkout });
    console.log("errr", e)
    throw new Error("Invalid checkin/checkout value");
  }

  console.log("[PaymentDetails] checkin:", checkin, "checkout:", checkout)
  console.log("[PaymentDetails] checkinIso:", checkinIso, "checkoutIso:", checkoutIso)

  return (
    <>
      <h2 className="text-[22px] font-semibold">Pay with</h2>

      <div className="pt-5">
        <ElementsForm
          userEmail={userEmail}
          amount={amount}
          currency={"usd"}
          carId={carId?.toString()}
          userId={session?.user?.id?.toString() }
          checkin={checkin}
          checkout={checkout}
        />
      </div>
    </>
  )
}
