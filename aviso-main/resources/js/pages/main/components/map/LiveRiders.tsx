import { useEffect, useRef, useState } from 'react';
import { useMap } from '@/components/ui/map';
import mapboxgl from 'mapbox-gl';
import { RIDER_DEFS, type Rider } from './riderData';
import { getRiderThemeColor, interpolate, getBearing, fetchRoadRoute } from './riderUtils';
import { createMarkerElement } from './createMarkerElement';
import { RiderDetailPanel } from './RiderDetailPanel';

export function LiveRiders({ theme = 'day' }: { theme?: 'day' | 'night' | 'dusk' | 'dawn' }) {
    const { map, isLoaded } = useMap();
    const [followingRider, setFollowingRider] = useState<string | null>(null);
    const followingRiderRef = useRef<string | null>(null);
    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(Date.now());
    const markersRef = useRef<Record<string, mapboxgl.Marker>>({});
    const wrapperRefs = useRef<Record<string, HTMLDivElement>>({});
    const [riders, setRiders] = useState<Rider[] | null>(null);

    // Keep ref in sync so the animation loop (set up once) can read
    // the latest "following" target without re-running the effect.
    useEffect(() => {
        followingRiderRef.current = followingRider;
    }, [followingRider]);

    // Resolve each rider's route once: try Directions API for road-snapped
    // geometry, fall back to the hardcoded straight-line route on failure.
    useEffect(() => {
        let cancelled = false;
        const token = import.meta.env.VITE_MAPBOX_TOKEN as string;

        (async () => {
            const resolved = await Promise.all(
                RIDER_DEFS.map(async (def) => {
                    const roadRoute = await fetchRoadRoute(def.waypoints, token);
                    return {
                        id: def.id,
                        name: def.name,
                        colorBase: def.colorBase,
                        userInfo: def.userInfo,
                        route: roadRoute && roadRoute.length > 1 ? roadRoute : def.fallbackRoute,
                    };
                }),
            );
            if (!cancelled) setRiders(resolved);
        })();

        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        if (!isLoaded || !map || !riders) return;

        // Inject pulse keyframes once
        if (!document.getElementById('rider-pulse-style')) {
            const style = document.createElement('style');
            style.id = 'rider-pulse-style';
            style.textContent = `
                @keyframes rider-ping {
                    0% { transform: scale(1); opacity: 0.25; }
                    75%, 100% { transform: scale(1.8); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        riders.forEach((rider) => {
            const hexColor = getRiderThemeColor(rider.colorBase, theme);
            const sourceId = `route-${rider.id}`;
            const layerId = `route-line-${rider.id}`;

            if (!map.getSource(sourceId)) {
                map.addSource(sourceId, {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: { type: 'LineString', coordinates: rider.route },
                    },
                });

                map.addLayer({
                    id: `${layerId}-outline`,
                    type: 'line',
                    source: sourceId,
                    layout: { 'line-join': 'round', 'line-cap': 'round' },
                    paint: { 'line-color': hexColor, 'line-width': 8, 'line-opacity': 0.3, 'line-blur': 2 },
                });

                map.addLayer({
                    id: layerId,
                    type: 'line',
                    source: sourceId,
                    layout: { 'line-join': 'round', 'line-cap': 'round' },
                    paint: { 'line-color': hexColor, 'line-width': 5, 'line-opacity': 0.8 },
                });
            } else {
                if (map.getLayer(`${layerId}-outline`)) {
                    map.setPaintProperty(`${layerId}-outline`, 'line-color', hexColor);
                }
                if (map.getLayer(layerId)) {
                    map.setPaintProperty(layerId, 'line-color', hexColor);
                }
            }

            if (!markersRef.current[rider.id]) {
                const el = createMarkerElement(hexColor, () => {
                    setFollowingRider((prev) => prev === rider.id ? null : rider.id);
                });
                wrapperRefs.current[rider.id] = el;

                const marker = new mapboxgl.Marker({
                    element: el,
                    anchor: 'center',
                    pitchAlignment: 'viewport',
                    rotationAlignment: 'map',
                })
                    .setLngLat(rider.route[0])
                    .addTo(map);

                markersRef.current[rider.id] = marker;
            } else {
                const wrapper = wrapperRefs.current[rider.id];
                if (wrapper) {
                    const ring = wrapper.firstElementChild as HTMLElement;
                    if (ring) ring.style.background = hexColor;

                    const circle = wrapper.querySelector('circle');
                    if (circle) circle.setAttribute('fill', hexColor);
                }
            }
        });

        startTimeRef.current = Date.now();

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTimeRef.current;

            riders.forEach((rider, riderIndex) => {
                const delay = riderIndex * 2500;
                const adjustedTime = elapsed - delay;

                let currentCoords: [number, number];
                let bearing: number;

                if (adjustedTime < 0) {
                    currentCoords = rider.route[0];
                    bearing = getBearing(rider.route[0], rider.route[1]);
                } else {
                    const totalSegments = rider.route.length - 1;
                    const segmentDuration = Math.min(4000, Math.max(1200, 120_000 / Math.max(totalSegments, 1)));
                    const totalDuration = totalSegments * segmentDuration;

                    const loopedTime = adjustedTime % totalDuration;
                    const currentSegmentFloat = loopedTime / segmentDuration;
                    const segmentIndex = Math.floor(currentSegmentFloat);
                    const segmentProgress = currentSegmentFloat - segmentIndex;

                    const safeSegmentIndex = Math.min(segmentIndex, totalSegments - 1);
                    const startPoint = rider.route[safeSegmentIndex];
                    const endPoint = rider.route[safeSegmentIndex + 1] || rider.route[0];

                    currentCoords = interpolate(startPoint, endPoint, segmentProgress);
                    bearing = getBearing(startPoint, endPoint);
                }

                const marker = markersRef.current[rider.id];
                if (marker) {
                    marker.setLngLat(currentCoords);
                    marker.setRotation(bearing);
                }

                if (followingRiderRef.current === rider.id) {
                    map.easeTo({ center: currentCoords, bearing, zoom: 16, pitch: 50, duration: 100 });

                    const coordsEl = document.getElementById('live-rider-coords');
                    if (coordsEl) {
                        coordsEl.textContent = `${currentCoords[1].toFixed(6)}, ${currentCoords[0].toFixed(6)}`;
                    }
                }
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }

            Object.values(markersRef.current).forEach((marker) => marker.remove());
            markersRef.current = {};

            try {
                riders.forEach((rider) => {
                    const layerId = `route-line-${rider.id}`;
                    const sourceId = `route-${rider.id}`;

                    if (map.getLayer(`${layerId}-outline`)) map.removeLayer(`${layerId}-outline`);
                    if (map.getLayer(layerId)) map.removeLayer(layerId);
                    if (map.getSource(sourceId)) map.removeSource(sourceId);
                });
            } catch {
                // Map style might already be destroyed
            }
        };
        // Deliberately NOT depending on followingRider —
        // that's read via followingRiderRef so markers/animation are set up once per `riders` value.
        // Theme is included so colors update without restarting the animation.
    }, [isLoaded, map, riders, theme]);

    const activeRider = riders?.find((r) => r.id === followingRider);

    return (
        <>
            {activeRider && (
                <RiderDetailPanel
                    rider={activeRider}
                    theme={theme}
                    onClose={() => setFollowingRider(null)}
                />
            )}
        </>
    );
}
