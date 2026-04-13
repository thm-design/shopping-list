import { useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="relative animate-pulse">
        <div className="relative flex items-center justify-center w-20 h-20 bg-zinc-900 dark:bg-white rounded-xl shadow-2xl">
          <ShoppingBag size={40} className="text-white dark:text-zinc-900" strokeWidth={1.5} />
        </div>
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-1">
        AirList
      </h1>
    </div>
  );
}