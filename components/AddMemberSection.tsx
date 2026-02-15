
import React, { useState } from 'react';
import { ROLES } from '../types';

interface AddMemberSectionProps {
  onAdd: (name: string, role: string) => void;
}

const AddMemberSection: React.FC<AddMemberSectionProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<string>(ROLES[0]);

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name, role);
      setName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="px-4 mb-2">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-primary/5">
        <label className="block">
          <span className="text-[10px] font-bold text-primary/80 uppercase tracking-widest">Ajouter un membre</span>
          <div className="mt-3 flex flex-col gap-3">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person_add</span>
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 h-12 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:border-primary focus:ring-primary text-sm placeholder:text-slate-400 transition-all" 
                placeholder="Nom complet..." 
                type="text"
              />
            </div>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-12 pl-4 pr-10 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white focus:border-primary focus:ring-primary text-sm appearance-none transition-all"
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>
              
              <button 
                onClick={handleAdd}
                className="bg-primary text-white px-6 h-12 rounded-lg flex items-center justify-center hover:bg-primary/90 shadow-md shadow-primary/20 active:scale-95 transition-all font-bold"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default AddMemberSection;
