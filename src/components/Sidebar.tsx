import React from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Users, 
  UserX, 
  FileText, 
  SlidersHorizontal, 
  CheckCircle, 
  FlaskConical, 
  BookOpen,
  ChevronRight
} from 'lucide-react';

export type TabType = 
  | 'dashboard'
  | 'gatekeeper'
  | 'registry'
  | 'revoke'
  | 'audit'
  | 'rules'
  | 'approvals'
  | 'testlab'
  | 'docs';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  pendingApprovalsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingApprovalsCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as TabType,
      label: 'Overview Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'gatekeeper' as TabType,
      label: 'Request Gatekeeper',
      icon: ShieldCheck,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      id: 'registry' as TabType,
      label: 'AI Agent Registry',
      icon: Users,
      badge: null,
    },
    {
      id: 'revoke' as TabType,
      label: 'Revoke Access',
      icon: UserX,
      badge: null,
    },
    {
      id: 'approvals' as TabType,
      label: 'Customer Approval',
      icon: CheckCircle,
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} Pending` : null,
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse',
    },
    {
      id: 'audit' as TabType,
      label: 'Audit Log',
      icon: FileText,
      badge: null,
    },
    {
      id: 'rules' as TabType,
      label: 'Security Rules',
      icon: SlidersHorizontal,
      badge: '8 Rules',
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    },
    {
      id: 'testlab' as TabType,
      label: 'Test Lab',
      icon: FlaskConical,
      badge: '6 Tests',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
    {
      id: 'docs' as TabType,
      label: 'Docs & Sources',
      icon: BookOpen,
      badge: null,
    },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-[#0B0F19] border-r border-slate-800 flex flex-col justify-between p-4">
      <div className="space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Navigation Menu
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                          item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400/70" />}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800/80 mt-6 text-[11px] text-slate-500 space-y-1">
        <div className="flex items-center justify-between text-slate-400">
          <span>Decision Engine</span>
          <span className="font-mono text-emerald-400 font-bold">100% Deterministic</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Local Storage</span>
          <span className="font-mono text-slate-300">Synchronized</span>
        </div>
        <p className="text-[10px] text-slate-400 pt-2 border-t border-slate-800/50">
          Academic Security Prototype
        </p>
      </div>
    </aside>
  );
};
