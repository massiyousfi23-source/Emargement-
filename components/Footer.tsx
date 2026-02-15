
import React from 'react';
import { NavTab } from '../types';

interface FooterProps {
  presentCount: number;
  absentCount: number;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
}

const Footer: React.FC<FooterProps> = ({ 
  presentCount, 
  absentCount, 
  activeTab, 
  onTabChange,
  onExportPDF,
  onExportExcel
}) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 px-4 pt-4 pb-2 z-30 max-w-md mx-auto">
      <div className="space-y-4">
        <div className="flex justify-between text-xs px-1">
          <span className="text-slate-500 font-medium">Summary:</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            <span className="text-emerald-600">{presentCount} Present</span>
            <span className="mx-2 opacity-30">·</span>
            <span className="text-rose-500">{absentCount} Absent</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={onExportPDF}
            className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 h-11 rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
          >
            <span className="material-symbols-outlined text-rose-500 text-lg">picture_as_pdf</span>
            Export PDF
          </button>
          <button 
            onClick={onExportExcel}
            className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 h-11 rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
          >
            <span className="material-symbols-outlined text-emerald-600 text-lg">table_chart</span>
            Export XLS
          </button>
        </div>
        
        <button className="w-full bg-primary text-white h-14 rounded-xl font-bold text-base shadow-xl shadow-primary/30 flex items-center justify-center gap-2 active:scale-[0.97] transition-all">
          <span className="material-symbols-outlined fill">draw</span>
          Sign-off & Submit
        </button>

        <nav className="flex items-center justify-between px-2 pt-1">
          <NavItem 
            icon="home" 
            label="Home" 
            isActive={activeTab === 'home'} 
            onClick={() => onTabChange('home')} 
          />
          <NavItem 
            icon="check_circle" 
            label="Attendance" 
            isActive={activeTab === 'attendance'} 
            onClick={() => onTabChange('attendance')} 
          />
          <NavItem 
            icon="group" 
            label="Teams" 
            isActive={activeTab === 'teams'} 
            onClick={() => onTabChange('teams')} 
          />
          <NavItem 
            icon="settings" 
            label="Settings" 
            isActive={activeTab === 'settings'} 
            onClick={() => onTabChange('settings')} 
          />
        </nav>
      </div>
    </footer>
  );
};

interface NavItemProps {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-primary' : 'text-slate-400'}`}
    >
      <div className="h-6 flex items-center justify-center">
        <span className={`material-symbols-outlined text-2xl ${isActive ? 'fill' : ''}`}>{icon}</span>
      </div>
      <p className="text-[9px] font-bold uppercase tracking-widest">{label}</p>
    </button>
  );
};

export default Footer;
