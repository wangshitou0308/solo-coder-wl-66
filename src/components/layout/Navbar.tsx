
import { NavLink, useNavigate } from 'react-router-dom';
import { Cloud, Plus, BarChart3, BookOpen, MapPin, LayoutDashboard } from 'lucide-react';

const navItems = [
  { to: '/', label: '仪表盘', icon: LayoutDashboard },
  { to: '/records', label: '历史记录', icon: BarChart3 },
  { to: '/knowledge', label: '云图知识', icon: BookOpen },
  { to: '/map', label: '地图点位', icon: MapPin },
];

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="glass-card px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-sky-400 to-cyan-300 flex items-center justify-center shadow-lg shadow-blue-500/25 animate-float">
              <Cloud size={22} className="text-white" strokeWidth={2.4} />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-lg font-bold leading-tight text-gradient-sky">
                观云记
              </h1>
              <p className="text-[11px] text-slate-500 font-medium -mt-0.5">
                Cloud Observer · WMO国际云图
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1 bg-white/40 rounded-full p-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `nav-tab ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={16} strokeWidth={2} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
          <button
            className="btn-sunset shrink-0"
            onClick={() => navigate('/record/new')}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span className="hidden sm:inline">新建记录</span>
          </button>
        </div>
        <div className="md:hidden mt-3 glass-card px-3 py-2 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `nav-tab !py-1.5 !px-3 text-sm ${isActive ? 'active' : ''}`}
              >
                <Icon size={15} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
