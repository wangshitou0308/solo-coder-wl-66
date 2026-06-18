
export const formatCoordinates = (lat?: number, lng?: number): string => {
  if (lat === undefined || lng === undefined) return '';
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  const latStr = Math.abs(lat).toFixed(4);
  const lngStr = Math.abs(lng).toFixed(4);
  return `${latStr}°${latDir}, ${lngStr}°${lngDir}`;
};

export const latLngToXY = (
  lat: number,
  lng: number,
  width: number,
  height: number
): { x: number; y: number } => {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
};

export const getCityByCoords = (lat: number, lng: number): string => {
  const cities: { name: string; lat: number; lng: number; radius: number }[] = [
    { name: '北京', lat: 39.9042, lng: 116.4074, radius: 1 },
    { name: '上海', lat: 31.2304, lng: 121.4737, radius: 1 },
    { name: '广州', lat: 23.1291, lng: 113.2644, radius: 1 },
    { name: '深圳', lat: 22.5431, lng: 114.0579, radius: 1 },
    { name: '成都', lat: 30.5728, lng: 104.0668, radius: 1 },
    { name: '杭州', lat: 30.2741, lng: 120.1551, radius: 1 },
    { name: '西安', lat: 34.3416, lng: 108.9398, radius: 1 },
    { name: '武汉', lat: 30.5928, lng: 114.3055, radius: 1 },
    { name: '南京', lat: 32.0603, lng: 118.7969, radius: 1 },
    { name: '重庆', lat: 29.4316, lng: 106.9123, radius: 1 },
    { name: '东京', lat: 35.6762, lng: 139.6503, radius: 1.5 },
    { name: '纽约', lat: 40.7128, lng: -74.0060, radius: 1.5 },
    { name: '伦敦', lat: 51.5074, lng: -0.1278, radius: 1.5 },
    { name: '巴黎', lat: 48.8566, lng: 2.3522, radius: 1.5 },
  ];
  for (const c of cities) {
    const dLat = Math.abs(lat - c.lat);
    const dLng = Math.abs(lng - c.lng);
    if (dLat < c.radius && dLng < c.radius) return c.name;
  }
  const region = lng >= 73 && lng <= 135 && lat >= 18 && lat <= 54 ? '中国' : '未知区域';
  return region;
};
