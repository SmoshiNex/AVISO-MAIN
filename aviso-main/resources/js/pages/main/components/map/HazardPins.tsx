import { useState, useMemo, useEffect } from 'react';
import { useMap, MapMarker, MarkerContent, MarkerPopup } from '@/components/ui/map';
import { getHazardColor } from '@/lib/hazards';
import { type HazardLog } from '@/types/models';
import useSupercluster from 'use-supercluster';

export function HazardPins({ hazards = [] }: { hazards?: HazardLog[] }) {
    const { map } = useMap();
    const [bounds, setBounds] = useState<any>(null);
    const [zoom, setZoom] = useState(14);

    useEffect(() => {
        if (!map) return;
        
        const updateBounds = () => {
            const b = map.getBounds();
            if (b) {
                setBounds([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()]);
                setZoom(map.getZoom());
            }
        };

        updateBounds();
        map.on('move', updateBounds);
        map.on('zoom', updateBounds);
        
        return () => {
            map.off('move', updateBounds);
            map.off('zoom', updateBounds);
        };
    }, [map]);

    const points = useMemo(() => {
        return hazards.map((h) => ({
            type: "Feature" as const,
            properties: {
                cluster: false,
                hazardId: h.id,
                hazardType: h.type,
                timestamp: h.detected_at,
                confidence: h.confidence,
                distance: h.distance,
                riderId: h.rider_code,
                area: h.area
            },
            geometry: {
                type: "Point" as const,
                coordinates: [Number(h.longitude), Number(h.latitude)]
            }
        }));
    }, [hazards]);

    // Disabled clustering entirely as requested by user
    return (
        <>
            {points.map(point => {
                const [longitude, latitude] = point.geometry.coordinates;
                const { hazardId, hazardType, timestamp, confidence, distance, riderId, area } = point.properties;

                // Render individual hazard marker
                return (
                    <MapMarker key={hazardId} longitude={longitude} latitude={latitude}>
                        <MarkerContent>
                            <div 
                                style={{ backgroundColor: getHazardColor(hazardType as any) }} 
                                className="w-4 h-4 rounded-full border-[3px] border-white shadow-md hover:scale-125 transition-transform"
                                title={hazardType as string}
                            />
                        </MarkerContent>
                        <MarkerPopup closeButton className="w-64 z-50 rounded-xl overflow-hidden p-0">
                            <div className="p-4 text-sm bg-background">
                                <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: getHazardColor(hazardType as any) }} />
                                    <span className="font-bold text-base">{hazardType}</span>
                                </div>
                                <div className="space-y-2 text-muted-foreground">
                                    <p className="flex justify-between"><strong className="text-foreground">Detected:</strong> {new Date(timestamp as string).toLocaleTimeString()}</p>
                                    <p className="flex justify-between"><strong className="text-foreground">Address/Area:</strong> {area}</p>
                                    <p className="flex justify-between"><strong className="text-foreground">Coordinates:</strong> <span className="font-mono text-[10px]">{latitude.toFixed(6)}, {longitude.toFixed(6)}</span></p>
                                    <p className="flex justify-between"><strong className="text-foreground">Confidence:</strong> <span className="text-green-600 font-semibold">{confidence}%</span></p>
                                    <p className="flex justify-between"><strong className="text-foreground">Distance:</strong> {distance} m</p>
                                    <p className="flex justify-between"><strong className="text-foreground">Rider ID:</strong> <span className="font-mono">{riderId}</span></p>
                                </div>
                            </div>
                        </MarkerPopup>
                    </MapMarker>
                );
            })}
        </>
    );
}
