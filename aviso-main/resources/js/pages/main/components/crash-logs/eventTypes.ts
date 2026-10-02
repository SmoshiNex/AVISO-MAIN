import { Activity, OctagonAlert, Gauge, Waves, type LucideIcon } from "lucide-react";
import { type RiderEventType } from "@/types/models";

export const EVENT_TYPE_STYLES: Record<RiderEventType, { label: string; icon: LucideIcon; text: string; badge: string }> = {
    normal: {
        label: "Normal riding",
        icon: Activity,
        text: "text-green-600",
        badge: "text-green-700 bg-green-100 border-green-200 dark:bg-green-900/30 dark:border-green-900",
    },
    hard_braking: {
        label: "Hard braking",
        icon: Gauge,
        text: "text-amber-600",
        badge: "text-amber-700 bg-amber-100 border-amber-200 dark:bg-amber-900/30 dark:border-amber-900",
    },
    road_bump: {
        label: "Road bump",
        icon: Waves,
        text: "text-blue-600",
        badge: "text-blue-700 bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:border-blue-900",
    },
    crash: {
        label: "Crash",
        icon: OctagonAlert,
        text: "text-red-600",
        badge: "text-red-700 bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-900",
    },
};
