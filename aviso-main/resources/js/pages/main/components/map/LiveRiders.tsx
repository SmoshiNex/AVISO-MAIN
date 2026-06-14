import { useEffect, useRef, useState } from "react";
import { useMap } from "@/components/ui/map";
import mapboxgl from "mapbox-gl";

type LngLat = [number, number];

type RiderDef = {
    id: string;
    name: string;
    color: string;
    // Waypoints for the Directions API request. Mapbox will return
    // road-snapped geometry connecting these points in order.
    // Picked from inside the City Proper hazard cluster
    // (roughly 122.069-122.080, 6.901-6.910) where HAZ-001..015 sit,
    // and which is also the area MapController centers the camera on.
    waypoints: LngLat[];
    // Fallback straight-line route, used only if the Directions API
    // request fails (bad token, offline, etc).
    fallbackRoute: LngLat[];
};

const RIDER_DEFS: RiderDef[] = [
    {
        id: "rider-1",
        name: "Rider 1 - San Jose Gusu",
        color: "#3b82f6",
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
        name: "Rider 2 - Tomas Claudio West Loop",
        color: "#10b981",
        // Covers the western arm along Tomas Claudio St.
        // All lat > 6.906 — safely above the port/waterfront zone.
        // Hazards passed: HAZ-007 (Pothole), HAZ-011 (Road Excavation),
        //                 HAZ-013 (Pothole), HAZ-005 (Traffic Sign)
        waypoints: [
            [122.0750060, 6.9062739], // Tomas Claudio / Climaco junction (GeoJSON)
            [122.0742734, 6.9060994], // Tomas Claudio mid (GeoJSON)
            [122.07194,   6.90701],   // HAZ-003 Road Barrier
            [122.06934,   6.90620],   // HAZ-011 Road Excavation
            [122.06905,   6.90981],   // HAZ-005 Traffic Sign
            [122.07087,   6.90849],   // HAZ-010 Pothole
        ],
        fallbackRoute: [
            [122.0750060, 6.9062739],
            [122.0742734, 6.9060994],
            [122.0736769, 6.9060970],
            [122.0733020, 6.9061001],
            [122.0717179, 6.9061466],
            [122.0733020, 6.9061001],
            [122.0750060, 6.9062739],
        ],
    },
    {
        id: "rider-3",
        name: "Rider 3 - Veterans Ave / Evangelista",
        color: "#f59e0b",
        // Covers the eastern corridor along Veterans Ave (secondary) and
        // Evangelista St, far from Riders 1 & 2 to avoid icon overlap.
        // All lat > 6.907 — safely above the port/waterfront zone.
        // Hazards passed: HAZ-014 (Road Barrier), HAZ-006 (Traffic Light),
        //                 HAZ-010 (Pothole)
        waypoints: [
            [122.0802322, 6.9075767], // Veterans / Tomas Claudio junction (GeoJSON)
            [122.0807387, 6.9077341], // Evangelista St west node (GeoJSON)
            [122.0818640, 6.9080712], // Evangelista St east node (GeoJSON)
            [122.07788,   6.90729],   // HAZ-014 Road Barrier
            [122.07397,   6.90728],   // HAZ-006 Traffic Light
            [122.07087,   6.90849],   // HAZ-010 Pothole
        ],
        fallbackRoute: [
            [122.0802322, 6.9075767],
            [122.0807387, 6.9077341],
            [122.0818640, 6.9080712],
            [122.0807387, 6.9077341],
            [122.0802322, 6.9075767],
            [122.0801636, 6.9080762],
            [122.0794638, 6.9078395],
            [122.0801636, 6.9080762],
            [122.0802322, 6.9075767],
        ],
    },
];

type Rider = {
    id: string;
    name: string;
    color: string;
    route: LngLat[];
};

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

export function LiveRiders() {
    const { map, isLoaded } = useMap();
    const [followingRider, setFollowingRider] = useState<string | null>(null);
    const followingRiderRef = useRef<string | null>(null);
    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(Date.now());
    const markersRef = useRef<Record<string, mapboxgl.Marker>>({});
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
                        color: def.color,
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
        try {
            riders.forEach((rider) => {
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
                            "line-color": rider.color,
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
                            "line-color": rider.color,
                            "line-width": 5,
                            "line-opacity": 0.8,
                        },
                    });
                }
            });
        } catch (e) {
            // Map style might be already destroyed
        }

        // Markers — created once.
        // rotationAlignment/pitchAlignment: 'map' makes the marker behave
        // like a ground-level object: it tilts and rotates together with
        // the map (instead of always facing the screen), so it visually
        // tracks the route line in both 2D and 3D.
        riders.forEach((rider) => {
            const el = createMarkerElement(rider.color, () => {
                setFollowingRider((prev) =>
                    prev === rider.id ? null : rider.id,
                );
            });

            const marker = new mapboxgl.Marker({
                element: el,
                anchor: "center",
                pitchAlignment: "viewport",
                rotationAlignment: "map"
            })
                .setLngLat(rider.route[0])
                .addTo(map);

            markersRef.current[rider.id] = marker;
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

                // Camera follow — read from ref, not state, so no re-render needed
                if (followingRiderRef.current === rider.id) {
                    map.easeTo({
                        center: currentCoords,
                        bearing,
                        zoom: 16,
                        pitch: 50,
                        duration: 100,
                    });
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
    }, [isLoaded, map, riders]);

    // No DOM to render from React's side — everything is
    // imperatively attached to the Mapbox markers above.
    return null;
}
