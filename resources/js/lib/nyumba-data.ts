// Static UI configuration only (labels, option lists, badge copy).
// Real listings, users, notifications etc. all come from the API — see lib/api.ts.
import type { ListingStatus, ScoreEntry, VerificationBadge } from '@/types/nyumba';

export const formatKes = (amount: number | string) =>
    `KES ${Number(amount).toLocaleString('en-KE')}`;

export const STATUS_META: Record<
    ListingStatus,
    { label: string; tip: string; className: string }
> = {
    community_confirmed_vacant: {
        label: 'Community Confirmed',
        tip: 'At least one community member reported this home as vacant after a recent physical visit.',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    recently_vacated: {
        label: 'Recently Vacated',
        tip: 'A former tenant reported moving out of this home recently.',
        className: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    upcoming_vacancy: {
        label: 'Upcoming Vacancy',
        tip: 'The current tenant says they plan to move out on a stated date.',
        className: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    unconfirmed: {
        label: 'Needs Reconfirmation',
        tip: 'No community member has confirmed this report recently.',
        className: 'bg-stone-100 text-stone-600 border-stone-200',
    },
    possibly_occupied: {
        label: 'Possibly Occupied',
        tip: 'Someone reported that this home may already be taken.',
        className: 'bg-red-50 text-red-700 border-red-200',
    },
    occupied_pending_confirmation: {
        label: 'Occupied (pending check)',
        tip: 'A new tenant was reported. Moderators are waiting for more confirmations.',
        className: 'bg-red-50 text-red-700 border-red-200',
    },
    occupied: {
        label: 'Occupied',
        tip: 'This home has been confirmed as taken.',
        className: 'bg-red-50 text-red-700 border-red-200',
    },
    archived: {
        label: 'Archived',
        tip: 'This report expired or was closed.',
        className: 'bg-stone-100 text-stone-600 border-stone-200',
    },
    removed: {
        label: 'Removed',
        tip: 'This report was removed by moderators.',
        className: 'bg-stone-100 text-stone-600 border-stone-200',
    },
};

/** Statuses a visitor can ever see (used by the help page legend). */
export const PUBLIC_STATUS_KEYS: ListingStatus[] = [
    'community_confirmed_vacant',
    'recently_vacated',
    'upcoming_vacancy',
    'unconfirmed',
    'possibly_occupied',
];

export const VERIFICATION_META: Record<
    VerificationBadge,
    { label: string; tip: string; className: string }
> = {
    phone: {
        label: 'Phone Verified',
        tip: 'This contributor confirmed a Kenyan phone number with a one-time code.',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    id: {
        label: 'Identity Verified',
        tip: 'The contributor completed optional ID and selfie verification. Documents are never shown publicly.',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    tenant: {
        label: 'Verified Former Tenant',
        tip: 'Private evidence of past occupancy was reviewed by NyumbaHub moderators.',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    evidence: {
        label: 'Evidence Provided',
        tip: 'Photos or a blurred document were attached to this report.',
        className: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    multi: {
        label: 'Multiple Confirmations',
        tip: 'Two or more community members confirmed after separate visits.',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    updated: {
        label: 'Recently Updated',
        tip: 'Rent, condition or availability was changed in the last 7 days.',
        className: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    review: {
        label: 'Under Review',
        tip: 'A moderator is checking this report before it is fully published.',
        className: 'bg-stone-100 text-stone-600 border-stone-200',
    },
};

/** The one list of property types used by Post, Explore filters, alerts and the home search. */
export const HOUSE_TYPES = [
    'Bedsitter',
    'Studio',
    'Single room',
    '1-Bedroom',
    '2-Bedroom',
    '3-Bedroom',
    'Maisonette',
    'House',
] as const;

// ---- Explore filters: [value sent to GET /api/listings, label] ----------------
export const AVAILABILITY_FILTERS: [string, string][] = [
    ['upcoming_vacancy', 'Upcoming vacancy'],
    ['recently_vacated', 'Recently vacated'],
    ['community_confirmed_vacant', 'Community-confirmed vacant'],
];

export const CONDITION_FILTERS: [string, string][] = [
    ['water4', 'Water reliable 4★+'],
    ['security4', 'Security 4★+'],
    ['condition4', 'Condition 4★+'],
    ['internet', 'Internet available'],
    ['prepaid', 'Prepaid electricity'],
];

export const AMENITY_FILTERS: [string, string][] = [
    ['parking', 'Parking'],
    ['pets', 'Pet-friendly'],
    ['furnished', 'Furnished'],
    ['unfurnished', 'Unfurnished'],
    ['stage', 'Near matatu stage'],
    ['balcony', 'Balcony'],
    ['lift', 'Lift'],
    ['gated', 'Gated compound'],
];

export const TRUST_FILTERS: [string, string][] = [
    ['verified_tenant', 'Verified former tenant'],
    ['has_media', 'Has photos/video'],
    ['has_confirmation', 'Has community confirmation'],
    ['multi_confirmed', 'Multiple confirmations'],
];

export const REPORTED_WITHIN: [string, string][] = [
    ['1', 'Last 24 hours'],
    ['3', 'Last 3 days'],
    ['7', 'Last 7 days'],
    ['30', 'Last 30 days'],
];

export const CONFIRMED_WITHIN: [string, string][] = [
    ['1', 'Within 24 hours'],
    ['3', 'Within 3 days'],
    ['7', 'Within a week'],
];

export const SORT_OPTIONS: [string, string][] = [
    ['recent', 'Most recently reported'],
    ['confirmed', 'Most recently confirmed'],
    ['rent_asc', 'Lowest last-known rent'],
    ['rating', 'Highest condition rating'],
    ['nearest', 'Closest to my location'],
    ['saved', 'Most saved'],
];

// ---- Post wizard ------------------------------------------------------------
export const CONDITION_FIELDS = [
    'Water reliability',
    'Plumbing',
    'Electricity',
    'Kitchen',
    'Bathroom',
    'Walls and paint',
    'Doors and windows',
    'Floors',
    'Security',
    'Noise level',
    'Natural light',
    'Ventilation',
    'Pests',
    'Mould / leaks',
    'Maintenance response',
    'Value for money',
] as const;

/** Scores shown in the "lived experience" summary on the detail page. */
export const EXPERIENCE_KEYS = [
    'Water reliability',
    'Security',
    'Plumbing',
    'Noise level',
    'Value for money',
    'Maintenance response',
];

export const QUICK_QUESTIONS = [
    'Was water reliable?',
    'What was the actual monthly cost?',
    'How secure is the area at night?',
    'What should I ask the caretaker before paying?',
    'Is it easy to access by matatu?',
];

/** Short chip shown above a card on the Saved page, derived from the listing's current status. */
export const SAVED_FLAGS: Partial<Record<ListingStatus, { label: string; className: string }>> = {
    community_confirmed_vacant: { label: 'Still vacant', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    recently_vacated: { label: 'Recently vacated', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    upcoming_vacancy: { label: 'Upcoming', className: 'bg-sky-50 text-sky-700 border-sky-200' },
    unconfirmed: { label: 'Needs reconfirmation', className: 'bg-stone-100 text-stone-600 border-stone-200' },
    possibly_occupied: { label: 'Possibly occupied', className: 'bg-red-50 text-red-700 border-red-200' },
    occupied_pending_confirmation: { label: 'Possibly occupied', className: 'bg-red-50 text-red-700 border-red-200' },
    occupied: { label: 'Occupied', className: 'bg-red-50 text-red-700 border-red-200' },
};

/** 4.2 -> "Reliable", used for the small card chips (water / security). */
export function scoreLabel(entry: ScoreEntry | undefined): string | null {
    if (!entry || entry.score <= 0) return null;
    if (entry.score >= 5) return 'Excellent';
    if (entry.score >= 4) return 'Good';
    if (entry.score >= 3) return 'Fair';
    return 'Poor';
}
