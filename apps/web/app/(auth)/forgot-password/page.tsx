'use client';

import Link from 'next/link';
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
import Image from 'next/image';
import { ForgotPasswordDto, forgotPasswordSchema } from '@/validation/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Route } from '@/lib/consts';
import { useI18n } from '@/lib/i18n';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const { t } = useI18n();

  const form = useForm<ForgotPasswordDto>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(data: ForgotPasswordDto) {
    forgotPassword({ ...data });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 md:px-8">
      <div className="flex flex-col items-center w-full rounded-md bg-white p-6 shadow-md">
        <div className="flex items-center gap-4 mb-4">
          <Image src="/logo.png" alt="logo" width={120} height={120} />
        </div>
        <h1 className="text-xl font-semibold mb-4">
          {t('auth.forgot.title', 'Reset password')}
        </h1>

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
                  <FormLabel>{t('login.email', 'Email')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('login.email', 'Email')}
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="flex-1 mt-2">
              {t('auth.forgot.send', 'Send reset link')}
            </Button>

            <div className="flex justify-center text-sm mt-3">
              <Button
                variant={'link'}
                onClick={() => router.push(Route.LOGIN)}
                className="text-sky-600 h-4 p-0"
              >
                {t('auth.forgot.back', 'Back to login')}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
