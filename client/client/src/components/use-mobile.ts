import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Volume2, BarChart3, History, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const navigation = [
  { name: '音量反馈', href: '/', icon: Volume2 },
  { name: '数据统计', href: '/statistics', icon: BarChart3 },
  { name: '历史记录', href: '/history', icon: History },
  { name: '系统配置', href: '/settings', icon: Settings },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[hsl(210_40%_98%)]">
      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 h-screen w-64 bg-[hsl(222_47%_11%)] text-white transition-transform duration-300",
        isMobile && !sidebarOpen && "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-[hsl(222_47%_20%)]">
          <Volume2 className="h-6 w-6 text-[hsl(217_91%_60%)] mr-3" />
          <span className="font-bold text-lg">音量反馈</span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => isMobile && setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-[hsl(217_91%_60%)] text-white"
                    : "text-[hsl(210_40%_98%)] hover:bg-[hsl(222_47%_16%)]"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[hsl(222_47%_20%)]">
          <p className="text-xs text-[hsl(210_40%_98%)]/60">
            办公室音量反馈系统
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn(
        "min-h-screen transition-all",
        !isMobile && "md:pl-64"
      )}>
        {/* Mobile header */}
        <header className="md:hidden h-16 bg-white border-b flex items-center px-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="ml-3 font-semibold">音量反馈系统</span>
        </header>

        {/* Page content */}
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}