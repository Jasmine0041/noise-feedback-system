import { NavLink, Outlet } from 'react-router-dom';
import { Volume2, BarChart3, History, Settings } from 'lucide-react';

export function Layout() {
  const navItems = [
    { to: '/', icon: Volume2, label: '音量反馈' },
    { to: '/statistics', icon: BarChart3, label: '数据统计' },
    { to: '/history', icon: History, label: '历史记录' },
    { to: '/settings', icon: Settings, label: '系统配置' },
  ];

  return (
    <div className="min-h-screen bg-[hsl(210_40%_98%)] flex">
      {/* 侧边栏 */}
      <aside className="w-64 bg-[hsl(222_47%_11%)] text-white flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Volume2 className="h-6 w-6 text-[hsl(217_91%_60%)] mr-3" />
          <span className="font-bold text-lg">音量反馈</span>
        </div>
        
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[hsl(217_91%_60%)] text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}