export interface User {
    id: number;
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    username: string;
    email: string;
    contact_number: string | null;
    address: string | null;
    street: string | null;
    barangay_id: string | null;
    city_id: string | null;
    province_id: string | null;
    region_id: string | null;
    role: 'admin' | 'rider' | string;
    created_at: string;
    updated_at?: string;
}

export interface SystemSetting {
    id: number;
    confidence_threshold: number;
    items_per_page: number;
    default_sort: string;
    emergency_hazard_types: string[];
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
    status: 'active' | string;
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
