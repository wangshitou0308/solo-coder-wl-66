
import { useRef, useState } from 'react';
import { formatDateTime } from '@/utils/dateUtils';
import { formatCoordinates } from '@/utils/geoUtils';
import { getCityByCoords } from '@/utils/geoUtils';
import { Camera, MapPin, Calendar, Upload, X, Crosshair, Loader2 } from 'lucide-react';

interface Props {
  photo: string | undefined;
  latitude: number | undefined;
  longitude: number | undefined;
  locationName: string | undefined;
  observedAt: string;
  onChange: (field: string, value: any) => void;
}

export default function PhotoAndLocation(props: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [locating, setLocating] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      props.onChange('photo', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('当前浏览器不支持定位，请手动输入坐标');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(5));
        const lng = Number(pos.coords.longitude.toFixed(5));
        props.onChange('latitude', lat);
        props.onChange('longitude', lng);
        props.onChange('locationName', getCityByCoords(lat, lng));
        setLocating(false);
      },
      (err) => {
        alert(`定位失败: ${err.message}。请手动输入坐标`);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2">
        <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Camera size={16} className="text-rose-500" />
          云彩照片
        </label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
        {props.photo ? (
          <div className="relative group aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            <img
              src={props.photo}
              alt="云彩照片预览"
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => props.onChange('photo', undefined)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full aspect-square rounded-2xl border-2 border-dashed border-slate-300 bg-white/50 flex flex-col items-center justify-center gap-3 transition-all hover:border-sky-400 hover:bg-sky-50/50 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Upload size={30} className="text-white" strokeWidth={2} />
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-700">点击上传云彩照片</p>
              <p className="text-xs text-slate-400 mt-1">支持 JPG / PNG / WEBP</p>
            </div>
            <div className="grid grid-cols-4 gap-1 mt-2 opacity-50">
              {['☁️', '⛅', '🌤️', '🌥️'].map((e, i) => (
                <span key={i} className="text-2xl">{e}</span>
              ))}
            </div>
          </button>
        )}
      </div>

      <div className="lg:col-span-3 space-y-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            <MapPin size={16} className="text-rose-500" />
            GPS 拍摄位置
          </label>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-slate-500 font-medium mb-1 block">纬度</label>
              <input
                type="number"
                step="0.00001"
                className="input-field"
                value={props.latitude ?? ''}
                onChange={(e) => {
                  const v = e.target.value === '' ? undefined : Number(e.target.value);
                  props.onChange('latitude', v);
                  if (v !== undefined && props.longitude !== undefined) {
                    props.onChange('locationName', getCityByCoords(v, props.longitude));
                  }
                }}
                placeholder="例: 39.90420"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-medium mb-1 block">经度</label>
              <input
                type="number"
                step="0.00001"
                className="input-field"
                value={props.longitude ?? ''}
                onChange={(e) => {
                  const v = e.target.value === '' ? undefined : Number(e.target.value);
                  props.onChange('longitude', v);
                  if (props.latitude !== undefined && v !== undefined) {
                    props.onChange('locationName', getCityByCoords(props.latitude, v));
                  }
                }}
                placeholder="例: 116.40740"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="btn-primary !py-2 !text-sm"
              onClick={handleGeolocation}
              disabled={locating}
            >
              {locating ? <Loader2 size={16} className="animate-spin" /> : <Crosshair size={16} />}
              {locating ? '定位中...' : '获取当前位置'}
            </button>
            {props.latitude !== undefined && props.longitude !== undefined && (
              <>
                <span className="text-sm font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                  {formatCoordinates(props.latitude, props.longitude)}
                </span>
                {props.locationName && (
                  <span className="tag bg-rose-50 text-rose-600">
                    <MapPin size={12} />
                    {props.locationName}
                  </span>
                )}
              </>
            )}
          </div>
          <input
            type="text"
            className="input-field mt-3"
            value={props.locationName ?? ''}
            onChange={(e) => props.onChange('locationName', e.target.value)}
            placeholder="📍 地点名称（可手动填写，如：北京市朝阳区）"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            <Calendar size={16} className="text-amber-500" />
            拍摄/观察时间
          </label>
          <input
            type="datetime-local"
            className="input-field"
            value={props.observedAt.slice(0, 16)}
            onChange={(e) => props.onChange('observedAt', new Date(e.target.value).toISOString())}
          />
          <p className="text-xs text-slate-500 mt-2">
            🕐 当前选择: {formatDateTime(props.observedAt)}
          </p>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">📝 观察备注（可选）</label>
          <textarea
            rows={3}
            className="input-field resize-none"
            placeholder="记录当天的特殊天气现象、云彩变化过程、你的观察感受..."
            onChange={(e) => props.onChange('notes', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
