import { useEffect, useState } from 'react';

interface Result {
  success?: boolean;
  message?: string;
  error?: string;
}

type UseRevalidate = [boolean, Result];

export default function useRevalidate(targetPath: string): UseRevalidate {
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const revalidate = async () => {
      setLoading(true);
      const response = await (
        await fetch('/api/work/revalidation', {
          method: 'POST',
          body: JSON.stringify({ targetPath }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      ).json();
      setResult(response);
      setLoading(false);
    };
    revalidate();
  }, [targetPath]);

  return [loading, { ...result }];
}
