import { Suspense } from 'react';
import HomeRouter from './components/HomeRouter';

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeRouter />
    </Suspense>
  );
}
