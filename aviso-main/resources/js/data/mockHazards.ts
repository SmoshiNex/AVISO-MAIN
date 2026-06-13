export type HazardType = 'Pothole' | 'Road Excavation' | 'Road Barrier' | 'Traffic Sign' | 'Traffic Light';

export interface HazardRecord {
    id: string;
    type: HazardType;
    coordinates: [number, number]; // [lng, lat]
    timestamp: string;
    confidence: number;
    distance: number; // in meters
    riderId: string;
}

// Helper to get color per hazard type
export function getHazardColor(type: HazardType): string {
    switch (type) {
        case 'Pothole': return '#ef4444'; // Red
        case 'Road Excavation': return '#f97316'; // Orange
        case 'Road Barrier': return '#eab308'; // Yellow
        case 'Traffic Sign': return '#3b82f6'; // Blue
        case 'Traffic Light': return '#10b981'; // Green
        default: return '#6b7280'; // Gray
    }
}

// 15 Mock Hazards in Zamboanga City Proper
export const mockHazards: HazardRecord[] = [
    {
        id: 'HAZ-001',
        type: 'Pothole',
        coordinates: [122.0754, 6.9042], // Near City Hall
        timestamp: '2026-06-13T08:15:22',
        confidence: 94.2,
        distance: 5.4,
        riderId: 'RIDER-004'
    },
    {
        id: 'HAZ-002',
        type: 'Road Excavation',
        coordinates: [122.0781, 6.9055], // Near Plaza Pershing
        timestamp: '2026-06-13T09:02:11',
        confidence: 88.5,
        distance: 12.1,
        riderId: 'RIDER-001'
    },
    {
        id: 'HAZ-003',
        type: 'Traffic Light',
        coordinates: [122.0745, 6.9068],
        timestamp: '2026-06-13T09:15:44',
        confidence: 97.8,
        distance: 18.5,
        riderId: 'RIDER-002'
    },
    {
        id: 'HAZ-004',
        type: 'Pothole',
        coordinates: [122.0766, 6.9031], // RT Lim Blvd
        timestamp: '2026-06-13T10:45:00',
        confidence: 91.0,
        distance: 3.2,
        riderId: 'RIDER-007'
    },
    {
        id: 'HAZ-005',
        type: 'Road Barrier',
        coordinates: [122.0792, 6.9080], 
        timestamp: '2026-06-13T11:20:33',
        confidence: 85.4,
        distance: 8.9,
        riderId: 'RIDER-003'
    },
    {
        id: 'HAZ-006',
        type: 'Traffic Sign',
        coordinates: [122.0732, 6.9059], 
        timestamp: '2026-06-13T12:05:12',
        confidence: 96.1,
        distance: 22.0,
        riderId: 'RIDER-005'
    },
    {
        id: 'HAZ-007',
        type: 'Pothole',
        coordinates: [122.0775, 6.9075], 
        timestamp: '2026-06-13T13:10:45',
        confidence: 89.9,
        distance: 6.7,
        riderId: 'RIDER-008'
    },
    {
        id: 'HAZ-008',
        type: 'Road Excavation',
        coordinates: [122.0801, 6.9045], // Port area
        timestamp: '2026-06-13T13:45:22',
        confidence: 92.3,
        distance: 14.5,
        riderId: 'RIDER-002'
    },
    {
        id: 'HAZ-009',
        type: 'Traffic Light',
        coordinates: [122.0760, 6.9090], 
        timestamp: '2026-06-13T14:22:18',
        confidence: 98.4,
        distance: 15.2,
        riderId: 'RIDER-001'
    },
    {
        id: 'HAZ-010',
        type: 'Pothole',
        coordinates: [122.0740, 6.9085], 
        timestamp: '2026-06-13T15:05:30',
        confidence: 93.7,
        distance: 4.8,
        riderId: 'RIDER-006'
    },
    {
        id: 'HAZ-011',
        type: 'Road Barrier',
        coordinates: [122.0788, 6.9028], 
        timestamp: '2026-06-13T15:30:11',
        confidence: 87.2,
        distance: 9.6,
        riderId: 'RIDER-004'
    },
    {
        id: 'HAZ-012',
        type: 'Traffic Sign',
        coordinates: [122.0750, 6.9038], 
        timestamp: '2026-06-13T16:12:45',
        confidence: 95.5,
        distance: 19.3,
        riderId: 'RIDER-007'
    },
    {
        id: 'HAZ-013',
        type: 'Road Excavation',
        coordinates: [122.0770, 6.9062], 
        timestamp: '2026-06-13T16:45:09',
        confidence: 90.8,
        distance: 11.4,
        riderId: 'RIDER-003'
    },
    {
        id: 'HAZ-014',
        type: 'Pothole',
        coordinates: [122.0795, 6.9068], 
        timestamp: '2026-06-13T17:02:33',
        confidence: 92.1,
        distance: 7.5,
        riderId: 'RIDER-005'
    },
    {
        id: 'HAZ-015',
        type: 'Traffic Light',
        coordinates: [122.0758, 6.9050], 
        timestamp: '2026-06-13T17:25:14',
        confidence: 99.1,
        distance: 16.8,
        riderId: 'RIDER-008'
    }
];
