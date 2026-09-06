export type ListingStatus =
    | 'confirmed'
    | 'vacated'
    | 'upcoming'
    | 'reconfirm'
    | 'occupied';

export type VerificationBadge =
    | 'phone'
    | 'id'
    | 'tenant'
    | 'evidence'
    | 'multi'
    | 'updated'
    | 'review';

export interface Listing {
    id: string;
    type: string;
    estate: string;
    town: string;
    county: string;
    title: string;
    rent: number;
    deposit: number;
    status: ListingStatus;
    reported: string;
    confirmed: string;
    beds: number;
    baths: number;
    parking: string;
    water: string;
    security: string;
    rating: number;
    savedCount: number;
    photos: number;
    video: boolean;
    badges: VerificationBadge[];
    near: string;
    note: string;
    scores: Record<string, number>;
}

export interface ConfirmationEntry {
    who: string;
    when: string;
    text: string;
    helpful: number;
}

export interface ConditionItem {
    label: string;
    score: number;
    note: string;
}