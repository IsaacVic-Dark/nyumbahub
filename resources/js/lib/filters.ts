export interface ExploreFilters {
    q: string;
    county_id: string;
    town_id: string;
    estate: string;
    house_type: string[];
    min_rent: string;
    max_rent: string;
    min_deposit: string;
    max_deposit: string;
    status: string[];
    reported_within: string;
    confirmed_within: string;
    condition: string[];
    amenities: string[];
    trust: string[];
    sort: string;
}

export const EMPTY_FILTERS: ExploreFilters = {
    q: '',
    county_id: '',
    town_id: '',
    estate: '',
    house_type: [],
    min_rent: '',
    max_rent: '',
    min_deposit: '',
    max_deposit: '',
    status: [],
    reported_within: '',
    confirmed_within: '',
    condition: [],
    amenities: [],
    trust: [],
    sort: 'recent',
};

/** Drops empty values so the query string only carries real filters. */
export function filtersToParams(f: ExploreFilters): Record<string, string | string[]> {
    const out: Record<string, string | string[]> = {};

    for (const [key, value] of Object.entries(f)) {
        if (Array.isArray(value) ? value.length : value !== '') {
            out[key] = value;
        }
    }

    return out;
}

const ARRAY_KEYS = ['house_type', 'status', 'condition', 'amenities', 'trust'] as const;

/** Reads filters from the page's query string (e.g. from the home-page search). */
export function filtersFromSearch(search: string): ExploreFilters {
    const params = new URLSearchParams(search);
    const filters: ExploreFilters = { ...EMPTY_FILTERS };

    for (const key of Object.keys(EMPTY_FILTERS) as (keyof ExploreFilters)[]) {
        if ((ARRAY_KEYS as readonly string[]).includes(key)) {
            const values = [...params.getAll(key), ...params.getAll(`${key}[]`)];
            (filters[key] as string[]) = values.flatMap((v) => v.split(',')).filter(Boolean);
        } else if (params.has(key)) {
            (filters[key] as string) = params.get(key) ?? '';
        }
    }

    return filters;
}
