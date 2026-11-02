import React, { useState } from 'react';
import {
  LayoutDashboard,
  Receipt,
  Users,
  UploadCloud,
  Menu,
  X,
  Package,
  TrendingUp,
  MessageSquare,
  FileBarChart,
  Settings,
  Sparkles,
  Code2,
} from 'lucide-react';

interface MobileNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  pendingReviewsCount?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentPage,
  onNavigate,
  pendingReviewsCount = 0,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainItems = [
    { id: 'overview', label: 'Shop Home', icon: LayoutDashboard },
    {
      id: 'transactions',
      label: 'Sales',
      icon: Receipt,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
    },
    { id: 'import', label: 'Add Chat', icon: UploadCloud, isCenter: true },
    { id: 'customers', label: 'Customers', icon: Users },
  ];

  const moreItems = [
    { id: 'products', label: 'Products & Stock', icon: Package },
    { id: 'insights', label: 'Business Advice', icon: TrendingUp },
    { id: 'conversations', label: 'All Chats', icon: MessageSquare },
    { id: 'reports', label: 'Statements & Reports', icon: FileBarChart },
    { id: 'developer', label: 'Developer & API', icon: Code2 },
    { id: 'settings', label: 'Shop Profile', icon: Settings },
  ];

  return (
    <>
      {/* More Menu Drawer */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setShowMoreMenu(false)}
          />
          <div className="relative bg-white rounded-t-2xl shadow-2xl p-5 border-t border-slate-200 z-10 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                More Features
              </span>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setShowMoreMenu(false);
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold text-left transition-colors ${
                      isActive
                        ? 'bg-[#E8F4ED] text-[#145C42]'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#145C42] shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 md:hidden py-1.5 px-3 flex items-center justify-around shadow-lg">
        {mainItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="relative -top-3 flex flex-col items-center group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#145C42] to-[#103E30] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[#145C42] mt-0.5">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors relative cursor-pointer ${
                isActive ? 'text-[#145C42]' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className={`text-[10px] font-semibold ${isActive ? 'text-[#145C42]' : ''}`}>
                {item.label}
              </span>
              {item.badge !== undefined && (
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>
          );
        })}

        {/* More button */}
        <button
          onClick={() => setShowMoreMenu(true)}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            showMoreMenu ? 'text-[#145C42]' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-semibold">More</span>
        </button>
      </nav>
    </>
  );
};
