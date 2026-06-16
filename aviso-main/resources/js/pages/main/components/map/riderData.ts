export type LngLat = [number, number];

export type RiderDef = {
    id: string;
    name: string;
    colorBase: string;
    waypoints: LngLat[];
    fallbackRoute: LngLat[];
    userInfo: {
        fullName: string;
        username: string;
        contact: string;
        address: string;
    };
};

export type Rider = {
    id: string;
    name: string;
    colorBase: string;
    route: LngLat[];
    userInfo: RiderDef['userInfo'];
};

export const RIDER_DEFS: RiderDef[] = [
    {
        id: 'rider-1',
        name: 'Rider 1 - San Jose Gusu',
        colorBase: 'blue',
        userInfo: {
            fullName: 'Maria Santos',
            username: 'rider_maria',
            contact: '09171234002',
            address: 'Calarian, Zamboanga City',
        },
        waypoints: [
            [122.04565, 6.93137],
            [122.04691, 6.93008],
            [122.04761, 6.92941],
            [122.04718, 6.92781],
            [122.05202, 6.92752],
            [122.04707, 6.92311],
            [122.04777, 6.92048],
        ],
        fallbackRoute: [
            [122.04565, 6.93137],
            [122.04691, 6.93008],
            [122.04761, 6.92941],
            [122.04718, 6.92781],
            [122.05202, 6.92752],
            [122.04707, 6.92311],
            [122.04777, 6.92048],
            [122.04565, 6.93137],
        ],
    },
    {
        id: 'rider-2',
        name: 'Rider 2 - Pasonanca Road',
        colorBase: 'green',
        userInfo: {
            fullName: 'Pedro Reyes',
            username: 'rider_pedro',
            contact: '09171234003',
            address: 'San Roque, Zamboanga City',
        },
        waypoints: [
            [122.07278, 6.96092],
            [122.07248, 6.96029],
            [122.07143, 6.95321],
            [122.07176, 6.95118],
            [122.07303, 6.94563],
            [122.07148, 6.94142],
        ],
        fallbackRoute: [
            [122.07278, 6.96092],
            [122.07248, 6.96029],
            [122.07143, 6.95321],
            [122.07176, 6.95118],
            [122.07303, 6.94563],
            [122.07148, 6.94142],
            [122.07303, 6.94563],
            [122.07176, 6.95118],
            [122.07143, 6.95321],
            [122.07248, 6.96029],
            [122.07278, 6.96092],
        ],
    },
    {
        id: 'rider-3',
        name: 'Rider 3 - Putik to Tugbungan',
        colorBase: 'orange',
        userInfo: {
            fullName: 'Ana Gomez',
            username: 'rider_ana',
            contact: '09171234004',
            address: 'Tugbungan, Zamboanga City',
        },
        waypoints: [
            [122.100390, 6.946790],
            [122.079750, 6.922120],
            [122.100390, 6.946790],
        ],
        fallbackRoute: [
            [122.100390, 6.946790],
            [122.079750, 6.922120],
            [122.100390, 6.946790],
        ],
    },
];
