"use client"

import * as React from "react"
import { createPaymentIntent } from "@/actions/stripe"
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import type { StripeError } from "@stripe/stripe-js"

import getStripe from "@/lib/stripe/utils/get-stripejs"
import { formatAmountForStripe } from "@/lib/stripe/utils/stripe-helpers"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { LoadingDots } from "@/components/loading-dots"
import { useToast } from "@/hooks/use-toast"

import { CancellationPolicy } from "./cancellation-policy"
import { StripeTestCards } from "./stripe-test-cards"
import { createBooking } from "../actions"


function CheckoutForm({
  userEmail,
  amount,
  currency,
  carId,
  userId,
  checkin,
  checkout,
}: {
  userEmail: string
  amount: number
  currency: string
  carId: string
  userId: string
  checkin: string
  checkout: string
}) {
  const [isElementsReady, setIsElementsReady] = React.useState(false)
  const [input, setInput] = React.useState<{
    cardholderName: string
  }>({
    cardholderName: "",
  })
  const [paymentType, setPaymentType] = React.useState<string>("")
  const [payment, setPayment] = React.useState<{
    status:
      | "initial"
      | "processing"
      | "error"
      | "requires_payment_method"
      | "requires_confirmation"
      | "requires_action"
      | "succeeded"
  }>(() => ({ status: "initial" }));
  const [errorMessage, setErrorMessage] = React.useState<string>("")
  const [isLoading, setIsLoading] = React.useState(false)

  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()

  const PaymentStatus = () => {
    if (isLoading) return <span>Processing...</span>
    switch (payment.status) {
      case "processing":
      case "requires_payment_method":
      case "requires_confirmation":
        return <span>Processing...</span>
      case "requires_action":
        return <span>Authenticating...</span>
      case "succeeded":
        return <span>Success!</span>
      case "error":
        return <span>Error</span>
      default:
        return <span>Confirm and pay</span>
    }
  }

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value,
    })
  }

  console.log("[CheckoutForm] received checkin:", checkin, "checkout:", checkout)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault()
      // Abort if form isn't valid
      if (!e.currentTarget.reportValidity()) return
      if (!elements || !stripe) return

      setIsLoading(true)
      toast({
        title: "Processing payment...",
        description: "Please wait while we confirm your payment.",
      })
      setPayment({ status: "processing" })

      // const { error: submitError } = await elements.submit()

      // if (submitError) {
      //   setPayment({ status: "error" })
      //   setErrorMessage(submitError.message ?? "An unknown error occurred")
      //   toast({
      //     title: "Payment failed",
      //     description: submitError.message ?? "An unknown error occurred",
      //     variant: "destructive",
      //   })
      //   return
      // }

      // Create a PaymentIntent with the specified amount.
      // const { client_secret: clientSecret } = await createPaymentIntent(
      //   new FormData(e.target as HTMLFormElement)
      // )

      // Use your card Element with other Stripe.js APIs
      // const { error: confirmError } = await stripe!.confirmPayment({
      //   elements,
      //   clientSecret,
      //   confirmParams: {
      //     return_url: `${window.location.origin}/reservation/confirmation/result`,
      //     payment_method_data: {
      //       billing_details: {
      //         name: input.cardholderName,
      //         email: userEmail,
      //       },
      //     },
      //   },
      // })

      // if (confirmError) {
      //   setPayment({ status: "error" })
      //   setErrorMessage(confirmError.message ?? "An unknown error occurred")
      //   toast({
      //     title: "Payment failed",
      //     description: confirmError.message ?? "An unknown error occurred",
      //     variant: "destructive",
      //   })
      //   return
      // }

      // If no errors, show success toast
      toast({
        title: "Payment successful!",
        description: "Your payment was processed successfully."
      })
      // Create booking after payment success
      console.log("[CheckoutForm] before createBooking checkin:", checkin, "checkout:", checkout)
      await createBooking({
        carId,
        userId,
        checkin: new Date(checkin),
        checkout: new Date(checkout),
        totalPrice: amount,
        status: "confirmed",
      })
      setIsLoading(false)
      setPayment({ status: "succeeded" })
    } catch (err) {
      setIsLoading(false)
      setPayment({ status: "error" })
      const { message } = err as StripeError
      setErrorMessage(message ?? "An unknown error occurred")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <StripeTestCards />
      {errorMessage && (
        <Alert variant={"destructive"}>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      <div
        className={cn(
          "flex h-36 w-full items-center justify-center",
          isElementsReady && "hidden"
        )}
      >
        <LoadingDots />
      </div>
      <div className={isElementsReady ? "block" : "hidden"}>
        <div>
          {paymentType === "card" ? (
            <div className="pt-6">
              <Label htmlFor="cardholderName" className="mb-2 block">
                Carholder name
              </Label>
              <Input
                placeholder="John Doe"
                type="text"
                id="cardholderName"
                name="cardholderName"
                onChange={handleInputChange}
                className="h-12 text-base"
                required
              />
            </div>
          ) : null}
          <div className="pt-5">
            <PaymentElement
              onChange={(e) => {
                setPaymentType(e.value.type)
              }}
              onReady={() => setIsElementsReady(true)}
            />
          </div>
          <Input type="hidden" name="currency" value={currency} />
          <Input type="hidden" name="amount" value={amount} />
          <Separator className="mb-7 mt-8" />
          <CancellationPolicy />
          <div className="pt-6">
            <Button
              type="submit"
              size={"lg"}
              className="w-44 text-[16px]"
              disabled={isLoading || !isElementsReady}
            >
              <PaymentStatus />
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default function ElementsForm({
  userEmail,
  amount,
  currency,
  carId,
  userId,
  checkin,
  checkout,
}: {
  userEmail: string
  amount: number
  currency: string
  carId: string
  userId: string
  checkin: string
  checkout: string
}): JSX.Element {
  console.log("[ElementsForm] received checkin:", checkin, "checkout:", checkout)
  return (
    <Elements
      stripe={getStripe()}
      options={{
        appearance: {
          theme: "flat",
          variables: {
            colorBackground: "#FFFFFF",
            colorDanger: "#dc2626",
            borderRadius: "0.375rem", // Tailwind's md border-radius (6px)
            spacingUnit: "8px",
            fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
          },
          rules: {
            ".Input": {
              border: "1px solid rgb(212 212 212)", // border-neutral-300
              padding: "10px 12px",
              borderRadius: "0.375rem",
              boxShadow: "none",
              lineHeight: "26px",
              transition: "border-color 0.15s ease, box-shadow 0.15s ease",
            },
            ".Input:focus, .Input:focus-visible": {
              outline: "2px solid transparent",
              outlineOffset: "2px",
              boxShadow: "0 0 0 2px #fff, 0 0 0 4px rgb(10, 10, 10)",
            },
            ".Input--invalid": {
              boxShadow: "0 0 0 1px var(--colorDanger)",
            },
            ".Label": {
              fontSize: "0.875rem", // Tailwind's sm text size
              fontWeight: "500",
              lineHeight: "1",
              marginBottom: "0.5rem",
            },
            ".Error": {
              color: "#dc2626",
              fontSize: "0.875rem", // Matching the label size
              marginTop: "0.25rem",
            },
          },
        },
        currency: currency,
        mode: "payment",
        amount: formatAmountForStripe(amount, currency),
      }}
    >
      <CheckoutForm 
        userEmail={userEmail} 
        amount={amount} 
        currency={currency}
        carId={carId}
        userId={userId}
        checkin={checkin}
        checkout={checkout}
      />
    </Elements>
  )
}
