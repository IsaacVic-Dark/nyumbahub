/** "2 days ago", "Yesterday", "Just now" — for ISO timestamps from the API. */
export function timeAgo(iso: string | null | undefined, fallback = '—'): string {
    if (!iso) {
        return fallback;
    }

    const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;

    return `${Math.floor(months / 12)} year${months >= 24 ? 's' : ''} ago`;
}

/** Compact "6h", "3d", "1w" used in the activity centre. */
export function shortAgo(iso: string | null | undefined): string {
    if (!iso) {
        return '';
    }

    const minutes = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
    if (minutes < 60) return `${Math.max(1, minutes)}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;

    return `${Math.floor(days / 7)}w`;
}

export function formatMonthYear(date: string | null | undefined): string | null {
    if (!date) {
        return null;
    }

    return new Date(date).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' });
}

export function formatDateTime(iso: string | null | undefined): string {
    if (!iso) {
        return '';
    }

    return new Date(iso).toLocaleString('en-KE', {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
    });
}
