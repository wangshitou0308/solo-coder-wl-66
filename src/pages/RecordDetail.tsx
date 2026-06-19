
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCloudStore } from '@/store/useCloudStore';
import { getGenusById } from '@/data/cloudGenera';
import { WEATHER_OPTIONS } from '@/data/constants';
import Card from '@/components/ui/Card';
import { formatDateTime } from '@/utils/dateUtils';
import {
  formatTemperature,
  formatHumidity,
  formatAltitude,
  getCloudCoverLevel,
  getWindName,
} from '@/utils/weatherUtils';
import { formatCoordinates } from '@/utils/geoUtils';
import {
  ArrowLeft,
  Edit3,
  Copy,
  Trash2,
  Star,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Mountain,
  Cloud,
  Calendar,
  Info,
  X,
  Plus,
  Tag,
  AlertTriangle,
  Plane,
  CloudRain,
} from 'lucide-react';

export default function RecordDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRecordById, toggleFavorite, deleteRecord, addTagsToRecord, removeTagFromRecord } = useCloudStore();
  const [newTag, setNewTag] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const record = id ? getRecordById(id) : undefined;
  const genus = record ? getGenusById(record.genusId) : undefined;
  const weather = record ? WEATHER_OPTIONS.find((w) => w.id === record.weather) : undefined;
  const coverLevel = record ? getCloudCoverLevel(record.cloudCover) : null;

  if (!record || !genus) {
    return (
      <div className="space-y-6">
        <button className="btn-ghost" onClick={() => navigate('/records')}>
          <ArrowLeft size={18} />
          返回记录列表
        </button>
        <Card animate>
          <div className="text-center py-16">
            <div className="text-7xl mb-4 opacity-40">🔍</div>
            <h3 className="font-display font-bold text-xl text-slate-700 mb-2">未找到该记录</h3>
            <p className="text-slate-500">该记录可能已被删除或不存在</p>
          </div>
        </Card>
      </div>
    );
  }

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (!tag) return;
    if (record.tags.includes(tag)) {
      setNewTag('');
      return;
    }
    addTagsToRecord(record.id, [tag]);
    setNewTag('');
  };

  const handleDelete = () => {
    deleteRecord(record.id);
    navigate('/records');
  };

  const handleCopy = () => {
    navigate(`/record/new?copy=${record.id}`);
  };

  const handleEdit = () => {
    navigate(`/record/edit/${record.id}`);
  };

  const speciesName = record.species ? genus.species.find((s) => s.id === record.species)?.name : '';
  const speciesDesc = record.species ? genus.species.find((s) => s.id === record.species)?.description : '';
  const varietyName = record.variety ? genus.varieties.find((v) => v.id === record.variety)?.name : '';
  const varietyDesc = record.variety ? genus.varieties.find((v) => v.id === record.variety)?.description : '';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap animate-fade-in">
        <button className="btn-ghost" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          返回
        </button>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            className={`chip ${record.isFavorite ? 'selected' : ''}`}
            onClick={() => toggleFavorite(record.id)}
            style={record.isFavorite ? { background: 'linear-gradient(135deg, #F59E0B, #FBBF24)' } : undefined}
          >
            <Star size={15} fill={record.isFavorite ? 'white' : 'none'} />
            {record.isFavorite ? '已收藏' : '收藏'}
          </button>
          <button className="chip" onClick={handleEdit}>
            <Edit3 size={15} />
            编辑
          </button>
          <button className="chip" onClick={handleCopy}>
            <Copy size={15} />
            复制新建
          </button>
          <button
            className="chip !border-rose-200 !text-rose-600 hover:!bg-rose-50"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 size={15} />
            删除
          </button>
        </div>
      </div>

      <div className="relative animate-slide-up overflow-hidden rounded-3xl shadow-2xl">
        <div className="aspect-[21/9] bg-slate-200 overflow-hidden">
          {record.photo ? (
            <img src={record.photo} alt={genus.name} className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${genus.color}50, ${genus.color}10)` }}
            >
              <span className="text-9xl opacity-70 animate-float">{genus.emoji}</span>
            </div>
          )}
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7))' }} />
        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 text-white">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <span className="text-5xl">{genus.emoji}</span>
                <div>
                  <h1 className="font-display font-bold text-3xl sm:text-4xl" style={{ color: genus.color }}>
                    {genus.name}
                  </h1>
                  <p className="text-sm opacity-80 font-mono">{genus.latinName} · {genus.abbreviation}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {weather && (
                  <span
                    className="tag !text-xs !py-1"
                    style={{ background: `${weather.color}30`, color: 'white' }}
                  >
                    {weather.emoji} {weather.name}
                  </span>
                )}
                <span className="tag !text-xs !py-1 !bg-white/20 !text-white">
                  云量 {record.cloudCover}% · {coverLevel?.name}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-70">观察时间</p>
              <p className="font-mono font-bold text-lg">{formatDateTime(record.observedAt)}</p>
              {record.locationName && (
                <p className="text-sm opacity-80 mt-1 flex items-center gap-1 justify-end">
                  <MapPin size={13} />
                  {record.locationName}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card animate>
            <h3 className="font-display font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <Info size={20} className="text-blue-500" />
              云属说明
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">{genus.description}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-100">
                  <p className="text-xs font-bold text-sky-600 mb-1.5 flex items-center gap-1.5">
                    <CloudRain size={13} />
                    降水预示
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">{genus.precipitation}</p>
                </div>
                <div className="p-4 rounded-xl bg-violet-50/50 border border-violet-100">
                  <p className="text-xs font-bold text-violet-600 mb-1.5 flex items-center gap-1.5">
                    <Plane size={13} />
                    航空影响
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">{genus.aviation}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                📏 典型高度范围: {genus.altitudeMin / 1000}–{genus.altitudeMax / 1000}km
              </p>
            </div>
          </Card>

          {(speciesName || varietyName) && (
            <Card animate delay={50}>
              <h3 className="font-display font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                <Cloud size={20} className="text-indigo-500" />
                细分类型
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {speciesName && (
                  <div className="p-4 rounded-xl bg-violet-50 border border-violet-100">
                    <p className="text-xs font-bold text-violet-500 mb-1">种类 (Species)</p>
                    <p className="font-bold text-violet-700">{speciesName}</p>
                    {speciesDesc && <p className="text-xs text-slate-500 mt-1">{speciesDesc}</p>}
                  </div>
                )}
                {varietyName && (
                  <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-100">
                    <p className="text-xs font-bold text-cyan-500 mb-1">变种 (Variety)</p>
                    <p className="font-bold text-cyan-700">{varietyName}</p>
                    {varietyDesc && <p className="text-xs text-slate-500 mt-1">{varietyDesc}</p>}
                  </div>
                )}
              </div>
            </Card>
          )}

          {record.notes && (
            <Card animate delay={100}>
              <h3 className="font-display font-bold text-lg text-slate-800 mb-3 flex items-center gap-2">
                <AlertTriangle size={20} className="text-amber-500" />
                观察备注
              </h3>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-wrap">{record.notes}</p>
              </div>
            </Card>
          )}

          <Card animate delay={150}>
            <h3 className="font-display font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <Tag size={20} className="text-rose-500" />
              自定义标签
              <span className="ml-auto text-xs text-slate-400 font-normal">共 {record.tags.length} 个标签</span>
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {record.tags.length === 0 && (
                <p className="text-sm text-slate-400">暂无标签，添加自定义标签便于分类检索</p>
              )}
              {record.tags.map((tag) => (
                <span
                  key={tag}
                  className="chip !py-1 !px-3 !text-xs !bg-rose-50 !border-rose-200 !text-rose-700"
                >
                  <Tag size={12} />
                  {tag}
                  <button
                    className="ml-1 hover:text-rose-900"
                    onClick={() => removeTagFromRecord(record.id, tag)}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="input-field !py-2"
                placeholder="输入标签名，如：日落、暴雨前、航拍..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTag();
                }}
              />
              <button className="btn-primary !py-2" onClick={handleAddTag}>
                <Plus size={16} />
                添加
              </button>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card animate delay={100}>
            <h3 className="font-display font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <Mountain size={20} className="text-emerald-500" />
              气象参数
            </h3>
            <div className="space-y-3">
              {[
                { icon: Thermometer, label: '温度', value: formatTemperature(record.temperature), color: '#F97316' },
                { icon: Droplets, label: '湿度', value: formatHumidity(record.humidity), color: '#3B82F6' },
                { icon: Mountain, label: '云底高度', value: formatAltitude(record.cloudBaseHeight), color: '#6366F1' },
                { icon: Cloud, label: '云量占比', value: `${record.cloudCover}% · ${coverLevel?.name}`, color: '#06B6D4' },
                { icon: Wind, label: '风向风力', value: `${getWindName(record.windDirection)}风 ${record.windSpeed}级`, color: '#14B8A6' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${item.color}15` }}
                  >
                    <item.icon size={18} style={{ color: item.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <p className="font-bold text-slate-800 font-mono">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card animate delay={150}>
            <h3 className="font-display font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-rose-500" />
              观察地点
            </h3>
            <div className="space-y-3">
              {record.locationName && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50/50 border border-rose-100">
                  <MapPin size={18} className="text-rose-500 shrink-0" />
                  <p className="font-bold text-slate-800">{record.locationName}</p>
                </div>
              )}
              {record.latitude !== undefined && record.longitude !== undefined && (
                <p className="text-xs text-slate-500 font-mono pl-2">
                  {formatCoordinates(record.latitude, record.longitude)}
                </p>
              )}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar size={13} />
                  创建: {formatDateTime(record.createdAt)}
                </div>
                {record.updatedAt !== record.createdAt && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <Edit3 size={13} />
                    更新: {formatDateTime(record.updatedAt)}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="modal-backdrop" onClick={() => setShowDeleteConfirm(false)}>
          <div
            className="max-w-md w-full glass-card !rounded-3xl !p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 flex items-center justify-center mb-4">
                <AlertTriangle size={32} className="text-rose-500" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-800 mb-2">确认删除记录？</h3>
              <p className="text-sm text-slate-500 mb-6">
                删除后无法恢复，该记录的所有信息（包括照片、标签、备注）都将被永久移除。
              </p>
              <div className="flex items-center gap-3">
                <button className="btn-ghost flex-1" onClick={() => setShowDeleteConfirm(false)}>
                  取消
                </button>
                <button
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-full font-bold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #EF4444, #F87171)' }}
                  onClick={handleDelete}
                >
                  <Trash2 size={16} />
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
