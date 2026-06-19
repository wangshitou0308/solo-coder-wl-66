
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useCloudStore } from '@/store/useCloudStore';
import Card from '@/components/ui/Card';
import GenusSelector from '@/components/record/GenusSelector';
import WeatherForm from '@/components/record/WeatherForm';
import PhotoAndLocation from '@/components/record/PhotoAndLocation';
import type { WeatherType, WindDirection } from '@/types';
import { ArrowLeft, ArrowRight, Check, CloudUpload, Sparkles, Edit, Copy } from 'lucide-react';

const STEPS = [
  { key: 'genus', label: '选择云属', icon: CloudUpload },
  { key: 'params', label: '气象参数', icon: Sparkles },
  { key: 'media', label: '照片与位置', icon: Check },
];

const getLocalDatetimeLocal = (iso?: string): string => {
  const d = iso ? new Date(iso) : new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function NewRecord() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const copyId = searchParams.get('copy');
  const addRecord = useCloudStore((s) => s.addRecord);
  const updateRecord = useCloudStore((s) => s.updateRecord);
  const getRecordById = useCloudStore((s) => s.getRecordById);

  const isEditMode = !!id;
  const isCopyMode = !!copyId;
  const sourceRecordId = id || copyId;
  const sourceRecord = sourceRecordId ? getRecordById(sourceRecordId) : undefined;

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
  const [observedAtLocal, setObservedAtLocal] = useState<string>(getLocalDatetimeLocal());
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loaded, setLoaded] = useState(!sourceRecordId);

  useEffect(() => {
    if (sourceRecord && !loaded) {
      setGenusId(sourceRecord.genusId);
      setSpecies(sourceRecord.species || '');
      setVariety(sourceRecord.variety || '');
      setCloudBaseHeight(sourceRecord.cloudBaseHeight);
      setCloudCover(sourceRecord.cloudCover);
      setWeather(sourceRecord.weather);
      setTemperature(sourceRecord.temperature);
      setHumidity(sourceRecord.humidity);
      setWindDirection(sourceRecord.windDirection);
      setWindSpeed(sourceRecord.windSpeed);
      setPhoto(sourceRecord.photo);
      setLatitude(sourceRecord.latitude);
      setLongitude(sourceRecord.longitude);
      setLocationName(sourceRecord.locationName);
      setObservedAt(sourceRecord.observedAt);
      setObservedAtLocal(getLocalDatetimeLocal(sourceRecord.observedAt));
      setNotes(sourceRecord.notes || '');
      setTags(isCopyMode ? [...(sourceRecord.tags || [])] : [...(sourceRecord.tags || [])]);
      setIsFavorite(isEditMode ? sourceRecord.isFavorite : false);
      setLoaded(true);
    }
  }, [sourceRecord, loaded, isEditMode, isCopyMode]);

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
      case 'observedAtLocalStr':
        setObservedAtLocal(value);
        if (value) {
          setObservedAt(new Date(value).toISOString());
        } else {
          setObservedAt('');
        }
        return;
      case 'notes': return setNotes(value);
    }
  };

  const canNext = () => {
    if (step === 0) return genusId !== '';
    return true;
  };

  const handleSubmit = () => {
    if (!genusId) return;
    const finalObservedAt = observedAt || new Date().toISOString();
    const recordData = {
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
      observedAt: finalObservedAt,
      notes: notes || undefined,
      tags,
      isFavorite,
    };

    if (isEditMode && id) {
      updateRecord(id, recordData);
      navigate(`/record/${id}`);
    } else {
      addRecord(recordData);
      navigate('/records');
    }
  };

  if (!loaded) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl opacity-40 animate-float mb-4">☁️</div>
        <p className="text-slate-500">加载记录数据中...</p>
      </div>
    );
  }

  const titlePrefix = isEditMode ? '编辑观云记录' : isCopyMode ? '复制新建观云记录' : '新建观云记录';
  const titleIcon = isEditMode ? <Edit size={24} /> : isCopyMode ? <Copy size={24} /> : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 animate-fade-in flex-wrap">
        <button className="btn-ghost" onClick={() => navigate(isEditMode && id ? `/record/${id}` : '/records')}>
          <ArrowLeft size={18} />
          返回
        </button>
        <div className="flex-1">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-gradient-sky flex items-center gap-2">
            {titleIcon}
            {titlePrefix}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isEditMode
              ? '修改已有观云记录的信息'
              : isCopyMode
              ? '基于已有记录快速创建一条新记录'
              : '按照 WMO 国际云图分类标准记录你的云彩观察'}
          </p>
        </div>
        {sourceRecord && (
          <span className="chip !bg-amber-50 !border-amber-200 !text-amber-700">
            {isEditMode ? '编辑模式' : '复制模式'} · 来源记录已加载
          </span>
        )}
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
              observedAtLocal={observedAtLocal}
              onChange={onChange}
            />
            <div className="mt-6 pt-6 border-t border-slate-200">
              <label className="block text-sm font-bold text-slate-700 mb-2">📝 观察备注（可选）</label>
              <textarea
                rows={3}
                className="input-field resize-none"
                placeholder="记录当天的特殊天气现象、云彩变化过程、你的观察感受..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-200 flex-wrap gap-3">
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
              {isEditMode ? '保存修改' : isCopyMode ? '创建副本' : '保存观云记录'}
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
