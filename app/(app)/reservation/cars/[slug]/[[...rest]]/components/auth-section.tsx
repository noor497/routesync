import { Button } from "@/components/ui/button"

export function AuthSection() {
  return (
    <>
      <h2 className="text-[22px] font-semibold">Log in or sign up to book</h2>
      <div className="pt-10">
        <div className="grid grid-cols-1 items-center justify-center gap-4">
          <a href="/api/auth/signin" style={{ width: '100%' }}>
            <Button className="w-full text-[15px]" size={"lg"}>
              Login
            </Button>
          </a>
          <a href="/api/auth/signin?showSignUp=1" style={{ width: '100%' }}>
            <Button variant={"outline"} className="w-full text-[15px]" size={"lg"}>
              Sign up
            </Button>
          </a>
        </div>
      </div>
    </>
  )
}
