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
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import Image from 'next/image';
import { VerifyCodeDto, verifyCodeSchema } from '@/validation/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/use-auth';
import { Route, StorageKey } from '@/lib/consts';
import { useCallback, useEffect } from 'react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n';

export default function VerifyOTPPage() {
  const router = useRouter();
  const { verifyPasswordReset, forgotPassword } = useAuth();
  const { t } = useI18n();

  const resetPasswordEmail = localStorage.getItem(
    StorageKey.RESET_PASSWORD_EMAIL,
  );

  const form = useForm<VerifyCodeDto>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: '',
      email: resetPasswordEmail || '',
    },
  });

  useEffect(() => {
    if (resetPasswordEmail) {
      form.setValue('email', resetPasswordEmail);
    }
  }, [resetPasswordEmail]);

  const onSubmit = (data: VerifyCodeDto) => {
    verifyPasswordReset(
      { ...data },
      {
        onError: (error) => {
          if (error instanceof AxiosError && error.status === 400)
            form.setError('code', {}, { shouldFocus: true });
        },
      },
    );
  };

  const handleResendCode = useCallback(
    (email: string) => {
      forgotPassword(
        { email },
        {
          onSuccess: () => {
            toast.success(t('auth.verify.checkEmail', 'Check your email'));
          },
        },
      );
    },
    [forgotPassword, t],
  );

  const isOtpError = !!form.formState.errors.code;

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 md:px-8">
      <div className="flex flex-col items-center w-full rounded-md bg-white p-6 shadow-md">
        <div className="flex items-center gap-4 mb-4">
          <Image src="/logo.png" alt="logo" width={120} height={120} />
        </div>
        <h1 className="text-xl font-semibold mb-2">
          {t('auth.verify.title', 'Verify email')}
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          {t('auth.verify.enterCode', 'Enter the code sent to your email')}
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full gap-6"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.verify.code', 'Code')}</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="flex-1">
                        <InputOTPSlot
                          index={0}
                          className="flex-1"
                          isError={isOtpError}
                        />
                        <InputOTPSlot
                          index={1}
                          className="flex-1"
                          isError={isOtpError}
                        />
                        <InputOTPSlot
                          index={2}
                          className="flex-1"
                          isError={isOtpError}
                        />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup className="flex-1">
                        <InputOTPSlot
                          index={3}
                          className="flex-1"
                          isError={isOtpError}
                        />
                        <InputOTPSlot
                          index={4}
                          className="flex-1"
                          isError={isOtpError}
                        />
                        <InputOTPSlot
                          index={5}
                          className="flex-1"
                          isError={isOtpError}
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="flex-1">
              {t('auth.verify.verify', 'Verify')}
            </Button>

            <div className="flex justify-center text-sm">
              <Button
                variant={'link'}
                type="button"
                onClick={() =>
                  resetPasswordEmail
                    ? handleResendCode(resetPasswordEmail)
                    : router.push(Route.FORGOT_PASSWORD)
                }
                className="text-sky-600 p-0 h-4"
              >
                {t('auth.verify.sendNew', 'Send new code')}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
