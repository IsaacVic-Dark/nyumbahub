import type {
    ConditionItem,
    ConfirmationEntry,
    Listing,
    ListingStatus,
    VerificationBadge,
} from '@/types/nyumba';

export const formatKes = (amount: number) => `KES ${amount.toLocaleString('en-KE')}`;

export const STATUS_META: Record<
    ListingStatus,
    { label: string; tip: string; className: string }
> = {
    confirmed: {
        label: 'Community Confirmed',
        tip: 'At least one community member reported this home as vacant after a recent physical visit.',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    vacated: {
        label: 'Recently Vacated',
        tip: 'A former tenant reported moving out of this home recently.',
        className: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    upcoming: {
        label: 'Upcoming Vacancy',
        tip: 'The current tenant says they plan to move out on a stated date.',
        className: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    reconfirm: {
        label: 'Needs Reconfirmation',
        tip: 'No community member has confirmed this report recently.',
        className: 'bg-stone-100 text-stone-600 border-stone-200',
    },
    occupied: {
        label: 'Possibly Occupied',
        tip: 'Someone reported that this home may already be taken.',
        className: 'bg-red-50 text-red-700 border-red-200',
    },
};

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

// Cycled across listing card photos until real uploads are wired up.
export const PLACEHOLDER_PHOTOS = [
    '/images/hse_1.jpg',
    '/images/hse_2.jpg',
    '/images/hse_3.webp',
];

// Mock data matching the shape of nyumbahub.html's LISTINGS array.
// Replace with real Eloquent-backed props once the API is wired up.
export const MOCK_LISTINGS: Listing[] = [
    {
        id: 'L1',
        type: '1-Bedroom',
        estate: 'Ruaka',
        town: 'Kiambu',
        county: 'Kiambu',
        title: 'Recently vacated 1-bedroom in Ruaka near Two Rivers',
        rent: 22000,
        deposit: 22000,
        status: 'vacated',
        reported: '2 days ago',
        confirmed: 'Yesterday at 4:15 PM',
        beds: 1,
        baths: 1,
        parking: 'Available',
        water: 'Reliable',
        security: 'Good',
        rating: 4.2,
        savedCount: 0,
        photos: 9,
        video: true,
        badges: ['tenant', 'evidence', 'phone'],
        near: 'Ruaka stage, 7-min walk',
        note: 'The house has good natural light and the caretaker responds quickly. Water was mostly reliable, though there were occasional morning shortages during dry months. Electricity is prepaid. Ask about garbage charges before paying.',
        scores: {
            Water: 4,
            Security: 4,
            Plumbing: 4,
            Noise: 3,
            'Value for money': 4,
            Condition: 4,
            Maintenance: 4,
            Neighbourhood: 4,
        },
    },
    {
        id: 'L2',
        type: 'Bedsitter',
        estate: 'South B',
        town: 'Nairobi',
        county: 'Nairobi',
        title: 'Bedsitter reported vacant in South B, Mariakani side',
        rent: 11500,
        deposit: 11500,
        status: 'confirmed',
        reported: '4 days ago',
        confirmed: '6 hours ago',
        beds: 0,
        baths: 1,
        parking: 'None',
        water: 'Very reliable',
        security: 'Very good',
        rating: 4.5,
        savedCount: 38,
        photos: 7,
        video: false,
        badges: ['tenant', 'multi', 'evidence'],
        near: 'Mariakani stage, 4-min walk',
        note: 'Quiet plot with a resident caretaker and borehole backup. Rent was paid before the 5th. Water bill was shared monthly, around KES 500.',
        scores: {
            Water: 5,
            Security: 4,
            Plumbing: 4,
            Noise: 3,
            'Value for money': 5,
            Condition: 4,
            Maintenance: 3,
            Neighbourhood: 4,
        },
    },
    {
        id: 'L3',
        type: 'Studio',
        estate: 'Kilimani',
        town: 'Nairobi',
        county: 'Nairobi',
        title: 'Studio apartment reported vacated off Argwings Kodhek',
        rent: 34000,
        deposit: 34000,
        status: 'reconfirm',
        reported: '19 days ago',
        confirmed: '12 days ago',
        beds: 0,
        baths: 1,
        parking: 'Available',
        water: 'Reliable',
        security: 'Excellent',
        rating: 4.0,
        savedCount: 21,
        photos: 12,
        video: true,
        badges: ['id', 'evidence'],
        near: 'Yaya stage, 9-min walk',
        note: 'Great security with CCTV and a manned gate. Service charge is separate — confirm it before signing anything.',
        scores: {
            Water: 4,
            Security: 5,
            Plumbing: 4,
            Noise: 2,
            'Value for money': 3,
            Condition: 4,
            Maintenance: 4,
            Neighbourhood: 5,
        },
    },
    {
        id: 'L4',
        type: '2-Bedroom',
        estate: 'Kasarani',
        town: 'Nairobi',
        county: 'Nairobi',
        title: '2-bedroom reported vacated in Kasarani, Sunton',
        rent: 19000,
        deposit: 19000,
        status: 'confirmed',
        reported: '6 days ago',
        confirmed: '2 days ago',
        beds: 2,
        baths: 2,
        parking: 'Available',
        water: 'Fair',
        security: 'Good',
        rating: 3.8,
        savedCount: 54,
        photos: 8,
        video: false,
        badges: ['tenant', 'phone'],
        near: 'Sunton stage, 5-min walk',
        note: 'Spacious for the price. Water rationing on some Tuesdays, so the tank matters. Matatus are easy to get before 8pm.',
        scores: {
            Water: 3,
            Security: 4,
            Plumbing: 3,
            Noise: 3,
            'Value for money': 4,
            Condition: 4,
            Maintenance: 3,
            Neighbourhood: 3,
        },
    },
    {
        id: 'L5',
        type: 'Bedsitter',
        estate: 'Rongai',
        town: 'Kajiado',
        county: 'Kajiado',
        title: 'Bedsitter in Rongai reported vacant near Maasai Mall',
        rent: 9000,
        deposit: 9000,
        status: 'upcoming',
        reported: '1 day ago',
        confirmed: 'Not yet confirmed',
        beds: 0,
        baths: 1,
        parking: 'None',
        water: 'Fair',
        security: 'Fair',
        rating: 3.5,
        savedCount: 12,
        photos: 5,
        video: false,
        badges: ['phone', 'evidence'],
        near: 'Rongai stage, 11-min walk',
        note: 'Affordable and close to shops. I am moving out at the end of the month, so plan your visit after that date.',
        scores: {
            Water: 3,
            Security: 3,
            Plumbing: 3,
            Noise: 2,
            'Value for money': 5,
            Condition: 3,
            Maintenance: 3,
            Neighbourhood: 3,
        },
    },
    {
        id: 'L6',
        type: '1-Bedroom',
        estate: 'Embakasi',
        town: 'Nairobi',
        county: 'Nairobi',
        title: '1-bedroom reported vacated in Embakasi, Pipeline edge',
        rent: 14000,
        deposit: 14000,
        status: 'occupied',
        reported: '11 days ago',
        confirmed: '3 days ago',
        beds: 1,
        baths: 1,
        parking: 'None',
        water: 'Reliable',
        security: 'Fair',
        rating: 3.4,
        savedCount: 9,
        photos: 6,
        video: false,
        badges: ['phone'],
        near: 'Pipeline stage, 3-min walk',
        note: 'Very convenient for transport but noisy at night. A visitor reported the unit may now be taken — please reconfirm at the gate.',
        scores: {
            Water: 4,
            Security: 3,
            Plumbing: 3,
            Noise: 2,
            'Value for money': 4,
            Condition: 3,
            Maintenance: 2,
            Neighbourhood: 3,
        },
    },
];

// Generic detailed condition checklist shown on every listing's detail page
// (matches nyumbahub.html's shared `cond` array — not per-listing yet).
export const CONDITION_REPORT: ConditionItem[] = [
    { label: 'Walls and paint', score: 4, note: 'Repainted before I moved in; small scuff near the door.' },
    { label: 'Flooring', score: 4, note: 'Tiles intact, no cracks.' },
    { label: 'Doors and windows', score: 4, note: 'Lockable grills on all windows.' },
    { label: 'Plumbing', score: 4, note: 'No leaks in 14 months.' },
    { label: 'Bathroom', score: 3, note: 'Shower pressure drops in the evening.' },
    { label: 'Kitchen', score: 4, note: 'Two-plate space, tiled counter.' },
    { label: 'Electrical sockets & meter', score: 4, note: 'Prepaid token meter, 6 sockets.' },
    { label: 'Natural light', score: 5, note: 'Faces east, bright mornings.' },
    { label: 'Ventilation', score: 4, note: 'Cross ventilation with two windows.' },
    { label: 'Mould or dampness', score: 4, note: 'None noticed.' },
    { label: 'Pest history', score: 3, note: 'Occasional cockroaches during rains.' },
    { label: 'Water reliability', score: 4, note: 'Tank backup, rare morning shortages.' },
    { label: 'Security', score: 4, note: 'Manned gate until 10pm, CCTV at entrance.' },
    { label: 'Noise', score: 3, note: 'Nearby church on Sundays.' },
    { label: 'Lift condition', score: 0, note: 'Not applicable — 3-storey walk-up.' },
];

// Generic community confirmation feed shown on every listing's detail page
// (matches nyumbahub.html's shared CONFIRMS array).
export const MOCK_CONFIRMATIONS: ConfirmationEntry[] = [
    {
        who: 'Verified community member',
        when: 'Yesterday, 4:15 PM',
        text: 'I passed by the gate and the caretaker confirmed the house is still vacant.',
        helpful: 14,
    },
    {
        who: 'Trusted Tenant',
        when: '3 days ago',
        text: 'Rent was updated from KES 20,000 to KES 22,000 according to the caretaker.',
        helpful: 9,
    },
    {
        who: 'Verified community member',
        when: '5 days ago',
        text: 'Visited on a Saturday morning. Water was running and the compound was clean.',
        helpful: 6,
    },
];

export const GALLERY_LABELS = ['LIVING AREA', 'KITCHEN', 'BATHROOM'];
export const EVIDENCE_PHOTO_LABELS = [
    'LIVING',
    'BEDROOM',
    'KITCHEN',
    'BATHROOM',
    'EXTERIOR',
    'GATE / COMPOUND',
];

// Contextual flag shown on each card in the Saved homes grid.
export const SAVED_FLAGS: Record<string, { label: string; className: string }> = {
    L1: { label: 'Rent updated', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    L2: { label: 'Still vacant', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    L3: { label: 'Needs reconfirmation', className: 'bg-stone-100 text-stone-600 border-stone-200' },
    L4: { label: 'New confirmation', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    L5: { label: 'Upcoming', className: 'bg-sky-50 text-sky-700 border-sky-200' },
    L6: { label: 'Possibly occupied', className: 'bg-red-50 text-red-700 border-red-200' },
};

export interface NotificationItem {
    icon: string;
    title: string;
    body: string;
    when: string;
    unread: boolean;
    category: 'saved' | 'alerts' | 'you' | 'account';
}

export const NOTIFICATIONS: NotificationItem[] = [
    {
        icon: '✅',
        title: 'A saved home was confirmed vacant',
        body: 'Bedsitter in South B — confirmed 6 hours ago',
        when: '6h',
        unread: true,
        category: 'saved',
    },
    {
        icon: '⚠️',
        title: 'A saved home may be occupied',
        body: '1-bedroom in Embakasi — a visitor reported it as taken',
        when: '1d',
        unread: true,
        category: 'saved',
    },
    {
        icon: '💰',
        title: 'Rent was updated on a saved report',
        body: 'Ruaka 1-bedroom: KES 20,000 → KES 22,000',
        when: '3d',
        unread: true,
        category: 'saved',
    },
    {
        icon: '🔔',
        title: 'A new home matches your search alert',
        body: '"Bedsitter under KES 12,000 in South B"',
        when: '3d',
        unread: false,
        category: 'alerts',
    },
    {
        icon: '👍',
        title: 'Someone found your vacancy report helpful',
        body: 'Your Kasarani report received 4 helpful votes',
        when: '4d',
        unread: false,
        category: 'you',
    },
    {
        icon: '💬',
        title: 'Someone asked you a question',
        body: '"Was water reliable during dry months?"',
        when: '5d',
        unread: false,
        category: 'you',
    },
    {
        icon: '🔄',
        title: 'Your report is due for reconfirmation',
        body: 'Kilimani studio has not been confirmed in 12 days',
        when: '6d',
        unread: false,
        category: 'you',
    },
    {
        icon: '🛡️',
        title: 'Your identity verification is complete',
        body: 'You are now eligible for the Trusted Tenant badge',
        when: '1w',
        unread: false,
        category: 'account',
    },
];

export const SEARCH_ALERTS = [
    { title: 'Bedsitter under KES 12,000 in South B', schedule: 'Instant · Push, SMS', matches: '4 new matches' },
    { title: '1BR under KES 25,000 near Ruaka', schedule: 'Daily digest · Push', matches: '1 new match' },
    { title: '2BR under KES 20,000 in Kasarani', schedule: 'Weekly digest · Email', matches: 'No new matches' },
];

export const PROFILE_METRICS: [string, string][] = [
    ['6', 'Vacancy reports posted'],
    ['23', 'Community confirmations'],
    ['184', 'Helpful votes received'],
    ['92%', 'Accuracy score'],
    ['3', 'Reports currently active'],
    ['3', 'Search alerts'],
    ['11', 'Reviews contributed'],
];

export const TRUST_LEVELS: [string, string, boolean][] = [
    ['New Member', 'Can browse and submit confirmations.', true],
    ['Active Contributor', 'Posted at least one accepted report.', true],
    ['Trusted Tenant', 'Verified identity and consistently accurate reports.', true],
    ['Community Verifier', 'High-weight confirmations across many buildings.', false],
    ['NyumbaHub Champion', 'Long-term, exceptional community accuracy.', false],
];

export const PROFILE_NAV: [string, string][] = [
    ['My vacancy reports', '/explore'],
    ['My confirmations', '/confirm'],
    ['Saved homes', '/saved'],
    ['Search alerts', '/alerts'],
    ['Messages', '/messages'],
    ['Notification settings', '/settings/notifications'],
    ['Privacy settings', '/settings/notifications'],
    ['Safety centre', '/safety'],
    ['Help centre', '/help'],
];

export const PRIVACY_TOGGLES: [string, boolean][] = [
    ['Hide my public name', false],
    ['Hide my profile photo', false],
    ['Allow in-app questions on my reports', true],
    ['Disable messages after a chosen date', false],
    ['Share detailed directions only with verified users', true],
    ['Let contributors see my activity status', false],
];

export const QUICK_QUESTIONS = [
    'Was water reliable?',
    'What was the actual monthly cost?',
    'How secure is the area at night?',
    'What should I ask the caretaker before paying?',
    'Is it easy to access by matatu?',
];