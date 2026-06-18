
export type CloudFamily = 'high' | 'middle' | 'low';

export type WeatherType = 'sunny' | 'cloudy' | 'rain' | 'snow' | 'fog' | 'haze';

export type WindDirection =
  | 'N' | 'NNE' | 'NE' | 'ENE'
  | 'E' | 'ESE' | 'SE' | 'SSE'
  | 'S' | 'SSW' | 'SW' | 'WSW'
  | 'W' | 'WNW' | 'NW' | 'NNW';

export interface CloudSpecies {
  id: string;
  name: string;
  description: string;
}

export interface CloudVariety {
  id: string;
  name: string;
  description: string;
}

export interface CloudGenus {
  id: string;
  name: string;
  latinName: string;
  abbreviation: string;
  family: CloudFamily;
  emoji: string;
  color: string;
  description: string;
  precipitation: string;
  aviation: string;
  species: CloudSpecies[];
  varieties: CloudVariety[];
  altitudeMin: number;
  altitudeMax: number;
}

export interface ObservationRecord {
  id: string;
  genusId: string;
  species?: string;
  variety?: string;
  cloudBaseHeight: number;
  cloudCover: number;
  weather: WeatherType;
  temperature: number;
  humidity: number;
  windDirection: WindDirection;
  windSpeed: number;
  photo?: string;
  latitude?: number;
  longitude?: number;
  locationName?: string;
  observedAt: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenusCoverage {
  genusId: string;
  count: number;
  percentage: number;
}

export interface MonthlyData {
  month: string;
  total: number;
  byGenus: Record<string, number>;
}

export interface Statistics {
  totalRecords: number;
  uniqueGenusCount: number;
  thisMonthRecords: number;
  streakDays: number;
  genusCoverage: GenusCoverage[];
  monthlyDistribution: MonthlyData[];
}

export interface RecordFilters {
  startDate?: string;
  endDate?: string;
  genera?: string[];
  weather?: WeatherType[];
}
