import React from 'react';
import { StudentConfig } from '../types';
import { ShieldCheck, Plane, Sliders, RotateCcw, GraduationCap } from 'lucide-react';

interface HeaderProps {
  config: StudentConfig;
  onOpenSettings: () => void;
  onResetDemoData: () => void;
  pendingApprovalsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  onOpenSettings,
  onResetDemoData,
  pendingApprovalsCount: _pendingApprovalsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0A0E17]/90 backdrop-blur-md px-4 sm:px-8 py-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Project Info */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 to-blue-600 shadow-md shadow-sky-500/20 text-white font-bold">
            <Plane className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                Agent Gatekeeper
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Airline Security Gateway
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              AI Agent Permission & Autonomous Flight Booking Risk Controller
            </p>
          </div>
        </div>

        {/* Center / Right Badges & Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Prominent Student Enrolment Badge */}
          <div 
            onClick={onOpenSettings}
            className="cursor-pointer group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-blue-500/60 transition-all shadow-sm"
            title="Click to edit student enrolment and airline configuration"
          >
            <div className="p-1 rounded bg-indigo-500/20 text-indigo-400 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                Student Enrolment
                {!config.isCustomEnrolment && (
                  <span className="text-[9px] text-amber-400 font-normal">(Placeholder)</span>
                )}
              </div>
              <div className="text-xs font-mono font-bold text-white group-hover:text-blue-400">
                {config.enrolmentNumber}
              </div>
            </div>
          </div>

          {/* Selected Airline Badge */}
          <div 
            onClick={onOpenSettings}
            className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all bg-sky-500/10 text-sky-400 border-sky-500/30 hover:border-sky-400/50"
            title="Click to configure airline name"
          >
            <Plane className="w-4 h-4 text-sky-400" />
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                Airline Industry
              </div>
              <div className="text-xs font-bold truncate max-w-[120px] sm:max-w-[160px]">
                {config.companyName}
              </div>
            </div>
          </div>

          {/* Booking Limit Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
            <span className="text-slate-400">Booking Limit:</span>
            <span className="font-mono font-bold text-amber-400">
              {config.currency} {config.transactionThreshold.toLocaleString()}
            </span>
          </div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            title="Configure Airline Settings"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo airline agents, audit logs, and settings to clean airline state?')) {
                onResetDemoData();
              }
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
            title="Reset to clean Airline Demo Data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
