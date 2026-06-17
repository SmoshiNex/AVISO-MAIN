import { useState, useEffect } from 'react';
import { X, AlertTriangle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type EmergencyAlert } from './riderData';
import { getRiderThemeColor } from './riderUtils';
import { getHazardTailwindColors } from '@/lib/hazards';

interface EmergencyAlertPanelProps {
    emergency: EmergencyAlert;
    theme: 'day' | 'night' | 'dusk' | 'dawn';
    onClose: () => void;
}

async function reverseGeocode(lng: number, lat: number): Promise<string> {
    const token = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
    if (!token) throw new Error('No Mapbox token');
    const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=neighborhood,locality,district,place&access_token=${token}&language=en&limit=1`
    );
    if (!res.ok) throw new Error('Geocoding request failed');
    const data = await res.json();
    const feature = data.features?.[0];
    if (!feature) throw new Error('No results');

    const ctx: Array<{ id: string; text: string }> = feature.context ?? [];
    const neighborhood = ctx.find(c => c.id.startsWith('neighborhood'))?.text;
    const locality = ctx.find(c => c.id.startsWith('locality'))?.text;
    const district = ctx.find(c => c.id.startsWith('district'))?.text;

    return neighborhood ?? locality ?? district ?? feature.text ?? 'Unknown';
}

export function EmergencyAlertPanel({ emergency, theme, onClose }: EmergencyAlertPanelProps) {
    const riderColor = getRiderThemeColor(emergency.colorBase, theme);
    const hazard = emergency.nearestHazard;
    const lng = Number(emergency.coords[0]);
    const lat = Number(emergency.coords[1]);
    const [resolvedArea, setResolvedArea] = useState<string | null>(null);

    useEffect(() => {
        setResolvedArea(null);
        reverseGeocode(lng, lat)
            .then(area => setResolvedArea(area))
            .catch(() => setResolvedArea(hazard?.area ?? 'Unknown'));
    }, [lng, lat]);

    const triggeredTime = new Date(emergency.triggeredAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    return (
        <div className="absolute bottom-8 left-3 z-10 bg-background/98 backdrop-blur shadow-2xl border border-destructive/30 rounded-xl p-4 w-80 transition-all">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full shadow-sm flex-shrink-0"
                        style={{ backgroundColor: riderColor }}
                    />
                    <h3 className="font-bold text-sm tracking-tight">{emergency.riderName}</h3>
                </div>
                <button
                    onClick={onClose}
                    aria-label="Close emergency panel"
                    className="text-muted-foreground hover:text-foreground hover:bg-muted p-1 rounded-md transition-colors"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* SOS Status */}
            <div className="flex items-center justify-between mb-3 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive" />
                    </span>
                    <span className="text-xs font-bold text-destructive uppercase tracking-wide">Active Emergency</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">{triggeredTime}</span>
            </div>

            {/* Current Position */}
            <div className="border border-border/60 rounded-lg p-3 mb-3 bg-muted/30">
                <div className="flex items-center gap-1.5 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-destructive" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
                        Current Position
                    </span>
                </div>
                <div className="space-y-1 text-[11px] text-muted-foreground">
                    <div className="flex justify-between">
                        <span>Latitude:</span>
                        <span className="font-mono text-foreground">{lat.toFixed(6)}°</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Longitude:</span>
                        <span className="font-mono text-foreground">{lng.toFixed(6)}°</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Area:</span>
                        {resolvedArea !== null ? (
                            <span className="text-foreground font-medium">{resolvedArea}</span>
                        ) : (
                            <span className="text-muted-foreground/60 animate-pulse text-[10px]">Resolving…</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Rider Info */}
            <div className="space-y-1.5 text-sm text-muted-foreground mb-3">
                <strong className="text-foreground block text-xs uppercase tracking-wider mb-2">Assigned Rider</strong>
                <div className="flex justify-between">
                    <span>Name:</span>
                    <span className="font-medium text-foreground">{emergency.userInfo.fullName}</span>
                </div>
                <div className="flex justify-between">
                    <span>Username:</span>
                    <span className="font-mono text-xs">{emergency.userInfo.username}</span>
                </div>
                <div className="flex justify-between">
                    <span>Contact:</span>
                    <span>{emergency.userInfo.contact}</span>
                </div>
                <div className="flex justify-between">
                    <span>Address:</span>
                    <span className="truncate max-w-[160px] text-right" title={emergency.userInfo.address}>
                        {emergency.userInfo.address}
                    </span>
                </div>
            </div>

            {/* Last Detected Hazard */}
            {hazard ? (
                <div className="border border-border/60 rounded-lg p-3 mb-3 bg-muted/30">
                    <div className="flex items-center gap-1.5 mb-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
                            Likely Cause of Incident
                        </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                        <Badge
                            variant="outline"
                            className={`text-[10px] py-0.5 px-2 ${getHazardTailwindColors(hazard.type)}`}
                        >
                            {hazard.type}
                        </Badge>
                        <span className="font-mono text-[10px] text-muted-foreground">{hazard.haz_code}</span>
                    </div>
                    <div className="space-y-1 text-[11px] text-muted-foreground">
                        <div className="flex justify-between">
                            <span>Confidence:</span>
                            <span className="text-foreground font-medium">{hazard.confidence}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Distance:</span>
                            <span className="text-foreground font-medium">{hazard.distance}m</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Detected:</span>
                            <span className="text-foreground font-medium">
                                {new Date(hazard.detected_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="border border-border/60 rounded-lg p-3 mb-3 bg-muted/30 text-xs text-muted-foreground text-center">
                    No nearby hazards in the log.
                </div>
            )}

            {/* Resolve Button */}
            <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={onClose}
            >
                Resolve Emergency
            </Button>
        </div>
    );
}
