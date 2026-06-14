export interface User {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    contact_number: string | null;
    address: string | null;
    role: 'admin' | 'rider' | string;
    created_at: string;
    updated_at?: string;
}

export interface HazardLog {
    id: number;
    haz_code: string;
    type: string;
    area: string;
    latitude: number;
    longitude: number;
    confidence: number;
    distance: number;
    rider_code: string;
    status: 'active' | 'resolved' | string;
    detected_at: string;
}

// Often Inertia passes paginated data in this structure:
export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}
