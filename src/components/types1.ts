export interface Building {
  name: string
  state: string
  capacity?: number
  lastUpdated?: string
}

export interface LocationCoords {
  lat: number
  lng: number
}

export interface LocationInfo {
  coords: LocationCoords
  color: string
}

export interface Locations {
  [key: string]: LocationInfo
}

