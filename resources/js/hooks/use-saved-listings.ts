import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { api, getErrorMessage } from '@/lib/api';

/**
 * Save / unsave a listing for the signed-in user (POST/DELETE /api/listings/{id}/save).
 * Guests are sent to the login page. `initial` is the listing's `is_saved` from the API.
 */
export function useSaveListing(
    listingId: number,
    initial: boolean,
    onChange?: (saved: boolean) => void,
) {
    const { auth } = usePage().props;
    const [saved, setSaved] = useState(initial);
    const [busy, setBusy] = useState(false);

    const toggle = async () => {
        if (!auth.user) {
            toast('Log in to save homes');
            router.visit('/login');

            return;
        }
        if (busy) {
            return;
        }

        const next = !saved;
        setSaved(next); // optimistic
        setBusy(true);

        try {
            if (next) {
                await api.post(`/listings/${listingId}/save`);
                toast('Saved. We will alert you when the community confirms it.');
            } else {
                await api.delete(`/listings/${listingId}/save`);
                toast('Removed from saved homes');
            }
            onChange?.(next);
        } catch (e) {
            setSaved(!next);
            toast.error(getErrorMessage(e));
        } finally {
            setBusy(false);
        }
    };

    return { saved, busy, toggle };
}
