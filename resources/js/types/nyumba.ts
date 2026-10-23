// Shapes returned by the Laravel API (app/Http/Resources/*).

export type ListingStatus =
    | 'upcoming_vacancy'
    | 'recently_vacated'
    | 'community_confirmed_vacant'
    | 'unconfirmed'
    | 'possibly_occupied'
    | 'occupied_pending_confirmation'
    | 'occupied'
    | 'archived'
    | 'removed';

export type VerificationBadge =
    | 'phone'
    | 'id'
    | 'tenant'
    | 'evidence'
    | 'multi'
    | 'updated'
    | 'review';

export interface NamedRef {
    id: number;
    name: string;
}

export interface County extends NamedRef {
    code: string | null;
    slug: string;
    latitude: string | number | null;
    longitude: string | number | null;
}

export interface ScoreEntry {
    score: number;
    note?: string | null;
}

export interface HiddenCosts {
    water?: string | null;
    garbage?: string | null;
    service_charge?: string | null;
    parking?: string | null;
    other?: string | null;
    move_in_total?: string | null;
    note?: string | null;
}

export interface ListingDetails {
    floor?: string | null;
    furnishing?: string | null;
    pets?: string | null;
    electricity?: string | null;
    water_source?: string | null;
    privacy?: 'public' | 'verified_only' | null;
    likely_vacant?: string | null;
    reporter_last_checked_at?: string | null;
    features?: string[];
    internet?: string[];
    facilities?: string[];
    // Only present for the owner / admins:
    block_wing?: string | null;
    unit_number?: string | null;
}

export interface ListingCondition {
    id: number;
    listing_id: number;
    expected_hidden_costs: HiddenCosts | null;
    scores: Record<string, ScoreEntry> | null;
}

export interface ListingReview {
    id: number;
    listing_id: number;
    lived_from: string | null;
    lived_to: string | null;
    pros: string | null;
    cons: string | null;
    how_repairs_handled: string | null;
    recurring_issues: string | null;
    reason_for_leaving: string | null;
    advice: string | null;
}

export interface ListingMedia {
    id: number;
    listing_id: number;
    type: 'photo' | 'video';
    label: string | null;
    url: string | null;
    created_at: string;
}

export interface ListingLocation {
    county: NamedRef | null;
    town: NamedRef | null;
    estate: NamedRef | null;
    sub_estate: NamedRef | null;
    /** Only for signed-in users. */
    building: NamedRef | null;
    latitude: number | null;
    longitude: number | null;
}

export interface Listing {
    id: number;
    building_id: number;
    title: string;
    house_type: string;
    bedrooms: number | null;
    bathrooms: number | null;
    last_monthly_rent: number;
    deposit_amount: number | null;
    move_out_date: string | null;
    is_vacancy_confirmed_by_reporter: boolean;
    status: ListingStatus;
    expires_at: string | null;
    trust_score: number;
    confirmed_count: number;
    last_confirmed_at: string | null;
    location: ListingLocation | null;
    directions: string | null;
    directions_restricted: boolean;
    nearest_stage: string | null;
    details: ListingDetails;
    photos_count: number;
    has_video: boolean;
    thumbnail: string | null;
    saved_count: number;
    is_saved: boolean;
    is_owner: boolean;
    rating: number | null;
    badges: VerificationBadge[];
    condition?: ListingCondition;
    review?: ListingReview;
    media?: ListingMedia[];
    created_at: string;
    updated_at: string;
}

export interface Confirmation {
    id: number;
    listing_id: number;
    type: string;
    who: string;
    text: string;
    note: string | null;
    reported_rent_amount: number | null;
    visited_at: string | null;
    helpful_count: number;
    is_helpful: boolean;
    is_mine: boolean;
    created_at: string;
}

export interface ApiNotification {
    id: number;
    category: 'saved' | 'alerts' | 'you' | 'account';
    icon: string | null;
    title: string;
    body: string | null;
    listing_id: number | null;
    unread: boolean;
    created_at: string;
}

export interface SearchAlert {
    id: number;
    title: string;
    area: string | null;
    max_rent: number | null;
    house_types: string[];
    bedrooms: number | null;
    bedrooms_plus: boolean;
    amenities: string[];
    frequency: 'instant' | 'daily' | 'weekly';
    channels: string[];
    is_active: boolean;
    matches_count?: number;
}

export interface Conversation {
    id: number;
    listing_id: number;
    listing_label: string | null;
    status: 'pending' | 'accepted' | 'declined' | 'blocked';
    as_owner: boolean;
    counterpart: string;
    blocked_by_me: boolean;
    expires_at: string | null;
    is_expired: boolean;
    last_message: { body: string; created_at: string } | null;
    messages: { id: number; from: 'me' | 'them'; body: string; created_at: string }[] | null;
}

export interface Profile {
    id: number;
    name: string;
    email: string;
    joined_at: string;
    trust_level: string;
    verification: { phone: boolean; identity: boolean; contributor: boolean };
    metrics: {
        reports_posted: number;
        confirmations: number;
        helpful_votes: number;
        trust_score: number;
        reports_active: number;
        saved_homes: number;
        search_alerts: number;
        reviews: number;
    };
    trust_levels: { title: string; description: string; achieved: boolean }[];
    privacy: {
        hide_public_name: boolean;
        hide_profile_photo: boolean;
        allow_questions: boolean;
        messages_disabled_after: string | null;
        directions_verified_only: boolean;
        show_activity_status: boolean;
    };
}
