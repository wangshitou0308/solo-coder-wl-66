
import type { WindDirection } from '@/types';
import { WIND_DIRECTIONS } from '@/data/constants';

export const getWindName = (direction: WindDirection): string => {
  const found = WIND_DIRECTIONS.find((d) => d.id === direction);
  return found ? found.name : direction;
};

export const getWindEmoji = (speed: number): string => {
  if (speed <= 2) return '🍃';
  if (speed <= 5) return '🌬️';
  if (speed <= 8) return '💨';
  return '🌪️';
};

export const formatTemperature = (t: number): string => {
  const sign = t >= 0 ? '+' : '';
  return `${sign}${t.toFixed(1)}°C`;
};

export const formatHumidity = (h: number): string => `${Math.round(h)}%`;

export const formatAltitude = (h: number): string => {
  if (h >= 1000) return `${(h / 1000).toFixed(1)}km`;
  return `${h}m`;
};

export const getCloudCoverLevel = (cover: number): { name: string; desc: string } => {
  if (cover < 10) return { name: '晴', desc: '万里无云' };
  if (cover < 30) return { name: '少云', desc: '云量稀少' };
  if (cover < 70) return { name: '多云', desc: '云量较多' };
  return { name: '阴天', desc: '乌云密布' };
};
