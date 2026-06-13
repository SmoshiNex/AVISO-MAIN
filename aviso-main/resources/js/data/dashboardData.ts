import type { ChartConfig } from '@/components/ui/chart';

// ─── Types ────────────────────────────────────────────────────────
export interface HazardDataPoint {
    day: string;
    potholes: number;
    roadExcavation: number;
    roadBarriers: number;
    trafficSigns: number;
    trafficLightRed: number;
    trafficLightGreen: number;
    trafficLightOrange: number;
}

export interface HazardTypeSlice {
    name: string;
    value: number;
}

export interface DetectionAccuracyPoint {
    name: string;
    accuracy: number;
}

// ─── Hazards Over Time (7-day) ────────────────────────────────────
export const hazardsOverTimeData: HazardDataPoint[] = [
    { day: 'Mon', potholes: 40, roadExcavation: 18, roadBarriers: 14, trafficSigns: 22, trafficLightRed: 30, trafficLightGreen: 28, trafficLightOrange: 15 },
    { day: 'Tue', potholes: 30, roadExcavation: 22, roadBarriers: 10, trafficSigns: 18, trafficLightRed: 25, trafficLightGreen: 24, trafficLightOrange: 12 },
    { day: 'Wed', potholes: 20, roadExcavation: 30, roadBarriers: 20, trafficSigns: 27, trafficLightRed: 20, trafficLightGreen: 32, trafficLightOrange: 18 },
    { day: 'Thu', potholes: 27, roadExcavation: 14, roadBarriers: 17, trafficSigns: 31, trafficLightRed: 35, trafficLightGreen: 29, trafficLightOrange: 20 },
    { day: 'Fri', potholes: 18, roadExcavation: 25, roadBarriers: 22, trafficSigns: 24, trafficLightRed: 28, trafficLightGreen: 36, trafficLightOrange: 14 },
    { day: 'Sat', potholes: 23, roadExcavation: 10, roadBarriers: 12, trafficSigns: 19, trafficLightRed: 22, trafficLightGreen: 21, trafficLightOrange: 11 },
    { day: 'Sun', potholes: 34, roadExcavation: 16, roadBarriers: 18, trafficSigns: 26, trafficLightRed: 31, trafficLightGreen: 33, trafficLightOrange: 17 },
];

export const hazardsChartConfig = {
    potholes:           { label: 'Potholes',                color: 'oklch(0.577 0.245 27.325)'  },
    roadExcavation:     { label: 'Road Excavation',         color: 'oklch(0.705 0.213 47.604)'  },
    roadBarriers:       { label: 'Road Barriers',           color: 'oklch(0.795 0.184 86.047)'  },
    trafficSigns:       { label: 'Traffic Signs',           color: 'oklch(0.600 0.180 240.000)' },
    trafficLightRed:    { label: 'Traffic Light (Red)',     color: 'oklch(0.637 0.237 15.330)'  },
    trafficLightGreen:  { label: 'Traffic Light (Green)',   color: 'oklch(0.627 0.194 149.214)' },
    trafficLightOrange: { label: 'Traffic Light (Orange)',  color: 'oklch(0.750 0.183 55.934)'  },
} satisfies ChartConfig;

// ─── Hazard Types Breakdown (Donut) ──────────────────────────────
export const hazardTypesData: HazardTypeSlice[] = [
    { name: 'Potholes',               value: 192 },
    { name: 'Road Excavation',        value: 135 },
    { name: 'Road Barriers',          value: 113 },
    { name: 'Traffic Signs',          value: 167 },
    { name: 'Traffic Light (Red)',    value: 191 },
    { name: 'Traffic Light (Green)',  value: 203 },
    { name: 'Traffic Light (Orange)', value: 107 },
];

export const hazardTypesChartConfig = {
    potholes:           { label: 'Potholes',                color: 'oklch(0.577 0.245 27.325)'  },
    roadExcavation:     { label: 'Road Excavation',         color: 'oklch(0.705 0.213 47.604)'  },
    roadBarriers:       { label: 'Road Barriers',           color: 'oklch(0.795 0.184 86.047)'  },
    trafficSigns:       { label: 'Traffic Signs',           color: 'oklch(0.600 0.180 240.000)' },
    trafficLightRed:    { label: 'Traffic Light (Red)',     color: 'oklch(0.637 0.237 15.330)'  },
    trafficLightGreen:  { label: 'Traffic Light (Green)',   color: 'oklch(0.627 0.194 149.214)' },
    trafficLightOrange: { label: 'Traffic Light (Orange)',  color: 'oklch(0.750 0.183 55.934)'  },
} satisfies ChartConfig;

/** Ordered fill colours for Pie `<Cell>` elements */
export const HAZARD_TYPE_COLORS = [
    'oklch(0.577 0.245 27.325)',  // Potholes — deep red
    'oklch(0.705 0.213 47.604)',  // Road Excavation — orange
    'oklch(0.795 0.184 86.047)',  // Road Barriers — yellow
    'oklch(0.600 0.180 240.000)', // Traffic Signs — blue
    'oklch(0.637 0.237 15.330)',  // Traffic Light Red
    'oklch(0.627 0.194 149.214)', // Traffic Light Green
    'oklch(0.750 0.183 55.934)',  // Traffic Light Orange
] as const;

// ─── Detection Accuracy by Hazard Type (Bar) ─────────────────────
export const detectionAccuracyData: DetectionAccuracyPoint[] = [
    { name: 'Pothole',    accuracy: 94 },
    { name: 'Excavation', accuracy: 88 },
    { name: 'Barriers',   accuracy: 91 },
    { name: 'Signs',      accuracy: 96 },
    { name: 'TL Red',     accuracy: 98 },
    { name: 'TL Green',   accuracy: 97 },
    { name: 'TL Orange',  accuracy: 93 },
];

export const detectionAccuracyChartConfig = {
    accuracy: { label: 'Accuracy %', color: 'var(--primary)' },
} satisfies ChartConfig;

// ─── Stat Cards ───────────────────────────────────────────────────
export interface StatCard {
    label: string;
    value: string;
    sub: string;
    subVariant?: 'destructive' | 'muted';
}

export const dashboardStats: StatCard[] = [
    {
        label: 'Active Hazards',
        value: '14',
        sub: '+2 in the last hour',
        subVariant: 'destructive',
    },
    {
        label: 'Total Detections (Today)',
        value: '1,108',
        sub: 'Across all 7 hazard categories',
        subVariant: 'muted',
    },
    {
        label: 'System Status',
        value: 'Online',
        sub: 'Model running · Avg. confidence 93%',
        subVariant: 'muted',
    },
];
