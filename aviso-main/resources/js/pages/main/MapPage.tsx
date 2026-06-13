import { Head } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import AdminLayout from '@/layouts/AdminLayout';
import { Map, MapControls } from '@/components/ui/map';
import { useEffect, useState } from 'react';
import { Skeleton } from 'boneyard-js/react';

// Subcomponents
import { SearchBox } from './components/map/SearchBox';
import { HazardPins } from './components/map/HazardPins';
import { MapController } from './components/map/MapController';

const STYLE_STANDARD = 'mapbox://styles/mapbox/standard';

export default function MapPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AdminLayout>
            <Head title="Live Map" />

            <div className="mb-6">
                <h1 className="text-3xl font-heading font-bold tracking-tight">Live Map Tracker</h1>
                <p className="text-muted-foreground mt-1">
                    Monitor real-time road hazards and system edge devices.
                </p>
            </div>

            <Skeleton loading={isLoading} animate="pulse" transition>
                <Card className="h-[700px] flex flex-col overflow-hidden border-border/50 shadow-md">
                    <div className="w-full h-full relative">
                        <Map
                            styles={{ light: STYLE_STANDARD, dark: STYLE_STANDARD }}
                            className="w-full h-full relative"
                        >
                            <MapController />
                            <SearchBox />
                            <HazardPins />
                            <MapControls position="top-right" showZoom showCompass />
                        </Map>
                    </div>
                </Card>
            </Skeleton>
        </AdminLayout>
    );
}
