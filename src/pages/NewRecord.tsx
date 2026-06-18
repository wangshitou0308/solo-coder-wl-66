
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCloudStore } from '@/store/useCloudStore';
import Card from '@/components/ui/Card';
import GenusSelector from '@/components/record/GenusSelector';
import WeatherForm from '@/components/record/WeatherForm';
import PhotoAndLocation from '@/components/record/PhotoAndLocation';
import type { WeatherType, WindDirection } from '@/types';
import { ArrowLeft, ArrowRight, Check, CloudUpload, Sparkles } from 'lucide-react';

const STEPS = [
  { key: 'genus', label: '选择云属', icon: CloudUpload },
  { key: 'params', label: '气象参数', icon: Sparkles },
  { key: 'media', label: '照片与位置', icon: Check },
];

export default function NewRecord() {
  const navigate = useNavigate();
  const addRecord = useCloudStore((s) => s.addRecord);
  const [step, setStep] = useState(0);
  const [genusId, setGenusId] = useState('');
  const [species, setSpecies] = useState('');
  const [variety, setVariety] = useState('');
  const [cloudBaseHeight, setCloudBaseHeight] = useState(3000);
  const [cloudCover, setCloudCover] = useState(40);
  const [weather, setWeather] = useState<WeatherType>('sunny');
  const [temperature, setTemperature] = useState(20);
  const [humidity, setHumidity] = useState(55);
  const [windDirection, setWindDirection] = useState<WindDirection>('E');
  const [windSpeed, setWindSpeed] = useState(3);
  const [photo, setPhoto] = useState<string | undefined>();
  const [latitude, setLatitude] = useState<number | undefined>(39.9042);
  const [longitude, setLongitude] = useState<number | undefined>(116.4074);
  const [locationName, setLocationName] = useState<string | undefined>('北京市');
  const [observedAt, setObservedAt] = useState<string>(new Date().toISOString());
  const [notes, setNotes] = useState('');

  const onChange = (field: string, value: any) => {
    switch (field) {
      case 'species': return setSpecies(value);
      case 'variety': return setVariety(value);
      case 'cloudBaseHeight': return setCloudBaseHeight(value);
      case 'cloudCover': return setCloudCover(value);
      case 'weather': return setWeather(value);
      case 'temperature': return setTemperature(value);
      case 'humidity': return setHumidity(value);
      case 'windDirection': return setWindDirection(value);
      case 'windSpeed': return setWindSpeed(value);
      case 'photo': return setPhoto(value);
      case 'latitude': return setLatitude(value);
      case 'longitude': return setLongitude(value);
      case 'locationName': return setLocationName(value);
      case 'observedAt': return setObservedAt(value);
      case 'notes': return setNotes(value);
    }
  };

  const canNext = () => {
    if (step === 0) return genusId !== '';
    return true;
  };

  const handleSubmit = () => {
    if (!genusId) return;
    addRecord({
      genusId,
      species: species || undefined,
      variety: variety || undefined,
      cloudBaseHeight,
      cloudCover,
      weather,
      temperature,
      humidity,
      windDirection,
      windSpeed,
      photo,
      latitude,
      longitude,
      locationName: locationName || undefined,
      observedAt,
      notes: notes || undefined,
    });
    navigate('/');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 animate-fade-in">
        <button className="btn-ghost" onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
          返回
        </button>
        <div className="flex-1">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-gradient-sky">
            新建观云记录
          </h1>
          <p className="text-sm text-slate-500 mt-1">按照 WMO 国际云图分类标准记录你的云彩观察</p>
        </div>
      </div>

      <div className="glass-card !p-4 sm:!p-5 animate-fade-in">
        <div className="flex items-center justify-between gap-4 overflow-x-auto">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = i === step;
            const done = i < step;
            return (
              <div key={s.key} className="flex items-center gap-3 shrink-0">
                <div
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-full transition-all ${
                    active
                      ? 'bg-gradient-to-r from-blue-500 to-sky-400 text-white shadow-lg shadow-blue-500/30 scale-105'
                      : done
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-white/50 text-slate-400'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm ${
                      active ? 'bg-white/25' : done ? 'bg-emerald-100' : 'bg-slate-100'
                    }`}
                  >
                    {done ? <Check size={14} strokeWidth={3} /> : i + 1}
                  </div>
                  <Icon size={16} />
                  <span className="font-bold text-sm whitespace-nowrap">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-8 sm:w-16 h-1 rounded-full ${
                      done ? 'bg-emerald-400' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Card animate className="!p-5 sm:!p-8">
        {step === 0 && (
          <div className="animate-fade-in">
            <h2 className="font-display font-bold text-xl sm:text-2xl mb-6 text-slate-800">
              第 1 步 · 选择云的种类（必填）
            </h2>
            <GenusSelector value={genusId} onChange={setGenusId} />
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="font-display font-bold text-xl sm:text-2xl mb-6 text-slate-800">
              第 2 步 · 填写气象参数
            </h2>
            <WeatherForm
              genusId={genusId}
              species={species}
              variety={variety}
              cloudBaseHeight={cloudBaseHeight}
              cloudCover={cloudCover}
              weather={weather}
              temperature={temperature}
              humidity={humidity}
              windDirection={windDirection}
              windSpeed={windSpeed}
              onChange={onChange}
            />
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="font-display font-bold text-xl sm:text-2xl mb-6 text-slate-800">
              第 3 步 · 上传照片与位置
            </h2>
            <PhotoAndLocation
              photo={photo}
              latitude={latitude}
              longitude={longitude}
              locationName={locationName}
              observedAt={observedAt}
              onChange={onChange}
            />
          </div>
        )}

        <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-200">
          <button
            className="btn-ghost disabled:opacity-40"
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
          >
            <ArrowLeft size={16} />
            上一步
          </button>
          {step < STEPS.length - 1 ? (
            <button
              className="btn-primary !py-3 !px-7 disabled:opacity-50"
              disabled={!canNext()}
              onClick={() => setStep(step + 1)}
            >
              下一步
              <ArrowRight size={16} />
            </button>
          ) : (
            <button className="btn-sunset !py-3 !px-7" onClick={handleSubmit}>
              <Check size={18} />
              保存观云记录
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
