// Helper to consistently assign colors to hazard types based on map theme
export function getHazardColor(type: string, theme: 'day' | 'night' | 'dusk' | 'dawn' = 'day'): string {
    const palettes = {
        day: {
            "Pothole": "#ef4444", // red-500
            "Road Excavation": "#f97316", // orange-500
            "Road Barrier": "#eab308", // yellow-500
            "Traffic Sign": "#3b82f6", // blue-500
            "Traffic Light": "#22c55e", // green-500
            "default": "#64748b" // slate-500
        },
        night: {
            "Pothole": "#ff0055", // neon pink
            "Road Excavation": "#ff9900", // neon orange
            "Road Barrier": "#fcd34d", // bright yellow
            "Traffic Sign": "#00f0ff", // cyan
            "Traffic Light": "#39ff14", // neon green
            "default": "#94a3b8"
        },
        dusk: {
            "Pothole": "#9f1239", // deep crimson
            "Road Excavation": "#c2410c", // rust orange
            "Road Barrier": "#b45309", // amber brown
            "Traffic Sign": "#4c1d95", // deep violet
            "Traffic Light": "#15803d", // forest green
            "default": "#475569"
        },
        dawn: {
            "Pothole": "#fca5a5", // soft peach/red
            "Road Excavation": "#fdba74", // soft orange
            "Road Barrier": "#fde047", // soft yellow
            "Traffic Sign": "#a78bfa", // lavender
            "Traffic Light": "#86efac", // mint green
            "default": "#cbd5e1"
        }
    };

    const palette = palettes[theme] || palettes.day;
    return palette[type as keyof typeof palette] || palette.default;
}

export const HAZARD_CHART_COLORS = {
    potholes:           '#ef4444',
    roadExcavation:     '#f97316',
    roadBarriers:       '#eab308',
    trafficSigns:       '#3b82f6',
    trafficLightRed:    '#ef4444',
    trafficLightGreen:  '#22c55e',
    trafficLightOrange: '#f97316',
} as const;

// Helper to consistently assign Tailwind classes to hazard types
export function getHazardTailwindColors(type: string): string {
    switch (type) {
        case "Pothole":
            return "text-red-600 bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-900";
        case "Road Excavation":
            return "text-orange-600 bg-orange-100 border-orange-200 dark:bg-orange-900/30 dark:border-orange-900";
        case "Road Barrier":
            return "text-yellow-600 bg-yellow-100 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-900";
        case "Traffic Sign":
            return "text-blue-600 bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:border-blue-900";
        case "Traffic Light":
            return "text-green-600 bg-green-100 border-green-200 dark:bg-green-900/30 dark:border-green-900";
        default:
            return "text-gray-600 bg-gray-100 border-gray-200";
    }
}
