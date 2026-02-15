
import React from 'react';
import { Project } from '../types';

interface ProjectSectionProps {
  projects: Project[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const ProjectSection: React.FC<ProjectSectionProps> = ({ projects, selectedId, onSelect }) => {
  return (
    <div className="px-4 mb-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-primary/5">
        <label className="block">
          <span className="text-[10px] font-bold text-primary/80 uppercase tracking-widest">Project / Team</span>
          <div className="relative mt-2">
            <select 
              value={selectedId}
              onChange={(e) => onSelect(e.target.value)}
              className="form-select w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-white h-12 px-4 focus:border-primary focus:ring-primary appearance-none text-sm font-medium"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-primary">
              <span className="material-symbols-outlined">expand_more</span>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default ProjectSection;
