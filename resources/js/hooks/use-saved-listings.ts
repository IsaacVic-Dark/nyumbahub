import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

const STORAGE_KEY = 'nyumbahub:saved-listings';

/**
 * Tracks saved listing ids in localStorage. This is a client-only stand-in
 * until saves are persisted per-account on the backend — swap the internals
 * for a real mutation later without changing the hook's API.
 */
export function useSavedListings() {
    const [saved, setSaved] = useState<string[]>([]);

    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (raw) setSaved(JSON.parse(raw));
        } catch {
            // Ignore malformed/blocked storage — falls back to empty state.
        }
    }, []);

    const isSaved = useCallback((id: string) => saved.includes(id), [saved]);

    const toggle = useCallback((id: string) => {
        setSaved((prev) => {
            const wasSaved = prev.includes(id);
            const next = wasSaved ? prev.filter((s) => s !== id) : [...prev, id];
            try {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            } catch {
                // Ignore storage write failures (e.g. private browsing quota).
            }
            toast(
                wasSaved
                    ? 'Removed from saved homes'
                    : 'Saved. We will alert you when the community confirms it.',
            );
            return next;
        });
    }, []);

    return { saved, isSaved, toggle };
}