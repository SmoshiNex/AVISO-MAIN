import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/layouts/AdminLayout';
import { Map, MapControls } from '@/components/ui/map';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Cone, Construction, MapPin, ShieldAlert, StopCircle } from 'lucide-react';

// Subcomponents
import { SearchBox } from './components/map/SearchBox';
import { HazardPins } from './components/map/HazardPins';
import { MapController } from './components/map/MapController';
import { EmergencyRiders } from './components/map/EmergencyRiders';
import { getHazardColor, getHazardTailwindColors } from '@/lib/hazards';
import { toast } from '@/lib/toast';
import { type HazardLog } from '@/types/models';
import { type EmergencyAlert, type LngLat } from './components/map/riderData';
import { findNearestHazard } from './components/map/riderUtils';

const STYLE_STANDARD = 'mapbox://styles/mapbox/standard';

const HAZARD_STATS: {
    types: string[];
    label: string;
    icon: React.ReactNode;
    description: string;
}[] = [
    { types: ['Pothole'],                                                                  label: 'Potholes',       icon: <AlertCircle className="w-5 h-5" />,  description: 'Surface defects'    },
    { types: ['Road Excavation'],                                                          label: 'Excavations',    icon: <Construction className="w-5 h-5" />, description: 'Active digging'     },
    { types: ['Road Barrier'],                                                             label: 'Road Barriers',  icon: <Cone className="w-5 h-5" />,         description: 'Blocked lanes'      },
    { types: ['Traffic Sign'],                                                             label: 'Traffic Signs',  icon: <MapPin className="w-5 h-5" />,       description: 'Signage detected'   },
    { types: ['Traffic Light Red', 'Traffic Light Orange', 'Traffic Light Green'],         label: 'Traffic Lights', icon: <StopCircle className="w-5 h-5" />,   description: 'Red / Orange / Green' },
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
    // Map theme preset — respects localStorage preference set in Settings
    const [lightPreset, setLightPreset] = useState<'day' | 'night' | 'dusk' | 'dawn'>(
        () => (localStorage.getItem('aviso_map_theme') as 'day' | 'night' | 'dusk' | 'dawn') ?? 'day'
    );

    // Hazard filter state
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    useEffect(() => {
        const types = Array.from(new Set(hazards.map(h => h.type)));
        setActiveFilters(types);
    }, [hazards]);

    const filteredHazards = useMemo(() => hazards.filter(h => activeFilters.includes(h.type)), [hazards, activeFilters]);
    const availableTypes = useMemo(() => Array.from(new Set(hazards.map(h => h.type))), [hazards]);

    // ── Jarvis audio ─────────────────────────────────────────────────────
    const audioCtxRef     = useRef<AudioContext | null>(null);
    const sosBufRef       = useRef<AudioBuffer | null>(null);
    const alarmSrcRef     = useRef<AudioBufferSourceNode | null>(null);
    const alarmActiveRef  = useRef(false);
    const pendingAlarmRef = useRef(false);
    const startLoopRef    = useRef<() => void>(() => {});

    useEffect(() => {
        let initing = false;

        const tryInit = async () => {
            if (audioCtxRef.current || initing) return;
            initing = true;
            console.log('[AVISO AUDIO] tryInit — creating AudioContext with user gesture');
            try {
                const ctx = new AudioContext();
                console.log('[AVISO AUDIO] AudioContext created, state:', ctx.state);

                // Race resume against 2 s — prevents initing from staying true if Chrome
                // queues the promise (e.g. called without a real gesture somehow).
                await Promise.race([
                    ctx.resume(),
                    new Promise<void>((_, reject) =>
                        setTimeout(() => reject(new Error('resume timeout')), 2000)
                    ),
                ]);
                console.log('[AVISO AUDIO] After resume(), state:', ctx.state);

                if (ctx.state !== 'running') {
                    console.warn('[AVISO AUDIO] Still suspended — closing and waiting for next gesture.');
                    await ctx.close();
                    initing = false;
                    return;
                }

                audioCtxRef.current = ctx;
                console.log('[AVISO AUDIO] AudioContext ready ✓');
                const res = await fetch('/jarvis/sos', { credentials: 'same-origin' });
                console.log('[AVISO AUDIO] /jarvis/sos response status:', res.status);
                if (res.ok) sosBufRef.current = await ctx.decodeAudioData(await res.arrayBuffer());
                console.log('[AVISO AUDIO] SOS buffer loaded:', !!sosBufRef.current);
                if (pendingAlarmRef.current) {
                    pendingAlarmRef.current = false;
                    startLoopRef.current();
                }
            } catch (err) {
                console.warn('[AVISO AUDIO] Error in tryInit:', err);
                initing = false;
            }
        };

        console.log('[AVISO AUDIO] Waiting for first user gesture to init AudioContext.');
        toast.info({
            title: 'Click to enable audio',
            description: 'Click anywhere on the map to activate emergency audio alerts.',
        });

        // Do NOT call tryInit() on mount — Chrome blocks AudioContext without a gesture
        // and the pending ctx.resume() promise keeps initing=true, blocking all future clicks.
        document.addEventListener('click',      tryInit);
        document.addEventListener('keydown',    tryInit);
        document.addEventListener('touchstart', tryInit);
        return () => {
            document.removeEventListener('click',      tryInit);
            document.removeEventListener('keydown',    tryInit);
            document.removeEventListener('touchstart', tryInit);
        };
    }, []);

    const startAlarmLoop = () => {
        if (!audioCtxRef.current || !sosBufRef.current) {
            pendingAlarmRef.current = true; // retry on next user interaction
            return;
        }
        if (alarmActiveRef.current) return;
        alarmActiveRef.current = true;

        const loop = () => {
            if (!alarmActiveRef.current || !audioCtxRef.current || !sosBufRef.current) return;
            const src = audioCtxRef.current.createBufferSource();
            src.buffer = sosBufRef.current;
            src.connect(audioCtxRef.current.destination);
            src.onended = () => {
                alarmSrcRef.current = null;
                if (alarmActiveRef.current) setTimeout(loop, 3000);
            };
            alarmSrcRef.current = src;
            src.start();
        };
        loop();
    };
    startLoopRef.current = startAlarmLoop; // keep ref in sync on every render

    const stopAlarmLoop = () => {
        alarmActiveRef.current = false;
        pendingAlarmRef.current = false;
        try { alarmSrcRef.current?.stop(); } catch {}
        alarmSrcRef.current = null;
    };

    // Emergency alert state — populated from real Reverb broadcasts
    const [activeEmergencies, setActiveEmergencies] = useState<EmergencyAlert[]>([]);

    // Stop alarm when all emergencies are resolved
    useEffect(() => {
        if (activeEmergencies.length === 0) stopAlarmLoop();
    }, [activeEmergencies.length]);

    useEffect(() => {
        const pusher = (window.Echo as any).connector?.pusher;
        if (pusher) {
            pusher.connection.bind('state_change', (states: { previous: string; current: string }) => {
                console.log(`[AVISO WS] ${states.previous} → ${states.current}`);
            });
            pusher.connection.bind('connected', () => {
                console.log('[AVISO WS] Connected to Reverb ✓  socket_id:', pusher.connection.socket_id);
            });
            pusher.connection.bind('disconnected', () => {
                console.warn('[AVISO WS] Disconnected from Reverb');
            });
            pusher.connection.bind('error', (err: unknown) => {
                console.error('[AVISO WS] Connection error:', err);
            });
        }

        if (pusher) {
            console.log('[AVISO WS] Current connection state:', pusher.connection.state);
        }
        console.log('[AVISO WS] Subscribing to channel: riders.live');
        const channel = window.Echo.channel('riders.live');
        channel.listen('.emergency.triggered', (data: any) => {
            console.log('[AVISO WS] 🚨 emergency.triggered received:', data);
            const coords: LngLat = [parseFloat(data.longitude), parseFloat(data.latitude)];
            const riderName = data.rider_name ?? data.rider_code;

            // Deterministic color per rider so repeated SOS events keep the same color
            const COLOR_BASES = ['blue', 'green', 'orange'] as const;
            const colorBase = COLOR_BASES[
                data.rider_code.split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0) % 3
            ];

            const ctx = audioCtxRef.current;
            if (ctx) {
                fetch(`/jarvis/rider-alert?name=${encodeURIComponent(riderName)}`, { credentials: 'same-origin' })
                    .then(res => res.ok ? res.arrayBuffer() : Promise.reject(res.status))
                    .then(buf => ctx.decodeAudioData(buf))
                    .then(buffer => {
                        const src = ctx.createBufferSource();
                        src.buffer = buffer;
                        src.connect(ctx.destination);
                        src.onended = () => startLoopRef.current();
                        src.start();
                    })
                    .catch(() => startLoopRef.current());
            } else {
                startAlarmLoop();
            }

            setActiveEmergencies(prev => {
                const existingIndex = prev.findIndex(e => e.riderId === data.rider_code);
                if (existingIndex !== -1) {
                    const updated = [...prev];
                    updated[existingIndex] = {
                        ...updated[existingIndex],
                        id:          String(data.id),
                        coords,
                        triggeredAt: data.triggered_at,
                    };
                    return updated;
                }
                return [...prev, {
                    id:          String(data.id),
                    riderId:     data.rider_code,
                    riderName,
                    colorBase,
                    coords,
                    userInfo: {
                        fullName: riderName,
                        username: data.username ?? data.rider_code,
                        contact:  data.contact  ?? '—',
                        address:  data.address  ?? '—',
                    },
                    triggeredAt:   data.triggered_at,
                    nearestHazard: findNearestHazard(coords, hazards),
                }];
            });
        });

        // Update emergency marker position as rider moves after SOS
        channel.listen('.location.updated', (data: any) => {
            console.log('[AVISO WS] 📍 location.updated received:', data);
            const newCoords: LngLat = [parseFloat(data.current_lng), parseFloat(data.current_lat)];
            setActiveEmergencies(prev =>
                prev.map(e => e.riderId === data.rider_code ? { ...e, coords: newCoords } : e)
            );
        });

        return () => {
            console.log('[AVISO WS] Leaving channel: riders.live');
            window.Echo.leave('riders.live');
        };
    }, [hazards]);

    const handleResolveEmergency = (id: string) => {
        setActiveEmergencies(prev => prev.filter(e => e.id !== id));
    };

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

            {/* ── SOS Live Status ───────────────────────────────────── */}
            <Card className={`mb-4 overflow-hidden border transition-colors duration-500 shadow-sm ${
                activeEmergencies.length > 0
                    ? 'border-red-500/60 bg-red-50/60 dark:bg-red-950/25'
                    : 'border-border/50'
            }`}>
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        {/* Icon with pulse */}
                        <div className={`relative shrink-0 p-2.5 rounded-lg ${
                            activeEmergencies.length > 0
                                ? 'bg-red-100 dark:bg-red-900/40'
                                : 'bg-background border shadow-sm'
                        }`}>
                            {activeEmergencies.length > 0 && (
                                <span className="absolute inset-0 rounded-lg bg-red-400 animate-ping opacity-25" />
                            )}
                            <ShieldAlert className={`w-5 h-5 ${
                                activeEmergencies.length > 0 ? 'text-red-600' : 'text-muted-foreground'
                            }`} />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-semibold leading-none">SOS Alerts</p>
                                {activeEmergencies.length > 0 && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-500 text-white animate-pulse">
                                        {activeEmergencies.length} ACTIVE
                                    </span>
                                )}
                            </div>
                            <p className={`text-xs mt-1 truncate ${
                                activeEmergencies.length > 0
                                    ? 'text-red-600 dark:text-red-400 font-medium'
                                    : 'text-muted-foreground'
                            }`}>
                                {activeEmergencies.length === 0
                                    ? 'No active emergencies — all riders safe'
                                    : activeEmergencies.map(e => e.riderName).join(', ') + ' — requires immediate assistance'
                                }
                            </p>
                        </div>

                        {/* Count */}
                        <div className={`text-3xl font-bold font-heading shrink-0 ${
                            activeEmergencies.length > 0 ? 'text-red-600' : 'text-muted-foreground'
                        }`}>
                            {activeEmergencies.length}
                        </div>

                        {/* Live dot */}
                        <div className="flex items-center gap-1.5 shrink-0">
                            <span className={`w-2 h-2 rounded-full ${
                                activeEmergencies.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                            }`} />
                            <span className="text-[11px] text-muted-foreground font-medium">LIVE</span>
                        </div>

                    </div>
                </CardContent>
            </Card>

            {/* ── Stats row ─────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
                {HAZARD_STATS.map((stat) => (
                    <Card key={stat.label} className="border-border/50 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-2 rounded-lg bg-background shadow-sm border">
                                    <div className={getHazardTailwindColors(stat.types[0]).split(' ')[0]}>
                                        {stat.icon}
                                    </div>
                                </div>
                                <div className="text-2xl font-bold font-heading">
                                    {hazards.filter(h => stat.types.includes(h.type)).length}
                                </div>
                            </div>
                            <p className="text-sm font-medium leading-snug">{stat.label}</p>
                            <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{stat.description}</p>
                            <div
                                className="h-0.5 rounded-full mt-3 opacity-60"
                                style={{ backgroundColor: getHazardColor(stat.types[0]) }}
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
