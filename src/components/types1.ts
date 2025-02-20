export interface Building {
    name: string;
    state: "open" | "closed";
    coords: {
        lat: number;
        lng: number;
    };
    color: string;
}

export interface Locations {
    [key: string]: {
        coords: {
            lat: number;
            lng: number;
        };
        color: string;
    };
}