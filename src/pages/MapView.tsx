
import { useState, useMemo } from 'react';
import { useCloudStore } from '@/store/useCloudStore';
import { CLOUD_GENERA, getGenusById } from '@/data/cloudGenera';
import Card from '@/components/ui/Card';
import { latLngToXY, formatCoordinates } from '@/utils/geoUtils';
import type { ObservationRecord } from '@/types';
import { MapPin, Layers, Info, Globe } from 'lucide-react';

export default function MapView() {
  const records = useCloudStore((s) => s.records);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const mapWidth = 900;
  const mapHeight = 450;

  const visibleRecords = useMemo(
    () => records.filter((r) => r.latitude !== undefined && r.longitude !== undefined),
    [records]
  );

  const selected: ObservationRecord | null = selectedId
    ? records.find((r) => r.id === selectedId) || null
    : null;

  const selectedGenus = selected ? getGenusById(selected.genusId) : null;

  const genusStats = CLOUD_GENERA.map((g) => ({
    genus: g,
    count: visibleRecords.filter((r) => r.genusId === g.id).length,
  })).filter((g) => g.count > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-gradient-sky flex items-center gap-3">
            <Globe size={34} className="text-teal-500" />
            观察点位地图
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            在地图上查看所有拍摄点位 · 不同颜色区分云属 · 共 <b className="text-slate-700">{visibleRecords.length}</b> 个带坐标的记录
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="chip bg-white/80">
            <Layers size={15} />
            世界地图
          </span>
          <span className="chip bg-white/80">
            <Info size={15} />
            点击点位查看详情
          </span>
        </div>
      </div>

      <div className="grid xl:grid-cols-[1fr_280px] gap-5">
        <Card animate className="!p-4 sm:!p-6 overflow-hidden">
          <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-50 border-2 border-sky-100">
            <svg
              viewBox={`0 0 ${mapWidth} ${mapHeight}`}
              className="w-full h-auto block"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(59,130,246,0.08)" strokeWidth="1" />
                </pattern>
                <radialGradient id="oceanGlow">
                  <stop offset="0%" stopColor="rgba(147,197,253,0.3)" />
                  <stop offset="100%" stopColor="rgba(59,130,246,0.05)" />
                </radialGradient>
              </defs>

              <rect width={mapWidth} height={mapHeight} fill="url(#oceanGlow)" />
              <rect width={mapWidth} height={mapHeight} fill="url(#grid)" />

              <g fill="rgba(148,163,184,0.5)" stroke="rgba(148,163,184,0.7)" strokeWidth="1" strokeLinejoin="round">
                <path d="M140,120 L180,95 L240,80 L280,100 L310,140 L290,180 L250,210 L190,220 L150,200 L130,170 Z" />
                <path d="M320,90 L380,70 L440,65 L490,85 L510,120 L480,160 L420,175 L360,165 L330,135 Z" />
                <path d="M520,110 L580,95 L640,105 L690,140 L680,180 L620,205 L560,200 L530,170 L515,140 Z" />
                <path d="M180,250 L230,240 L280,260 L310,300 L290,340 L240,360 L200,350 L180,320 Z" />
                <path d="M380,255 L460,245 L520,265 L545,305 L510,335 L450,345 L400,325 L380,295 Z" />
                <path d="M610,235 L680,225 L725,250 L740,295 L700,320 L650,315 L615,290 Z" />
                <path d="M760,130 L800,115 L830,135 L840,170 L810,195 L775,185 L760,160 Z" />
                <path d="M720,340 L760,328 L790,345 L800,375 L770,395 L735,385 L720,365 Z" />
                <path d="M560,350 L600,345 L630,365 L630,400 L590,410 L560,390 Z" />
              </g>

              <g stroke="rgba(59,130,246,0.15)" strokeWidth="1" fill="none">
                {Array.from({ length: 7 }, (_, i) => {
                  const y = (mapHeight / 6) * i;
                  return (
                    <line key={`h${i}`} x1="0" y1={y} x2={mapWidth} y2={y} strokeDasharray="4 4" />
                  );
                })}
                {Array.from({ length: 13 }, (_, i) => {
                  const x = (mapWidth / 12) * i;
                  return (
                    <line key={`v${i}`} x1={x} y1="0" x2={x} y2={mapHeight} strokeDasharray="4 4" />
                  );
                })}
              </g>

              {visibleRecords.map((r) => {
                const g = getGenusById(r.genusId);
                if (!g || r.latitude === undefined || r.longitude === undefined) return null;
                const { x, y } = latLngToXY(r.latitude, r.longitude, mapWidth, mapHeight);
                const isSelected = r.id === selectedId;
                const isHover = r.id === hoverId;
                return (
                  <g
                    key={r.id}
                    transform={`translate(${x}, ${y})`}
                    onClick={() => setSelectedId(isSelected ? null : r.id)}
                    onMouseEnter={() => setHoverId(r.id)}
                    onMouseLeave={() => setHoverId(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      r={isSelected ? 22 : isHover ? 18 : 14}
                      fill={g.color}
                      opacity={isSelected ? 0.15 : isHover ? 0.2 : 0.1}
                      className="transition-all duration-300"
                    />
                    <circle
                      r={isSelected ? 12 : isHover ? 10 : 8}
                      fill={g.color}
                      stroke="white"
                      strokeWidth={isSelected ? 4 : 2.5}
                      className="transition-all duration-300"
                      style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))' }}
                    />
                    <text
                      textAnchor="middle"
                      dy="0.35em"
                      fontSize={isSelected || isHover ? 11 : 9}
                      pointerEvents="none"
                      className="transition-all duration-300"
                    >
                      {g.emoji}
                    </text>

                    {(isSelected || isHover) && (
                      <g pointerEvents="none">
                        <rect
                          x={-75}
                          y={-60}
                          width={150}
                          height={40}
                          rx={10}
                          fill="white"
                          stroke={g.color}
                          strokeWidth={1.5}
                          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
                        />
                        <text x="0" y={-42} textAnchor="middle" fontSize={11} fontWeight="bold" fill={g.color}>
                          {g.emoji} {g.name}
                        </text>
                        <text x="0" y={-28} textAnchor="middle" fontSize={9} fill="#64748B">
                          {r.locationName || formatCoordinates(r.latitude, r.longitude).slice(0, 18)}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-3 text-center text-xs">
            <div>
              <p className="font-mono font-bold text-xl text-blue-600">{visibleRecords.length}</p>
              <p className="text-slate-500 mt-0.5">点位总数</p>
            </div>
            <div>
              <p className="font-mono font-bold text-xl text-violet-600">{genusStats.length}</p>
              <p className="text-slate-500 mt-0.5">涉及云属</p>
            </div>
            <div>
              <p className="font-mono font-bold text-xl text-emerald-600">
                {new Set(visibleRecords.map((r) => r.locationName).filter(Boolean)).size}
              </p>
              <p className="text-slate-500 mt-0.5">城市数量</p>
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <Card animate delay={100}>
            <h3 className="font-display font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-rose-500" />
              云属图例
            </h3>
            <div className="space-y-2.5">
              {genusStats.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">暂无点位数据</p>
              ) : (
                genusStats
                  .sort((a, b) => b.count - a.count)
                  .map(({ genus, count }) => {
                    const active = selected?.genusId === genus.id;
                    return (
                      <button
                        key={genus.id}
                        onClick={() => {
                          const first = visibleRecords.find((r) => r.genusId === genus.id);
                          if (first) setSelectedId(first.id);
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                          active ? 'shadow-lg scale-[1.01]' : 'hover:bg-white/80'
                        }`}
                        style={active ? { background: `${genus.color}12`, border: `1px solid ${genus.color}40` } : { background: 'rgba(255,255,255,0.5)' }}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow"
                          style={{ background: genus.color }}
                        >
                          <span className="text-lg">{genus.emoji}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-slate-800">{genus.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{genus.abbreviation}</p>
                        </div>
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full text-white shrink-0"
                          style={{ background: genus.color }}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })
              )}
            </div>
          </Card>

          {selected && selectedGenus && (
            <Card animate delay={200} className="overflow-hidden !p-0">
              <div className="p-5" style={{ background: `linear-gradient(135deg, ${selectedGenus.color}22, ${selectedGenus.color}05)` }}>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg animate-float"
                    style={{ background: selectedGenus.color }}
                  >
                    <span className="text-3xl">{selectedGenus.emoji}</span>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xl" style={{ color: selectedGenus.color }}>
                      {selectedGenus.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono">{selectedGenus.latinName}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  {selected.locationName && (
                    <p className="flex items-center gap-2 text-slate-700">
                      <MapPin size={14} className="text-rose-500" />
                      <b>{selected.locationName}</b>
                    </p>
                  )}
                  {selected.latitude !== undefined && selected.longitude !== undefined && (
                    <p className="font-mono text-xs text-slate-500 pl-6">
                      {formatCoordinates(selected.latitude, selected.longitude)}
                    </p>
                  )}
                </div>
              </div>
              <div className="p-5">
                {selected.photo ? (
                  <div className="aspect-video rounded-xl overflow-hidden mb-4 shadow">
                    <img src={selected.photo} alt={selectedGenus.name} className="w-full h-full object-cover" />
                  </div>
                ) : null}
                <div className="space-y-2 text-xs text-slate-600">
                  <p><span className="text-slate-400">📅 观察时间：</span>{new Date(selected.observedAt).toLocaleString('zh-CN')}</p>
                  {selected.species && (
                    <p><span className="text-slate-400">🌤️ 种类：</span>{selectedGenus.species.find((s) => s.id === selected.species)?.name}</p>
                  )}
                  <p><span className="text-slate-400">🌡️ 温湿度：</span>{selected.temperature}°C / {selected.humidity}%</p>
                  <p><span className="text-slate-400">📏 云底高度：</span>{(selected.cloudBaseHeight / 1000).toFixed(1)} km</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
