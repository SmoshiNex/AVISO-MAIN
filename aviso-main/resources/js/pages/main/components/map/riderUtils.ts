import { type LngLat } from './riderData';

export function getRiderThemeColor(base: string, theme: 'day' | 'night' | 'dusk' | 'dawn'): string {
    if (theme === 'night') {
        if (base === 'blue') return '#00f0ff';
        if (base === 'green') return '#39ff14';
        if (base === 'orange') return '#ff9900';
    } else if (theme === 'dusk') {
        if (base === 'blue') return '#4c1d95';
        if (base === 'green') return '#15803d';
        if (base === 'orange') return '#c2410c';
    } else if (theme === 'dawn') {
        if (base === 'blue') return '#818cf8';
        if (base === 'green') return '#86efac';
        if (base === 'orange') return '#fdba74';
    }
    // Day (default)
    if (base === 'blue') return '#3b82f6';
    if (base === 'green') return '#10b981';
    if (base === 'orange') return '#f59e0b';
    return '#3b82f6';
}

export function interpolate(p1: LngLat, p2: LngLat, t: number): LngLat {
    return [p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t];
}

export function getBearing(p1: LngLat, p2: LngLat): number {
    const dLon = p2[0] - p1[0];
    const dLat = p2[1] - p1[1];
    return Math.atan2(dLon, dLat) * (180 / Math.PI);
}

export async function fetchRoadRoute(waypoints: LngLat[], token: string): Promise<LngLat[] | null> {
    if (!token) return null;
    const coordsParam = waypoints.map(([lng, lat]) => `${lng},${lat}`).join(';');
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsParam}?geometries=geojson&overview=full&access_token=${token}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        const coords = data?.routes?.[0]?.geometry?.coordinates;
        if (Array.isArray(coords) && coords.length > 1) {
            return coords as LngLat[];
        }
        return null;
    } catch (err) {
        console.error('Directions API request failed', err);
        return null;
    }
}
