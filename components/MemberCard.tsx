
import React, { useState } from 'react';
import { Member, AttendanceStatus, AbsenceReason, ROLES } from '../types';
import SignatureModal from './SignatureModal';

interface MemberCardProps {
  member: Member;
  onToggle: (id: string, status: AttendanceStatus) => void;
  onUpdate: (id: string, field: keyof Member, value: any) => void;
  onDelete: (id: string) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onToggle, onUpdate, onDelete }) => {
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const isPresent = member.status === AttendanceStatus.PRESENT;
  const isAbsent = member.status === AttendanceStatus.ABSENT;

  const statusColors = {
    [AttendanceStatus.PRESENT]: 'border-emerald-500 bg-emerald-50/30',
    [AttendanceStatus.ABSENT]: 'border-rose-500 bg-rose-50/30',
    [AttendanceStatus.UNMARKED]: 'border-slate-200 bg-white'
  };

  return (
    <div className={`relative flex flex-col p-5 rounded-3xl shadow-sm border-l-8 transition-all duration-300 dark:bg-slate-900 ${statusColors[member.status]} border dark:border-slate-800`}>
      
      {/* BOUTON SUPPRIMER */}
      <button 
        onClick={() => onDelete(member.id)}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-90 z-10"
        title="Supprimer le profil"
      >
        <span className="material-symbols-outlined text-lg">delete</span>
      </button>

      {/* HEADER : Identité & Rôle */}
      <div className="flex items-start justify-between mb-6 pr-10">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl transition-all shadow-lg shrink-0 ${
            isPresent ? 'bg-emerald-500 text-white' : 
            isAbsent ? 'bg-rose-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
          }`}>
            {getInitials(member.name)}
          </div>
          <div className="flex flex-col min-w-0">
            <input 
              value={member.name}
              onChange={(e) => onUpdate(member.id, 'name', e.target.value)}
              className="font-black text-slate-800 dark:text-slate-100 text-lg bg-transparent border-none p-0 focus:ring-0 w-full"
            />
            <div className="relative inline-flex items-center mt-1">
              <select 
                value={member.role}
                onChange={(e) => onUpdate(member.id, 'role', e.target.value)}
                className="bg-primary/10 border-none py-1 px-3 rounded-lg text-xs font-bold text-primary focus:ring-2 focus:ring-primary appearance-none cursor-pointer pr-8"
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <span className="material-symbols-outlined text-[16px] absolute right-2 pointer-events-none text-primary">expand_more</span>
            </div>
          </div>
        </div>

        {/* TOGGLE STATUT */}
        <div className="flex bg-slate-200 dark:bg-slate-800 p-1.5 rounded-2xl shrink-0">
          <button 
            onClick={() => onToggle(member.id, AttendanceStatus.PRESENT)}
            className={`px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${
              isPresent 
                ? 'bg-white dark:bg-emerald-600 text-emerald-600 dark:text-white shadow-xl' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            PRÉSENT
          </button>
          <button 
            onClick={() => onToggle(member.id, AttendanceStatus.ABSENT)}
            className={`px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${
              isAbsent 
                ? 'bg-rose-500 text-white shadow-xl' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            ABSENT
          </button>
        </div>
      </div>

      {/* CONTENU DYNAMIQUE : Horaires ou Motifs */}
      <div className="mb-6">
        {isAbsent ? (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
            <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">event_busy</span> Motif de l'absence
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'FOR', value: AbsenceReason.FORMATION },
                { label: 'MAL', value: AbsenceReason.MALADIE },
                { label: 'CP', value: AbsenceReason.CP },
                { label: 'ANJ', value: AbsenceReason.ANJ }
              ].map((r) => (
                <button
                  key={r.value}
                  onClick={() => onUpdate(member.id, 'absenceReason', r.value)}
                  className={`py-3 rounded-2xl text-[11px] font-black border-2 transition-all ${
                    member.absenceReason === r.value 
                      ? 'bg-rose-500 border-rose-500 text-white shadow-lg' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-rose-200'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
            <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">schedule</span> Horaires de présence
            </label>
            <div className="grid grid-cols-4 gap-2">
              <TimeInput 
                label="Arrivée" 
                icon="login" 
                value={member.arrivalTime || '08:00'} 
                onChange={(val) => onUpdate(member.id, 'arrivalTime', val)} 
              />
              <TimeInput 
                label="Pause D." 
                icon="coffee" 
                value={member.breakStart || '12:00'} 
                onChange={(val) => onUpdate(member.id, 'breakStart', val)} 
              />
              <TimeInput 
                label="Pause F." 
                icon="restaurant" 
                value={member.breakEnd || '13:00'} 
                onChange={(val) => onUpdate(member.id, 'breakEnd', val)} 
              />
              <TimeInput 
                label="Départ" 
                icon="logout" 
                value={member.departureTime || '17:00'} 
                onChange={(val) => onUpdate(member.id, 'departureTime', val)} 
              />
            </div>
          </div>
        )}
      </div>

      {/* FOOTER DE CARTE : Signature & Observation */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">draw</span> Signature
          </label>
          <button 
            onClick={() => setIsSignModalOpen(true)}
            className={`w-full h-20 rounded-2xl border-2 flex items-center justify-center transition-all overflow-hidden ${
              member.signature 
                ? 'bg-white border-emerald-500 shadow-inner' 
                : 'bg-slate-50 dark:bg-slate-800 border-dashed border-slate-300 dark:border-slate-700 text-slate-400 hover:border-primary hover:text-primary'
            }`}
          >
            {member.signature ? (
              <img src={member.signature} alt="Signature" className="h-full object-contain mix-blend-multiply dark:invert p-2" />
            ) : (
              <span className="text-[10px] font-black uppercase tracking-tighter">Signer ici</span>
            )}
          </button>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
             <span className="material-symbols-outlined text-sm">description</span> Observation
          </label>
          <textarea 
            placeholder="Notes de terrain..."
            value={member.comment || ''}
            onChange={(e) => onUpdate(member.id, 'comment', e.target.value)}
            className="w-full h-20 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none text-[11px] font-bold placeholder:text-slate-400 text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-primary/10 resize-none"
          />
        </div>
      </div>

      <SignatureModal 
        isOpen={isSignModalOpen}
        onClose={() => setIsSignModalOpen(false)}
        onSave={(sig) => onUpdate(member.id, 'signature', sig)}
        memberName={member.name}
      />
    </div>
  );
};

interface TimeInputProps {
  label: string;
  icon: string;
  value: string;
  onChange: (value: string) => void;
}

const TimeInput: React.FC<TimeInputProps> = ({ label, icon, value, onChange }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1">
        <span className="material-symbols-outlined text-[12px] text-slate-400">{icon}</span>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter truncate">{label}</span>
      </div>
      <input 
        type="time" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-2 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-[12px] font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
};

export default MemberCard;
