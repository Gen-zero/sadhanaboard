import { useEffect, useRef, useState } from 'react';
import { bookApi } from '@/services/bookApi';
import type { BookProgress } from '@/types/books';

export function useBookReading(bookId: number | null) {
  const [progress, setProgress] = useState<BookProgress | null>(null);
  const pendingRef = useRef<{ position?: string; page?: number; percent?: number } | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!bookId) return;
    (async () => {
      try {
        const res = await bookApi.getProgress(bookId as number);
        if (mounted) setProgress(res.data || null);
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, [bookId]);

  const scheduleSave = (payload: { position?: string; page?: number; percent?: number }) => {
    pendingRef.current = { ...(pendingRef.current || {}), ...payload };
    if (timerRef.current) return;
    // save after 5 seconds of inactivity
    timerRef.current = window.setTimeout(async () => {
      const pending = pendingRef.current;
      pendingRef.current = null;
      timerRef.current = null;
      if (!bookId || !pending) return;
      try {
        const res = await bookApi.upsertProgress(bookId as number, pending);
        setProgress(res.data || null);
      } catch (e) {
        // swallow and rely on localStorage fallback
      }
    }, 5000) as unknown as number;
  };

  const immediateSave = async (payload: { position?: string; page?: number; percent?: number }) => {
    if (!bookId) return;
    try {
      const res = await bookApi.upsertProgress(bookId as number, payload);
      setProgress(res.data || null);
    } catch (e) {
      // immediate save failed; rely on localStorage fallback
    }
  };

  return { progress, scheduleSave, immediateSave };
}
