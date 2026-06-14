import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { HazardStats } from './components/hazards/HazardStats';
import { HazardTable } from './components/hazards/HazardTable';
import { type HazardLog, type PaginatedData } from '@/types/models';

// Stats matches the key/value counts passed from the controller
interface StatsData {
    [key: string]: number;
}

interface PageProps {
    hazards: PaginatedData<HazardLog>;
    stats: StatsData;
    areaCounts: StatsData;
    filters: {
        search?: string;
        type?: string;
        area?: string;
        status?: string;
    };
    types: string[];
    areas: string[];
}

export default function HazardLogs({ hazards, stats, areaCounts, filters, types, areas }: PageProps) {
    const totalHazards = hazards.total;

    const exportCsv = () => {
        // Construct the current URL with filters, but add export=csv
        const url = new URL(window.location.href);
        url.searchParams.set('export', 'csv');
        window.location.href = url.toString();
    };

    return (
        <AdminLayout>
            <Head title="Hazard Logs" />

            {/* Header */}
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">Hazard Logs</h1>
                    <p className="text-muted-foreground mt-1">
                        Historical and active detections from edge devices.
                    </p>
                </div>
                <Button variant="outline" onClick={exportCsv}>
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                </Button>
            </div>

            <HazardStats 
                totalHazards={totalHazards} 
                types={types} 
                stats={stats} 
            />

            <HazardTable 
                hazards={hazards} 
                filters={filters} 
                types={types} 
                areas={areas} 
            />
            
        </AdminLayout>
    );
}
