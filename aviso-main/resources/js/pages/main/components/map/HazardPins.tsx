import { MapMarker, MarkerContent, MarkerPopup } from '@/components/ui/map';
import { mockHazards, getHazardColor, type HazardRecord } from '@/data/mockHazards';

export function HazardPins() {
    return (
        <>
            {mockHazards.map((h: HazardRecord) => (
                <MapMarker key={h.id} longitude={h.coordinates[0]} latitude={h.coordinates[1]}>
                    <MarkerContent>
                        <div 
                            style={{ backgroundColor: getHazardColor(h.type) }} 
                            className="w-4 h-4 rounded-full border-[3px] border-white shadow-md hover:scale-125 transition-transform"
                            title={h.type}
                        />
                    </MarkerContent>
                    <MarkerPopup closeButton className="w-64 z-50 rounded-xl overflow-hidden p-0">
                        <div className="p-4 text-sm bg-background">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: getHazardColor(h.type) }} />
                                <span className="font-bold text-base">{h.type}</span>
                            </div>
                            <div className="space-y-2 text-muted-foreground">
                                <p className="flex justify-between"><strong className="text-foreground">Detected:</strong> {new Date(h.timestamp).toLocaleTimeString()}</p>
                                <p className="flex justify-between"><strong className="text-foreground">Confidence:</strong> <span className="text-green-600 font-semibold">{h.confidence}%</span></p>
                                <p className="flex justify-between"><strong className="text-foreground">Distance:</strong> {h.distance} m</p>
                                <p className="flex justify-between"><strong className="text-foreground">Rider ID:</strong> <span className="font-mono">{h.riderId}</span></p>
                            </div>
                        </div>
                    </MarkerPopup>
                </MapMarker>
            ))}
        </>
    );
}
