import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useMobileOnly() {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);
      
      if (!mobile) {
        // Redirect to desktop version or show message
        router.push('/dashboard');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [router]);

  return isMobile;
} 