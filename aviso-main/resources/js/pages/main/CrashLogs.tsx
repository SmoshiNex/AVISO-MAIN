import { type ReactNode } from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { CrashLogStats } from "./components/crash-logs/CrashLogStats";
import { CrashLogTable, type CrashLogFilters } from "./components/crash-logs/CrashLogTable";
import {
    type Barangay,
    type PaginatedData,
    type RiderEventLog,
    type RiderEventTypeStats,
} from "@/types/models";

interface CrashLogsProps {
    events: PaginatedData<RiderEventLog>;
    stats: RiderEventTypeStats[];
    filters: CrashLogFilters;
    types: { value: string; label: string }[];
    barangays: Barangay[];
}

export default function CrashLogs({ events, stats, filters, types, barangays }: CrashLogsProps) {
    // Downloads everything matching the current filters (not just this page).
    const exportCsv = () => {
        const url = new URL(window.location.href);
        url.searchParams.set("export", "csv");
        window.location.href = url.toString();
    };

    return (
        <>
            <Head title="Crash Detection Logs" />

            <div className="flex justify-between items-end mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">Crash Detection Logs</h1>
                    <p className="text-muted-foreground mt-1">
                        Every classification from the riders&apos; IoT units: normal riding, hard braking, road
                        bumps and crashes, with the sensor values behind each one.
                    </p>
                </div>
                <Button variant="outline" onClick={exportCsv}>
                    <Download className="w-4 h-4 mr-2" />
                    Download CSV
                </Button>
            </div>

            <CrashLogStats stats={stats} />
            <CrashLogTable events={events} filters={filters} types={types} barangays={barangays} />
        </>
    );
}

CrashLogs.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;
