'use client';

import { useUser } from '@/hooks/use-user';
import { Route } from '@/lib/consts';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const { user, isLoading } = useUser({ hideToast: true });
  const router = useRouter();
  const searchParams = useSearchParams();
  const googleAuthStatus = searchParams.get('googleAuth');

  useEffect(() => {
    if (isLoading) return;
    if (googleAuthStatus === 'failed') {
      toast.error('User with such email not found');
    }
    if (user) {
      router.push(Route.DASHBOARD);
    } else {
      router.push(Route.LOGIN);
    }
  }, [user, isLoading]);

  return null;
}
