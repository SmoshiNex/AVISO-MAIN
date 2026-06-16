import { useEffect, useRef, useState } from 'react';
import { useMap } from '@/components/ui/map';
import mapboxgl from 'mapbox-gl';
import { type EmergencyAlert } from './riderData';
import { type HazardLog } from '@/types/models';
import { createEmergencyMarkerElement } from './createMarkerElement';
import { EmergencyAlertPanel } from './EmergencyAlertPanel';

interface EmergencyRidersProps {
    theme?: 'day' | 'night' | 'dusk' | 'dawn';
    hazards: HazardLog[];
    emergencies: EmergencyAlert[];
    onResolve: (id: string) => void;
}

// Inject SOS keyframes once into the document head
function ensureSosKeyframes() {
    if (document.getElementById('sos-pulse-style')) return;
    const style = document.createElement('style');
    style.id = 'sos-pulse-style';
    style.textContent = `
        @keyframes sos-ping-fast {
            0% { transform: scale(1); opacity: 0.3; }
            70%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes sos-ping-slow {
            0% { transform: scale(1); opacity: 0.4; }
            70%, 100% { transform: scale(2.5); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

export function EmergencyRiders({ theme = 'day', hazards, emergencies, onResolve }: EmergencyRidersProps) {
    const { map, isLoaded } = useMap();
    const markersRef = useRef<Record<string, mapboxgl.Marker>>({});
    const prevCountRef = useRef(0);
    const [activePanel, setActivePanel] = useState<string | null>(null);

    // Keep activePanel in sync: if an emergency is resolved while panel is open, close it
    useEffect(() => {
        if (activePanel && !emergencies.find(e => e.id === activePanel)) {
            setActivePanel(null);
        }
    }, [emergencies, activePanel]);

    useEffect(() => {
        if (!isLoaded || !map) return;
        ensureSosKeyframes();

        const currentIds = new Set(emergencies.map(e => e.id));
        const existingIds = new Set(Object.keys(markersRef.current));

        // Add new markers
        for (const emergency of emergencies) {
            if (!existingIds.has(emergency.id)) {
                const el = createEmergencyMarkerElement(() => {
                    setActivePanel(prev => prev === emergency.id ? null : emergency.id);
                });

                const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
                    .setLngLat(emergency.coords)
                    .addTo(map);

                markersRef.current[emergency.id] = marker;
            }
        }

        // Remove resolved markers
        for (const id of existingIds) {
            if (!currentIds.has(id)) {
                markersRef.current[id].remove();
                delete markersRef.current[id];
            }
        }

        // Fit map to show all markers when the first batch arrives
        if (emergencies.length > 0 && prevCountRef.current === 0) {
            const lngs = emergencies.map(e => e.coords[0]);
            const lats = emergencies.map(e => e.coords[1]);
            map.fitBounds(
                [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
                { padding: 100, duration: 1200, maxZoom: 15 }
            );
        }
        prevCountRef.current = emergencies.length;
    }, [isLoaded, map, emergencies]);

    // Cleanup all markers on unmount
    useEffect(() => {
        return () => {
            Object.values(markersRef.current).forEach(m => m.remove());
            markersRef.current = {};
        };
    }, []);

    const activeEmergency = emergencies.find(e => e.id === activePanel) ?? null;

    const handleResolve = (id: string) => {
        setActivePanel(null);
        onResolve(id);
    };

    return (
        <>
            {activeEmergency && (
                <EmergencyAlertPanel
                    emergency={activeEmergency}
                    theme={theme}
                    onClose={() => handleResolve(activeEmergency.id)}
                />
            )}
        </>
    );
}
