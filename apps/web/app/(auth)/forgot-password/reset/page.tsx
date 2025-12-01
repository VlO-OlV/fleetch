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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"

type ResetPasswordValues = {
  password: string
  confirmPassword: string
}

export default function ResetPasswordPage() {
  const form = useForm<ResetPasswordValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  function onSubmit(values: ResetPasswordValues) {
    if (values.password !== values.confirmPassword) {
      form.setError("confirmPassword", {
        message: "Passwords do not match",
      })
      return
    }
    // Placeholder: wire to your reset password logic
    console.log("Reset password", values.password)
    alert("Password reset successfully")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 md:px-8">
      <div className="flex flex-col items-center w-full rounded-md bg-white p-6 shadow-md">
        <div className="flex items-center gap-4 mb-4">
          <Image src="/logo.png" alt="logo" width={120} height={120} />
        </div>
        <h1 className="text-xl font-semibold mb-4">Create new password</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="New password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="flex-1 mt-2">
              Reset Password
            </Button>

            <div className="flex justify-center text-sm mt-3">
              <Link href="/login" className="text-sky-600">
                Back to login
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
