import { useEffect, type ReactNode } from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/layouts/AdminLayout";
import { toast } from "@/lib/toast";
import { SosStats } from "./components/sos/SosStats";
import { SosTable } from "./components/sos/SosTable";
import { EmergencyHotlinesPanel } from "./components/sos/EmergencyHotlinesPanel";
import {
    type PaginatedData,
    type SosRiderSummary,
} from "@/types/models";

interface PageProps {
    riders: PaginatedData<SosRiderSummary>;
    stats: {
        total_today: number;
        total_week: number;
        pending: number;
        resolved: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function SosLogs({ riders, stats, filters }: PageProps) {
    useEffect(() => {
        const channel = window.Echo.channel("riders.live");
        channel.listen(".emergency.triggered", (data: { rider_name?: string; username?: string }) => {
            toast.info({
                title: "New SOS Alert",
                description: `${data.rider_name ?? data.username ?? "A rider"} triggered an emergency.`,
            });
            router.reload({ only: ["riders", "stats"] });
        });

        return () => {
            window.Echo.leave("riders.live");
        };
    }, []);

    return (
        <>
            <Head title="SOS Alert History" />

            {/* Header */}
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">
                        SOS Alert History
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Rider-triggered emergency alerts and dispatch status.
                    </p>
                </div>
            </div>

            <SosStats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <SosTable riders={riders} filters={filters} />
                </div>
                <EmergencyHotlinesPanel />
            </div>
        </>
    );
}

SosLogs.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;
