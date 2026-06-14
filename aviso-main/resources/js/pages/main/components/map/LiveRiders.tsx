import { useEffect, useRef, useState } from "react";
import { useMap } from "@/components/ui/map";
import mapboxgl from "mapbox-gl";

type LngLat = [number, number];

type RiderDef = {
    id: string;
    name: string;
    colorBase: string; // Used to derive dynamic colors based on theme
    waypoints: LngLat[];
    fallbackRoute: LngLat[];
    userInfo: {
        fullName: string;
        username: string;
        contact: string;
        address: string;
    };
};

const RIDER_DEFS: RiderDef[] = [
    {
        id: "rider-1",
        name: "Rider 1 - San Jose Gusu",
        colorBase: "blue",
        userInfo: {
            fullName: "Maria Santos",
            username: "rider_maria",
            contact: "09171234002",
            address: "Calarian, Zamboanga City"
        },
        waypoints: [
            [122.04565, 6.93137], // HAZ-123
            [122.04691, 6.93008], // HAZ-122
            [122.04761, 6.92941], // HAZ-120
            [122.04718, 6.92781], // HAZ-125
            [122.05202, 6.92752], // HAZ-117
            [122.04707, 6.92311], // HAZ-116
            [122.04777, 6.92048], // HAZ-118
        ],
        fallbackRoute: [
            [122.04565, 6.93137],
            [122.04691, 6.93008],
            [122.04761, 6.92941],
            [122.04718, 6.92781],
            [122.05202, 6.92752],
            [122.04707, 6.92311],
            [122.04777, 6.92048],
            [122.04565, 6.93137], // loop back
        ],
    },
    {
        id: "rider-2",
        name: "Rider 2 - Pasonanca Road",
        colorBase: "green",
        userInfo: {
            fullName: "Pedro Reyes",
            username: "rider_pedro",
            contact: "09171234003",
            address: "San Roque, Zamboanga City"
        },
        waypoints: [
            [122.07278, 6.96092], // HAZ-067 (Carmen Valley area)
            [122.07248, 6.96029], // HAZ-066
            [122.07143, 6.95321], // HAZ-073
            [122.07176, 6.95118], // HAZ-068
            [122.07303, 6.94563], // HAZ-069
            [122.07148, 6.94142], // San Roque (End route)
        ],
        fallbackRoute: [
            [122.07278, 6.96092],
            [122.07248, 6.96029],
            [122.07143, 6.95321],
            [122.07176, 6.95118],
            [122.07303, 6.94563],
            [122.07148, 6.94142],
            [122.07303, 6.94563],
            [122.07176, 6.95118],
            [122.07143, 6.95321],
            [122.07248, 6.96029],
            [122.07278, 6.96092],
        ],
    },
    {
        id: "rider-3",
        name: "Rider 3 - Putik to Tugbungan",
        colorBase: "orange",
        userInfo: {
            fullName: "Ana Gomez",
            username: "rider_ana",
            contact: "09171234004",
            address: "Tugbungan, Zamboanga City"
        },
        waypoints: [
            [122.100390, 6.946790], // Putik
            [122.079750, 6.922120], // Tugbungan
            [122.100390, 6.946790], // Loop back to Putik
        ],
        fallbackRoute: [
            [122.100390, 6.946790],
            [122.079750, 6.922120],
            [122.100390, 6.946790],
        ],
    },
];

type Rider = {
    id: string;
    name: string;
    colorBase: string;
    route: LngLat[];
    userInfo: RiderDef["userInfo"];
};

// Map colorBase + theme to an actual hex color
function getRiderThemeColor(base: string, theme: 'day' | 'night' | 'dusk' | 'dawn'): string {
    if (theme === 'night') {
        if (base === 'blue') return '#00f0ff'; // neon cyan
        if (base === 'green') return '#39ff14'; // neon green
        if (base === 'orange') return '#ff9900'; // neon orange
    } else if (theme === 'dusk') {
        if (base === 'blue') return '#4c1d95'; // deep violet
        if (base === 'green') return '#15803d'; // forest green
        if (base === 'orange') return '#c2410c'; // rust orange
    } else if (theme === 'dawn') {
        if (base === 'blue') return '#818cf8'; // indigo
        if (base === 'green') return '#86efac'; // mint green
        if (base === 'orange') return '#fdba74'; // soft orange
    }
    // Day (default)
    if (base === 'blue') return '#3b82f6';
    if (base === 'green') return '#10b981';
    if (base === 'orange') return '#f59e0b';
    return '#3b82f6';
}

