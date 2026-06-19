
import type { ObservationRecord, WeatherType, WindDirection } from '@/types';
import { generateId } from '@/utils/dateUtils';
import { getCityByCoords } from '@/utils/geoUtils';

const NOW = new Date();
const monthsAgo = (m: number, day: number, hour: number): string => {
  const d = new Date(NOW.getFullYear(), NOW.getMonth() - m, day, hour, Math.floor(Math.random() * 60));
  return d.toISOString();
};

const weatherPool: WeatherType[] = ['sunny', 'cloudy', 'rain', 'snow', 'fog', 'haze'];
const windPool: WindDirection[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

type SeedConfig = {
  genus: string;
  time: string;
  lat: number;
  lng: number;
  baseHeight: number;
  cover: number;
  temp: number;
  humid: number;
  weather: WeatherType;
  windDir: WindDirection;
  windSpeed: number;
  species?: string;
  variety?: string;
  tags?: string[];
  isFavorite?: boolean;
};

const makeRecord = (cfg: SeedConfig): ObservationRecord => {
  const lat = cfg.lat + (Math.random() - 0.5) * 0.5;
  const lng = cfg.lng + (Math.random() - 0.5) * 0.5;
  return {
    id: generateId(),
    genusId: cfg.genus,
    species: cfg.species,
    variety: cfg.variety,
    cloudBaseHeight: cfg.baseHeight + Math.floor((Math.random() - 0.5) * 400),
    cloudCover: cfg.cover,
    weather: cfg.weather,
    temperature: Math.round((cfg.temp + (Math.random() - 0.5) * 3) * 10) / 10,
    humidity: Math.min(100, Math.max(20, cfg.humid + Math.floor((Math.random() - 0.5) * 15))),
    windDirection: cfg.windDir,
    windSpeed: Math.min(12, Math.max(0, cfg.windSpeed + Math.floor((Math.random() - 0.5) * 2))),
    latitude: lat,
    longitude: lng,
    locationName: getCityByCoords(lat, lng),
    observedAt: cfg.time,
    notes: '业余爱好者户外观察记录',
    tags: cfg.tags || [],
    isFavorite: cfg.isFavorite || false,
    createdAt: cfg.time,
    updatedAt: cfg.time,
  };
};

export const SEED_RECORDS: ObservationRecord[] = [
  makeRecord({ genus: 'cirrus', time: monthsAgo(0, NOW.getDate(), 8), lat: 39.9, lng: 116.4, baseHeight: 9500, cover: 20, temp: 22, humid: 45, weather: 'sunny', windDir: 'NW', windSpeed: 3, species: 'uncinus', variety: 'radiatus', tags: ['日落', '北京'], isFavorite: true }),
  makeRecord({ genus: 'cumulus', time: monthsAgo(0, NOW.getDate() - 1, 14), lat: 31.2, lng: 121.5, baseHeight: 1200, cover: 45, temp: 28, humid: 65, weather: 'cloudy', windDir: 'SE', windSpeed: 4, species: 'mediocris', tags: ['上海', '城市观察'] }),
  makeRecord({ genus: 'stratocumulus', time: monthsAgo(0, NOW.getDate() - 2, 10), lat: 23.1, lng: 113.3, baseHeight: 1800, cover: 75, temp: 30, humid: 78, weather: 'cloudy', windDir: 'S', windSpeed: 3, species: 'stratiformis', variety: 'undulatus', tags: ['广州', '夏日'] }),
  makeRecord({ genus: 'altocumulus', time: monthsAgo(0, NOW.getDate() - 3, 9), lat: 30.6, lng: 104.1, baseHeight: 4500, cover: 55, temp: 24, humid: 58, weather: 'sunny', windDir: 'W', windSpeed: 2, species: 'stratiformis', variety: 'undulatus', tags: ['成都', '航拍'], isFavorite: true }),
  makeRecord({ genus: 'cumulonimbus', time: monthsAgo(1, 20, 16), lat: 30.3, lng: 120.2, baseHeight: 900, cover: 95, temp: 32, humid: 88, weather: 'rain', windDir: 'SE', windSpeed: 7, species: 'capillatus', variety: 'incus', tags: ['暴雨前', '杭州', '雷暴'] }),
  makeRecord({ genus: 'cirrostratus', time: monthsAgo(1, 15, 7), lat: 34.3, lng: 108.9, baseHeight: 8500, cover: 60, temp: 18, humid: 50, weather: 'fog', windDir: 'N', windSpeed: 2, species: 'nebulosus', tags: ['西安', '晨雾'] }),
  makeRecord({ genus: 'nimbostratus', time: monthsAgo(2, 12, 11), lat: 32.1, lng: 118.8, baseHeight: 1500, cover: 100, temp: 19, humid: 95, weather: 'rain', windDir: 'E', windSpeed: 5, tags: ['南京', '连阴雨'] }),
  makeRecord({ genus: 'stratus', time: monthsAgo(2, 8, 6), lat: 22.5, lng: 114.1, baseHeight: 500, cover: 90, temp: 24, humid: 92, weather: 'fog', windDir: 'S', windSpeed: 2, species: 'nebulosus', tags: ['深圳', '晨雾'] }),
  makeRecord({ genus: 'altostratus', time: monthsAgo(3, 25, 13), lat: 30.6, lng: 114.3, baseHeight: 3800, cover: 85, temp: 16, humid: 75, weather: 'cloudy', windDir: 'NE', windSpeed: 3, species: 'translucidus', tags: ['武汉'] }),
  makeRecord({ genus: 'cirrocumulus', time: monthsAgo(3, 18, 17), lat: 35.7, lng: 139.7, baseHeight: 10000, cover: 30, temp: 20, humid: 40, weather: 'sunny', windDir: 'W', windSpeed: 4, species: 'stratiformis', variety: 'undulatus', tags: ['东京', '日落', '航拍'], isFavorite: true }),
  makeRecord({ genus: 'cirrus', time: monthsAgo(4, 10, 10), lat: 40.7, lng: -74.0, baseHeight: 9000, cover: 25, temp: 15, humid: 55, weather: 'cloudy', windDir: 'NW', windSpeed: 5, species: 'fibrosus', variety: 'vertebratus', tags: ['纽约', '旅行'] }),
  makeRecord({ genus: 'cumulus', time: monthsAgo(4, 5, 12), lat: 48.9, lng: 2.4, baseHeight: 1000, cover: 40, temp: 14, humid: 60, weather: 'sunny', windDir: 'W', windSpeed: 3, species: 'humilis', tags: ['巴黎', '旅行'] }),
  makeRecord({ genus: 'stratocumulus', time: monthsAgo(5, 22, 9), lat: 51.5, lng: -0.1, baseHeight: 1600, cover: 65, temp: 10, humid: 70, weather: 'cloudy', windDir: 'SW', windSpeed: 4, species: 'stratiformis', variety: 'duplicatus', tags: ['伦敦', '旅行'] }),
  makeRecord({ genus: 'altocumulus', time: monthsAgo(6, 14, 15), lat: 39.9, lng: 116.4, baseHeight: 4200, cover: 50, temp: 26, humid: 50, weather: 'sunny', windDir: 'S', windSpeed: 3, species: 'lenticularis', tags: ['北京', '荚状云'], isFavorite: true }),
  makeRecord({ genus: 'altostratus', time: monthsAgo(7, 30, 11), lat: 31.2, lng: 121.5, baseHeight: 3500, cover: 80, temp: 31, humid: 80, weather: 'haze', windDir: 'E', windSpeed: 2, species: 'opacus', tags: ['上海', '霾'] }),
  makeRecord({ genus: 'cirrus', time: monthsAgo(8, 18, 8), lat: 23.1, lng: 113.3, baseHeight: 10500, cover: 15, temp: 33, humid: 65, weather: 'sunny', windDir: 'SE', windSpeed: 2, species: 'spissatus', tags: ['广州', '日落'] }),
  makeRecord({ genus: 'cumulonimbus', time: monthsAgo(9, 5, 17), lat: 30.6, lng: 104.1, baseHeight: 800, cover: 100, temp: 28, humid: 90, weather: 'rain', windDir: 'W', windSpeed: 8, species: 'calvus', variety: 'mamma', tags: ['成都', '暴雨前', '雷暴'] }),
  makeRecord({ genus: 'nimbostratus', time: monthsAgo(10, 12, 10), lat: 34.3, lng: 108.9, baseHeight: 1800, cover: 100, temp: 12, humid: 88, weather: 'snow', windDir: 'N', windSpeed: 5, tags: ['西安', '初雪'] }),
  makeRecord({ genus: 'stratus', time: monthsAgo(11, 25, 7), lat: 40.7, lng: 116.4, baseHeight: 350, cover: 95, temp: 2, humid: 85, weather: 'snow', windDir: 'NE', windSpeed: 2, species: 'fractus', tags: ['北京', '雪景'], isFavorite: true }),
  makeRecord({ genus: 'cirrostratus', time: monthsAgo(11, 10, 9), lat: 35.7, lng: 139.7, baseHeight: 8000, cover: 55, temp: 6, humid: 48, weather: 'cloudy', windDir: 'WNW', windSpeed: 4, species: 'fibratus', variety: 'undulatus', tags: ['东京', '日晕'] }),
];

export const pickWeather = (seed: number): WeatherType => weatherPool[seed % weatherPool.length];
export const pickWind = (seed: number): WindDirection => windPool[seed % windPool.length];
