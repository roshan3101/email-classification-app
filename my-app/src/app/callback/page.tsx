'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function CallbackPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    if (processed) return; // Prevent multiple executions

    const handleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get('success');
      const data = urlParams.get('data');
      const error = urlParams.get('error');

      if (success === 'true' && data) {
        try {
          const authData = JSON.parse(decodeURIComponent(data));
          const { tokens, user } = authData;
          
          localStorage.setItem('accessToken', tokens.access_token);
          login(user);
          setProcessed(true);
          toast.success('Successfully signed in!');
          router.push('/');
        } catch (error) {
          console.error('Error parsing auth data:', error);
          setProcessed(true);
          toast.error('Authentication failed');
          router.push('/');
        }
      } else if (error) {
        console.error('Authentication error:', error);
        setProcessed(true);
        toast.error('Authentication failed');
        router.push('/');
      } else {
        setProcessed(true);
        router.push('/');
      }
    };

    handleCallback();
  }, [router, login, processed]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}
