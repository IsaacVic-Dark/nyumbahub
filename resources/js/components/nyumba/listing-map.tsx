import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import { formatKes } from '@/lib/nyumba-data';
import type { Listing, ListingStatus } from '@/types/nyumba';

export const PIN_COLOR: Record<ListingStatus, string> = {
    community_confirmed_vacant: '#059669',
    recently_vacated: '#f59e0b',
    upcoming_vacancy: '#0284c7',
    unconfirmed: '#a8a29e',
    possibly_occupied: '#dc2626',
    occupied_pending_confirmation: '#dc2626',
    occupied: '#dc2626',
    archived: '#a8a29e',
    removed: '#a8a29e',
};

const TILES = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const KENYA_CENTER: [number, number] = [-1.2921, 36.8219];

function priceIcon(listing: Listing, selected: boolean) {

    return L.divIcon({
        className: '',
        html: `<div style="background:${PIN_COLOR[listing.status]};color:#fff;font-weight:700;font-size:12px;padding:4px 9px;border-radius:999px;box-shadow:0 1px 4px rgba(0,0,0,.35);border:2px solid #fff;white-space:nowrap;transform:${selected ? 'scale(1.25)' : 'none'}">${formatKes(listing.last_monthly_rent).replace('KES ', '')}</div>`,
        iconSize: [0, 0],
    });
}

/** Map of listings with price pins (approximate, 3-decimal coordinates from the API). */
export function ListingsMap({
    listings,
    selectedId,
    onSelect,
    onMoveEnd,
    center,
    className,
}: {
    listings: Listing[];
    /** Recentre the map (e.g. after "use my location"). */
    center?: [number, number] | null;
    selectedId?: number | null;
    onSelect?: (id: number) => void;
    /** Called with "minLat,minLng,maxLat,maxLng" after the user pans/zooms. */
    onMoveEnd?: (bbox: string) => void;
    className?: string;
}) {
    const el = useRef<HTMLDivElement>(null);
    const map = useRef<L.Map | null>(null);
    const layer = useRef<L.LayerGroup | null>(null);
    const moveCb = useRef(onMoveEnd);
    const fitted = useRef(false);

    useEffect(() => {
        moveCb.current = onMoveEnd;
    }, [onMoveEnd]);

    useEffect(() => {
        if (center && map.current) {
            fitted.current = true;
            map.current.setView(center, 14);
        }
    }, [center]);

    useEffect(() => {
        if (!el.current || map.current) return;

        const m = L.map(el.current, { zoomControl: true }).setView(KENYA_CENTER, 11);
        L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(m);
        layer.current = L.layerGroup().addTo(m);
        m.on('moveend', () => {
            const b = m.getBounds();
            moveCb.current?.(`${b.getSouth()},${b.getWest()},${b.getNorth()},${b.getEast()}`);
        });
        map.current = m;

        return () => {
            m.remove();
            map.current = null;
        };
    }, []);

    useEffect(() => {
        const m = map.current;
        const g = layer.current;
        if (!m || !g) return;

        g.clearLayers();
        const points: [number, number][] = [];

        for (const l of listings) {
            const lat = l.location?.latitude;
            const lng = l.location?.longitude;
            if (lat == null || lng == null) continue;

            points.push([lat, lng]);
            L.marker([lat, lng], { icon: priceIcon(l, l.id === selectedId) })
                .on('click', () => onSelect?.(l.id))
                .addTo(g);
        }

        // Fit once to the first batch of results; after that the user drives the view.
        if (!fitted.current && points.length) {
            m.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 15 });
            fitted.current = true;
        }
    }, [listings, selectedId, onSelect]);

    return <div ref={el} className={className} />;
}

/** Small read-only map for the detail page: a circle, never an exact pin. */
export function ApproximateAreaMap({
    latitude,
    longitude,
    className,
}: {
    latitude: number;
    longitude: number;
    className?: string;
}) {
    const el = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!el.current) return;

        const m = L.map(el.current, { zoomControl: false, scrollWheelZoom: false }).setView([latitude, longitude], 15);
        L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(m);
        L.circle([latitude, longitude], { radius: 250, color: '#059669', fillColor: '#10b981', fillOpacity: 0.25 }).addTo(m);

        return () => {
            m.remove();
        };
    }, [latitude, longitude]);

    return <div ref={el} className={className} />;
}

/** Click / drag to choose a point (used when adding a new building). */
export function PinPicker({
    value,
    center,
    onChange,
    className,
}: {
    value: { lat: number; lng: number } | null;
    center: [number, number] | null;
    onChange: (p: { lat: number; lng: number }) => void;
    className?: string;
}) {
    const el = useRef<HTMLDivElement>(null);
    const map = useRef<L.Map | null>(null);
    const marker = useRef<L.Marker | null>(null);
    const cb = useRef(onChange);

    useEffect(() => {
        cb.current = onChange;
    }, [onChange]);

    useEffect(() => {
        if (!el.current || map.current) return;

        const m = L.map(el.current).setView(center ?? KENYA_CENTER, center ? 13 : 6);
        L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(m);
        m.on('click', (e: L.LeafletMouseEvent) => cb.current({ lat: e.latlng.lat, lng: e.latlng.lng }));
        map.current = m;

        return () => {
            m.remove();
            map.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const m = map.current;
        if (!m) return;

        if (!value) {
            marker.current?.remove();
            marker.current = null;
            if (center) m.setView(center, 13);

            return;
        }

        if (!marker.current) {
            marker.current = L.marker([value.lat, value.lng], { draggable: true })
                .on('dragend', () => {
                    const p = marker.current!.getLatLng();
                    cb.current({ lat: p.lat, lng: p.lng });
                })
                .addTo(m);
        } else {
            marker.current.setLatLng([value.lat, value.lng]);
        }
    }, [value, center]);

    return <div ref={el} className={className} />;
}
