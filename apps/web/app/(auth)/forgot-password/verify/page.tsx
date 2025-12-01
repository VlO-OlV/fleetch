"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import Image from "next/image"

type VerifyOTPValues = {
  otp: string
}

export default function VerifyOTPPage() {
  const form = useForm<VerifyOTPValues>({
    defaultValues: {
      otp: "",
    },
  })

  function onSubmit(values: VerifyOTPValues) {
    // Placeholder: wire to your OTP verification logic
    console.log("Verify OTP", values.otp)
    alert("OTP verified: " + values.otp)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 md:px-8">
      <div className="flex flex-col items-center w-full rounded-md bg-white p-6 shadow-md">
        <div className="flex items-center gap-4 mb-4">
          <Image src="/logo.png" alt="logo" width={120} height={120} />
        </div>
        <h1 className="text-xl font-semibold mb-2">Verify email</h1>
        <p className="text-sm text-gray-600 mb-6">Enter the code sent to your email</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-6">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="flex-1">
                        <InputOTPSlot index={0} className="flex-1" />
                        <InputOTPSlot index={1} className="flex-1" />
                        <InputOTPSlot index={2} className="flex-1" />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup className="flex-1">
                        <InputOTPSlot index={3} className="flex-1" />
                        <InputOTPSlot index={4} className="flex-1" />
                        <InputOTPSlot index={5} className="flex-1" />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="flex-1">
              Verify
            </Button>

            <div className="flex justify-center text-sm">
              <Link href="/forgot-password" className="text-sky-600">
                Send new code
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
