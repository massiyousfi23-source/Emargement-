
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-primary/5 rounded-lg transition-colors active:scale-95">
          <span className="material-symbols-outlined text-[#111318] dark:text-white">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold tracking-tight dark:text-white">Record Attendance</h1>
      </div>
      <button className="text-primary font-semibold text-sm px-3 py-1.5 hover:bg-primary/10 rounded-lg active:scale-95 transition-all">
        History
      </button>
    </header>
  );
};

export default Header;
