import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/layouts/AdminLayout';
import { Map, MapControls } from '@/components/ui/map';
import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Cone, Construction, MapPin, StopCircle } from 'lucide-react';

// Subcomponents
import { SearchBox } from './components/map/SearchBox';
import { HazardPins } from './components/map/HazardPins';
import { MapController } from './components/map/MapController';
import { EmergencyRiders } from './components/map/EmergencyRiders';
import { getHazardColor, getHazardTailwindColors } from '@/lib/hazards';
import { type HazardLog } from '@/types/models';
import { RIDER_DEFS, type EmergencyAlert } from './components/map/riderData';
import { findNearestHazard } from './components/map/riderUtils';

const STYLE_STANDARD = 'mapbox://styles/mapbox/standard';

const HAZARD_STATS: {
    type: string;
    label: string;
    icon: React.ReactNode;
    description: string;
}[] = [
    { type: 'Pothole',        label: 'Potholes',       icon: <AlertCircle className="w-5 h-5" />,  description: 'Surface defects'    },
    { type: 'Road Excavation', label: 'Excavations',   icon: <Construction className="w-5 h-5" />, description: 'Active digging'     },
    { type: 'Road Barrier',   label: 'Road Barriers',  icon: <Cone className="w-5 h-5" />,         description: 'Blocked lanes'      },
    { type: 'Traffic Sign',   label: 'Traffic Signs',  icon: <MapPin className="w-5 h-5" />,       description: 'Signage detected'   },
    { type: 'Traffic Light',  label: 'Traffic Lights', icon: <StopCircle className="w-5 h-5" />,   description: 'Detected locations' },
];

interface MapPageProps {
    hazards: HazardLog[];
}

function RealTimeClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="font-heading flex flex-col text-right border border-border/50 bg-background/50 backdrop-blur-sm p-3 rounded-xl shadow-sm">
            <span className="text-xl font-bold tracking-tight leading-none mb-1 text-primary">{time.toLocaleTimeString()}</span>
            <span className="text-xs text-muted-foreground font-medium">
                {time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
        </div>
    );
}

export default function MapPage({ hazards }: MapPageProps) {
    // Map theme preset
    const [lightPreset, setLightPreset] = useState<'day' | 'night' | 'dusk' | 'dawn'>('day');

    // Hazard filter state
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    useEffect(() => {
        const types = Array.from(new Set(hazards.map(h => h.type)));
        setActiveFilters(types);
    }, [hazards]);

    const filteredHazards = useMemo(() => hazards.filter(h => activeFilters.includes(h.type)), [hazards, activeFilters]);
    const availableTypes = useMemo(() => Array.from(new Set(hazards.map(h => h.type))), [hazards]);

    // Emergency alert state
    const [activeEmergencies, setActiveEmergencies] = useState<EmergencyAlert[]>([]);

    const handleSimulateEmergency = () => {
        const usedIds = activeEmergencies.map(e => e.riderId);
        const available = RIDER_DEFS.filter(def => !usedIds.includes(def.id));
        if (!available.length) return;

        const def = available[0];
        const accidentWaypoint = def.waypoints[Math.floor(def.waypoints.length / 2)];

        const emergency: EmergencyAlert = {
            id: Date.now().toString(),
            riderId: def.id,
            riderName: def.name,
            colorBase: def.colorBase,
            coords: accidentWaypoint,
            userInfo: def.userInfo,
            triggeredAt: new Date().toISOString(),
            nearestHazard: findNearestHazard(accidentWaypoint, hazards),
        };

        setActiveEmergencies(prev => [...prev, emergency]);
    };

    const handleResolveEmergency = (id: string) => {
        setActiveEmergencies(prev => prev.filter(e => e.id !== id));
    };

    const hasAvailableRiders = activeEmergencies.length < RIDER_DEFS.length;

    return (
        <AdminLayout>
            <Head title="Live Map" />

            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">Live Map Tracker</h1>
                    <p className="text-muted-foreground mt-1">
                        Monitor real-time road hazards and system edge devices.
                    </p>
                </div>
                <RealTimeClock />
            </div>

            {/* ── Stats row ─────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
                {HAZARD_STATS.map((stat) => (
                    <Card key={stat.type} className="border-border/50 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-2 rounded-lg bg-background shadow-sm border">
                                    <div className={getHazardTailwindColors(stat.type).split(' ')[0]}>
                                        {stat.icon}
                                    </div>
                                </div>
                                <div className="text-2xl font-bold font-heading">
                                    {hazards.filter(h => h.type === stat.type).length}
                                </div>
                            </div>
                            <p className="text-sm font-medium leading-snug">{stat.label}</p>
                            <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{stat.description}</p>
                            <div
                                className="h-0.5 rounded-full mt-3 opacity-60"
                                style={{ backgroundColor: getHazardColor(stat.type) }}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ── Map card ──────────────────────────────────────────── */}
            <Card className="h-[700px] flex flex-col overflow-hidden border-border/50 shadow-md">
                <div className="w-full h-full relative">
                    <Map
                        styles={{ light: STYLE_STANDARD, dark: STYLE_STANDARD }}
                        className="w-full h-full relative"
                    >
                        <MapController
                            hazards={filteredHazards}
                            activeFilters={activeFilters}
                            setActiveFilters={setActiveFilters}
                            availableTypes={availableTypes}
                            lightPreset={lightPreset}
                            setLightPreset={setLightPreset}
                            onSimulateEmergency={handleSimulateEmergency}
                            hasAvailableRiders={hasAvailableRiders}
                        />
                        <HazardPins hazards={filteredHazards} theme={lightPreset} />
                        <EmergencyRiders
                            theme={lightPreset}
                            hazards={filteredHazards}
                            emergencies={activeEmergencies}
                            onResolve={handleResolveEmergency}
                        />
                        <SearchBox />
                        <MapControls position="top-right" showZoom showCompass />
                    </Map>
                </div>
            </Card>
        </AdminLayout>
    );
}
