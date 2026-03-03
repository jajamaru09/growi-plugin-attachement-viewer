import { useEffect, useState } from 'react';

export function usePageBody(
  pageId: string,
  enabled: boolean,
): { body: string | null; isLoading: boolean } {
  const [body, setBody] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !pageId) return;
    let cancelled = false;
    setIsLoading(true);
    setBody(null);

    fetch(`/_api/v3/page?pageId=${encodeURIComponent(pageId)}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setBody((data?.page?.revision?.body as string) ?? null);
      })
      .catch(() => {
        if (!cancelled) setBody(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [pageId, enabled]);

  return { body, isLoading };
}