function interpolate(p1: LngLat, p2: LngLat, t: number): LngLat {
    return [p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t];
}

function getBearing(p1: LngLat, p2: LngLat): number {
    const dLon = p2[0] - p1[0];
    const dLat = p2[1] - p1[1];
    return Math.atan2(dLon, dLat) * (180 / Math.PI);
}

// Fetch a road-snapped route between waypoints via the Mapbox Directions API.
// Returns the full geometry coordinate array, or null on failure.
async function fetchRoadRoute(
    waypoints: LngLat[],
    token: string,
): Promise<LngLat[] | null> {
    if (!token) return null;
    const coordsParam = waypoints
        .map(([lng, lat]) => `${lng},${lat}`)
        .join(";");
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
        console.error("Directions API request failed", err);
        return null;
    }
}

// Build the marker's DOM element once. Movement is updated imperatively
// afterwards via marker.setLngLat / marker.setRotation, so React never
// needs to re-render this.
//
// Icon design — navigation arrow (points north by default):
//   • With rotationAlignment:'map' + pitchAlignment:'map', Mapbox pins
//     the element to the map surface so it lies flat in 3D pitch view.
//   • marker.setRotation(bearing) then rotates it to face the direction
//     of travel. This works correctly at any pitch/bearing combination.
//   • The SVG has no inline CSS rotation — all rotation is through
//     Mapbox's own transform so the icon never diverges from the route.
function createMarkerElement(
    color: string,
    onClick: () => void,
): HTMLDivElement {
    const wrapper = document.createElement("div");
    // 28 px gives a clear icon at zoom 14-17 without dominating the map
    wrapper.style.width = "28px";
    wrapper.style.height = "28px";
    wrapper.style.cursor = "pointer";
    wrapper.style.position = "relative";
    wrapper.className = "rider-marker-wrapper";

    wrapper.innerHTML = `
        <!-- Subtle expanding ring: gives a "live" feel without obscuring roads -->
        <div style="
            position:absolute;
            inset:4px;
            border-radius:9999px;
            background:${color};
            opacity:0.2;
            animation: rider-ping 1.8s cubic-bezier(0,0,0.2,1) infinite;
        "></div>

        <!--
          Navigation-arrow SVG — classic GPS cursor shape.
          Arrow points UP (north) at rotation 0. Mapbox rotates the
          whole element via setRotation(bearing) so the tip always
          faces the direction of travel, in both 2-D and 3-D views.

          Outer ring:  solid fill, gives a visible base at any zoom.
          Inner arrow: white outline so the tip is crisp against the ring.
        -->
        <svg
            viewBox="0 0 44 44"
            xmlns="http://www.w3.org/2000/svg"
            style="
                position:relative;
                z-index:1;
                width:28px;
                height:28px;
                overflow:visible;
                filter: drop-shadow(0 2px 8px rgba(0,0,0,0.55));
            "
        >
            <!-- Filled circle base -->
            <circle cx="22" cy="22" r="19" fill="${color}" stroke="white" stroke-width="2"/>

            <!-- Arrow body — tip points north (up = direction of travel after rotation) -->
            <!-- Tail notch gives a classic chevron look that reads clearly in 3-D -->
            <path
                d="M22,6 L33,34 L22,28 L11,34 Z"
                fill="white"
                opacity="0.95"
            />
        </svg>
    `;

    wrapper.addEventListener("click", (e) => {
        e.stopPropagation();
        onClick();
    });

    return wrapper;
}

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
                    const roadRoute = await fetchRoadRoute(
                        def.waypoints,
                        token,
                    );
                    return {
                        id: def.id,
                        name: def.name,
                        colorBase: def.colorBase,
                        userInfo: def.userInfo,
                        route:
                            roadRoute && roadRoute.length > 1
                                ? roadRoute
                                : def.fallbackRoute,
                    };
                }),
            );
            if (!cancelled) setRiders(resolved);
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!isLoaded || !map || !riders) return;

        // Inject pulse keyframes once
        if (!document.getElementById("rider-pulse-style")) {
            const style = document.createElement("style");
            style.id = "rider-pulse-style";
            style.textContent = `
                @keyframes rider-ping {
                    0% { transform: scale(1); opacity: 0.25; }
                    75%, 100% { transform: scale(1.8); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        // Route lines
        // Update layers and markers colors when theme changes
        riders.forEach((rider) => {
            const hexColor = getRiderThemeColor(rider.colorBase, theme);
            const sourceId = `route-${rider.id}`;
            const layerId = `route-line-${rider.id}`;

            if (!map.getSource(sourceId)) {
                map.addSource(sourceId, {
                    type: "geojson",
                    data: {
                        type: "Feature",
                        properties: {},
                        geometry: {
                            type: "LineString",
                            coordinates: rider.route,
                        },
                    },
                });

                map.addLayer({
                    id: `${layerId}-outline`,
                    type: "line",
                    source: sourceId,
                    layout: { "line-join": "round", "line-cap": "round" },
                    paint: {
                        "line-color": hexColor,
                        "line-width": 8,
                        "line-opacity": 0.3,
                        "line-blur": 2,
                    },
                });

                map.addLayer({
                    id: layerId,
                    type: "line",
                    source: sourceId,
                    layout: { "line-join": "round", "line-cap": "round" },
                    paint: {
                        "line-color": hexColor,
                        "line-width": 5,
                        "line-opacity": 0.8,
                    },
                });
            } else {
                // Update existing layers
                if (map.getLayer(`${layerId}-outline`)) {
                    map.setPaintProperty(`${layerId}-outline`, 'line-color', hexColor);
                }
                if (map.getLayer(layerId)) {
                    map.setPaintProperty(layerId, 'line-color', hexColor);
                }
            }

            // Create or update markers
            if (!markersRef.current[rider.id]) {
                const el = createMarkerElement(hexColor, () => {
                    setFollowingRider((prev) =>
                        prev === rider.id ? null : rider.id,
                    );
                });
                wrapperRefs.current[rider.id] = el;

                const marker = new mapboxgl.Marker({
                    element: el,
                    anchor: "center",
                    pitchAlignment: "viewport",
                    rotationAlignment: "map"
                })
                    .setLngLat(rider.route[0])
                    .addTo(map);

                markersRef.current[rider.id] = marker;
            } else {
                // Update SVG color inline for existing marker
                const wrapper = wrapperRefs.current[rider.id];
                if (wrapper) {
                    const ring = wrapper.firstElementChild as HTMLElement;
                    if (ring) ring.style.background = hexColor;
                    
                    const svg = wrapper.querySelector('svg');
                    if (svg) {
                        const circle = svg.querySelector('circle');
                        if (circle) circle.setAttribute('fill', hexColor);
                    }
                }
            }
        });

        startTimeRef.current = Date.now();

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTimeRef.current;

            riders.forEach((rider, riderIndex) => {
                // Stagger each rider by 2.5 s so they never meet at a junction
                const delay = riderIndex * 2500;
                const adjustedTime = elapsed - delay;

                let currentCoords: LngLat;
                let bearing: number;

                if (adjustedTime < 0) {
                    currentCoords = rider.route[0];
                    bearing = getBearing(rider.route[0], rider.route[1]);
                } else {
                    // Target ~120 s per full loop; clamp to 1200–4000 ms/segment.
                    // 1200 ms floor (up from 800) keeps the riders visibly slow
                    // enough that their position is readable at normal zoom.
                    const totalSegments = rider.route.length - 1;
                    const segmentDuration = Math.min(
                        4000,
                        Math.max(1200, 120_000 / Math.max(totalSegments, 1)),
                    );
                    const totalDuration = totalSegments * segmentDuration;

                    const loopedTime = adjustedTime % totalDuration;
                    const currentSegmentFloat = loopedTime / segmentDuration;
                    const segmentIndex = Math.floor(currentSegmentFloat);
                    const segmentProgress = currentSegmentFloat - segmentIndex;

                    const safeSegmentIndex = Math.min(
                        segmentIndex,
                        totalSegments - 1,
                    );
                    const startPoint = rider.route[safeSegmentIndex];
                    const endPoint =
                        rider.route[safeSegmentIndex + 1] || rider.route[0];

                    currentCoords = interpolate(
                        startPoint,
                        endPoint,
                        segmentProgress,
                    );
                    bearing = getBearing(startPoint, endPoint);
                }

                const marker = markersRef.current[rider.id];
                if (marker) {
                    marker.setLngLat(currentCoords);
                    // Use Mapbox's built-in rotation (works correctly with
                    // rotationAlignment/pitchAlignment: 'map') instead of a
                    // CSS transform, which would only rotate in screen space.
                    marker.setRotation(bearing);
                }

                // Camera follow and live info update — read from ref, not state, so no re-render needed
                if (followingRiderRef.current === rider.id) {
                    map.easeTo({
                        center: currentCoords,
                        bearing,
                        zoom: 16,
                        pitch: 50,
                        duration: 100,
                    });

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

            Object.values(markersRef.current).forEach((marker) =>
                marker.remove(),
            );
            markersRef.current = {};

            try {
                riders.forEach((rider) => {
                    const layerId = `route-line-${rider.id}`;
                    const sourceId = `route-${rider.id}`;

                    if (map.getLayer(`${layerId}-outline`))
                        map.removeLayer(`${layerId}-outline`);
                    if (map.getLayer(layerId)) map.removeLayer(layerId);
                    if (map.getSource(sourceId)) map.removeSource(sourceId);
                });
            } catch (e) {
                // Map style might be already destroyed
            }
        };
        // Note: deliberately NOT depending on followingRider —
        // that's read via followingRiderRef instead, so the
        // markers/animation are only ever set up once per `riders` value.
        // Theme is included in dependency array so colors update without restarting animation
    }, [isLoaded, map, riders, theme]);

    const activeRider = riders?.find(r => r.id === followingRider);

    return (
        <>
            {activeRider && (
                <div className="absolute bottom-8 left-3 z-10 bg-background/95 backdrop-blur shadow-xl border rounded-xl p-4 w-72 transition-all">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                            <div 
                                className="w-3 h-3 rounded-full animate-pulse shadow-sm" 
                                style={{ backgroundColor: getRiderThemeColor(activeRider.colorBase, theme) }} 
                            />
                            <h3 className="font-bold text-sm tracking-tight">{activeRider.name}</h3>
                        </div>
                        <button 
                            onClick={() => setFollowingRider(null)}
                            className="text-muted-foreground hover:text-foreground hover:bg-muted p-1 rounded-md transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="font-medium text-foreground">Status:</span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-600 border border-green-500/30">
                                Active Patrol
                            </span>
                        </div>
                        <div className="pt-1">
                            <strong className="text-foreground block text-xs uppercase tracking-wider mb-1">Assigned User</strong>
                            <p className="flex justify-between mb-0.5">
                                <span>Name:</span> <span className="font-medium text-foreground">{activeRider.userInfo.fullName}</span>
                            </p>
                            <p className="flex justify-between mb-0.5">
                                <span>Username:</span> <span className="font-mono text-xs">{activeRider.userInfo.username}</span>
                            </p>
                            <p className="flex justify-between mb-0.5">
                                <span>Contact:</span> <span>{activeRider.userInfo.contact}</span>
                            </p>
                            <p className="flex justify-between">
                                <span>Address:</span> <span className="truncate max-w-[120px]" title={activeRider.userInfo.address}>{activeRider.userInfo.address}</span>
                            </p>
                            <div className="mt-2 pt-2 border-t border-border/50">
                                <p className="flex justify-between items-center">
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Live GPS:</span> 
                                    <span id="live-rider-coords" className="font-mono text-[10px] font-bold tracking-tight text-foreground bg-muted px-1.5 py-0.5 rounded">
                                        Loading...
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
