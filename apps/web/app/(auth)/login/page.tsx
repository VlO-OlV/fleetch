'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoginDto, loginSchema } from '@/validation/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/use-auth';
import { ApiEndpoint, Route } from '@/lib/consts';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const form = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: LoginDto) {
    login({ ...data });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 md:px-8">
      <div className="flex flex-col items-center w-full rounded-md bg-white p-6 shadow-md">
        <div className="flex items-center gap-4 mb-4">
          <Image src="/logo.png" alt="logo" width={120} height={120} />
        </div>
        <h1 className="text-xl font-semibold mb-4">Login</h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full gap-3"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="flex-1">
              Sign in
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() =>
                router.push(
                  process.env.NEXT_PUBLIC_BACKEND_URL + ApiEndpoint.GOOGLE_AUTH,
                )
              }
            >
              <p>Sign in with Google</p>
              <Image
                src="/google-logo.png"
                alt="google-logo"
                width={20}
                height={20}
              />
            </Button>

            <div className="flex justify-end text-sm mt-2">
              <Button
                variant={'link'}
                type="button"
                onClick={() => router.push(Route.FORGOT_PASSWORD)}
                className="text-sky-600 p-0 h-4"
              >
                Forgot password?
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
