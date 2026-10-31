import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  Users,
  Package,
  TrendingUp,
  MessageSquare,
  FileBarChart,
  Settings,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  pendingReviewsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  collapsed,
  onToggleCollapse,
  pendingReviewsCount = 0,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: Receipt,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
    },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'insights', label: 'Business Insights', icon: TrendingUp },
    { id: 'conversations', label: 'Conversations', icon: MessageSquare },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-slate-200/80 transition-all duration-300 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Import CTA button */}
      <div className="p-3 border-b border-slate-100">
        <button
          onClick={() => onNavigate('import')}
          className={`w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#145C42] to-[#103E30] text-white font-semibold text-xs py-2.5 px-3 shadow-sm hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer ${
            collapsed ? 'px-0' : ''
          }`}
          title="Import WhatsApp Conversations"
        >
          <UploadCloud className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Import Conversations</span>}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group relative ${
                isActive
                  ? 'bg-[#E8F4ED] text-[#145C42]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              } ${collapsed ? 'justify-center px-0' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#145C42]' : 'text-slate-500 group-hover:text-slate-800'
                }`}
              />

              {!collapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}

              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    isActive
                      ? 'bg-[#145C42] text-white'
                      : 'bg-amber-100 text-amber-800'
                  } ${collapsed ? 'absolute top-1 right-2' : ''}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Trust & Security Badge */}
      {!collapsed && (
        <div className="mx-3 my-2 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 font-bold text-[#145C42] mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Bank-Grade Security</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Encrypted records with isolated business access and verified payment matching.
          </p>
        </div>
      )}

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-slate-100 flex items-center justify-between">
        {!collapsed && (
          <span className="text-[11px] font-medium text-slate-400">Collapse sidebar</span>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer ml-auto"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
