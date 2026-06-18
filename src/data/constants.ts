
import type { WeatherType, WindDirection } from '@/types';

export const WEATHER_OPTIONS: { id: WeatherType; name: string; emoji: string; color: string }[] = [
  { id: 'sunny', name: '晴', emoji: '☀️', color: '#F59E0B' },
  { id: 'cloudy', name: '阴', emoji: '☁️', color: '#6B7280' },
  { id: 'rain', name: '雨', emoji: '🌧️', color: '#3B82F6' },
  { id: 'snow', name: '雪', emoji: '❄️', color: '#8B5CF6' },
  { id: 'fog', name: '雾', emoji: '🌫️', color: '#9CA3AF' },
  { id: 'haze', name: '霾', emoji: '😷', color: '#A3A3A3' },
];

export const WIND_DIRECTIONS: { id: WindDirection; name: string; degree: number }[] = [
  { id: 'N', name: '北', degree: 0 },
  { id: 'NNE', name: '北东北', degree: 22.5 },
  { id: 'NE', name: '东北', degree: 45 },
  { id: 'ENE', name: '东东北', degree: 67.5 },
  { id: 'E', name: '东', degree: 90 },
  { id: 'ESE', name: '东东南', degree: 112.5 },
  { id: 'SE', name: '东南', degree: 135 },
  { id: 'SSE', name: '南东南', degree: 157.5 },
  { id: 'S', name: '南', degree: 180 },
  { id: 'SSW', name: '南西南', degree: 202.5 },
  { id: 'SW', name: '西南', degree: 225 },
  { id: 'WSW', name: '西西南', degree: 247.5 },
  { id: 'W', name: '西', degree: 270 },
  { id: 'WNW', name: '西西北', degree: 292.5 },
  { id: 'NW', name: '西北', degree: 315 },
  { id: 'NNW', name: '北西北', degree: 337.5 },
];

export const WIND_SCALE_DESCRIPTIONS: Record<number, string> = {
  0: '无风（烟直上）',
  1: '软风（烟示风向）',
  2: '轻风（树叶微响）',
  3: '微风（树叶摇动）',
  4: '和风（纸片飞扬）',
  5: '清风（小树摇摆）',
  6: '强风（大树枝摇）',
  7: '疾风（迎风难行）',
  8: '大风（折毁树枝）',
  9: '烈风（屋瓦吹落）',
  10: '狂风（拔树倒屋）',
  11: '暴风（损毁惨重）',
  12: '飓风（摧毁极大）',
};

export const FAMILY_NAMES: Record<string, string> = {
  high: '高云族',
  middle: '中云族',
  low: '低云族',
};

export const CLOUD_COVER_LEVELS = [
  { range: [0, 10], name: '晴', desc: '万里无云' },
  { range: [10, 30], name: '少云', desc: '云量稀少' },
  { range: [30, 70], name: '多云', desc: '云量较多' },
  { range: [70, 100], name: '阴天', desc: '乌云密布' },
];
