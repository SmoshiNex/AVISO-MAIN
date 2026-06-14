// Helper to consistently assign colors to hazard types
export function getHazardColor(type: string): string {
    switch (type) {
        case "Pothole":
            return "#ef4444"; // red-500
        case "Road Excavation":
            return "#f97316"; // orange-500
        case "Road Barrier":
            return "#eab308"; // yellow-500
        case "Traffic Sign":
            return "#3b82f6"; // blue-500
        case "Traffic Light":
            return "#22c55e"; // green-500
        default:
            return "#64748b"; // slate-500
    }
}

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
