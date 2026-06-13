import { useMap } from '@/components/ui/map';
import { Button } from '@/components/ui/button';
import { RotateCcw, Mountain, RefreshCw, Layers } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { mockHazards } from '@/data/mockHazards';

const ZAMBOANGA: [number, number] = [122.0739, 6.9214];

export function MapController() {
    const { map, isLoaded } = useMap();
    const [pitch, setPitch]   = useState(0);
    const [bearing, setBearing] = useState(0);
    const [is3D, setIs3D]     = useState(false);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [lightPreset, setLightPreset] = useState<'day' | 'night' | 'dusk' | 'dawn'>('day');
    
    // 360° Auto-Rotate state
    const [isRotating, setIsRotating] = useState(false);
    const rafRef = useRef<number | null>(null);
    const initRef = useRef(false);

    // Initial setup
    useEffect(() => {
        if (!map || !isLoaded || initRef.current) return;
        initRef.current = true;
        map.jumpTo({ center: ZAMBOANGA, zoom: 14 });
        
        map.setConfigProperty('basemap', 'showPointOfInterestLabels', true);
        map.setConfigProperty('basemap', 'showPlaceLabels', true);
        map.setConfigProperty('basemap', 'showRoadLabels', true);

        // Add Heatmap Source & Layer
        if (!map.getSource('hazards-source')) {
            map.addSource('hazards-source', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: mockHazards.map(h => ({
                        type: 'Feature',
                        geometry: { type: 'Point', coordinates: h.coordinates },
                        properties: { confidence: h.confidence }
                    }))
                }
            });

            map.addLayer({
                id: 'hazards-heat',
                type: 'heatmap',
                source: 'hazards-source',
                maxzoom: 20,
                layout: { visibility: 'none' }, // hidden by default
                paint: {
                    'heatmap-weight': ['interpolate', ['linear'], ['get', 'confidence'], 0, 0, 100, 1],
                    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 11, 1, 15, 3],
                    'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0, 'rgba(33,102,172,0)',
                        0.2, 'rgb(103,169,207)',
                        0.4, 'rgb(209,229,240)',
                        0.6, 'rgb(253,219,199)',
                        0.8, 'rgb(239,138,98)',
                        1, 'rgb(178,24,43)'
                    ],
                    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 11, 15, 15, 30],
                    'heatmap-opacity': 0.7
                }
            });
        }
    }, [map, isLoaded]);

    // Apply Light Preset
    useEffect(() => {
        if (!map || !isLoaded) return;
        map.setConfigProperty('basemap', 'lightPreset', lightPreset);
    }, [lightPreset, map, isLoaded]);

    // Apply Heatmap Visibility
    useEffect(() => {
        if (!map || !isLoaded || !map.getLayer('hazards-heat')) return;
        map.setLayoutProperty('hazards-heat', 'visibility', showHeatmap ? 'visible' : 'none');
    }, [showHeatmap, map, isLoaded]);

    // Track camera values for overlay
    useEffect(() => {
        if (!map || !isLoaded) return;
        const onMove = () => {
            setPitch(Math.round(map.getPitch()));
            setBearing(Math.round(map.getBearing()));
        };
        map.on('move', onMove);
        return () => { map.off('move', onMove); };
    }, [map, isLoaded]);

    // ── 360° rotation helpers ──
    const stopRotation = () => {
        if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        setIsRotating(false);
    };

    const startRotation = () => {
        if (!map) return;
        setIsRotating(true);
        const spin = () => {
            map.setBearing((map.getBearing() + 0.3) % 360);
            rafRef.current = requestAnimationFrame(spin);
        };
        rafRef.current = requestAnimationFrame(spin);
        map.once('mousedown', stopRotation);
        map.once('touchstart', stopRotation);
    };

    const toggleRotate = () => isRotating ? stopRotation() : startRotation();
    useEffect(() => () => stopRotation(), []);

    // ── Buttons ──
    const handle3DView = () => {
        if (!map || is3D) return;
        setIs3D(true);
        map.setConfigProperty('basemap', 'show3dObjects', true);
        if (lightPreset === 'day') setLightPreset('dusk'); // Auto-switch to dusk for better 3D look
        map.easeTo({ pitch: 60, bearing: -20, duration: 1200 });
    };

    const handleReset = () => {
        if (!map) return;
        stopRotation();
        setIs3D(false);
        map.setConfigProperty('basemap', 'show3dObjects', false);
        map.easeTo({ pitch: 0, bearing: 0, duration: 800 });
    };

    if (!isLoaded) return null;

    return (
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            <div className="flex gap-2 flex-wrap items-center bg-background/90 p-1.5 rounded-lg border backdrop-blur shadow-sm">
                {/* 3D toggle */}
                <Button size="sm" variant={is3D ? 'default' : 'ghost'} onClick={handle3DView}>
                    <Mountain className="mr-1.5 h-4 w-4" />
                    3D View
                </Button>

                {/* Reset */}
                <Button size="sm" variant="ghost" onClick={handleReset}>
                    <RotateCcw className="mr-1.5 h-4 w-4" />
                    Reset
                </Button>

                <div className="w-px h-5 bg-border mx-1" />

                {/* Heatmap Toggle */}
                <Button 
                    size="sm" 
                    variant={showHeatmap ? 'default' : 'ghost'} 
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={showHeatmap ? 'bg-orange-600 hover:bg-orange-700 text-white' : ''}
                >
                    <Layers className="mr-1.5 h-4 w-4" />
                    Heatmap
                </Button>

                <div className="w-px h-5 bg-border mx-1" />

                {/* Light Preset Toggle */}
                <select 
                    value={lightPreset} 
                    onChange={(e) => setLightPreset(e.target.value as any)}
                    className="bg-transparent border border-input rounded-md px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                    <option value="day">☀️ Day</option>
                    <option value="night">🌙 Night</option>
                    <option value="dusk">🌅 Dusk</option>
                    <option value="dawn">🌄 Dawn</option>
                </select>

                {/* 360° rotate — only shown in 3D mode */}
                {is3D && (
                    <>
                        <div className="w-px h-5 bg-border mx-1" />
                        <Button size="sm" variant={isRotating ? 'default' : 'ghost'} onClick={toggleRotate}>
                            <RefreshCw className={`mr-1.5 h-4 w-4 ${isRotating ? 'animate-spin' : ''}`} />
                            {isRotating ? 'Stop' : '360°'}
                        </Button>
                    </>
                )}
            </div>

            <div className="bg-background/90 rounded-md border px-3 py-2 font-mono text-xs backdrop-blur shadow-sm w-fit">
                <div>Pitch: {pitch}°</div>
                <div>Bearing: {bearing}°</div>
                {is3D && <div className="text-primary mt-1 font-semibold">● 3D Mode</div>}
                {isRotating && <div className="text-yellow-500 font-semibold">↻ Rotating 360°</div>}
                {showHeatmap && <div className="text-orange-500 font-semibold">🔥 Heatmap Active</div>}
            </div>
        </div>
    );
}
