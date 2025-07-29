import { useState, useEffect } from 'react';

function useAccessToken() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // This runs only in the client-side
    const token = getAccessTokenFromCookies();
    setAccessToken(token);
  }, []); // Empty dependency array ensures it runs only once on mount

  return accessToken;
}

function getAccessTokenFromCookies() {
  if (typeof document !== "undefined") {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('access_token=')) {
        return cookie.substring('access_token='.length);
      }
    }
  }
  return null;
}

export default useAccessToken;
