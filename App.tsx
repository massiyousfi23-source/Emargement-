
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { AttendanceStatus, AbsenceReason, Member, Project, NavTab, Role } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import MemberCard from './components/MemberCard';
import ProjectSection from './components/ProjectSection';
import AddMemberSection from './components/AddMemberSection';

// Dynamic imports for export libraries
const getJsPDF = () => import('https://esm.sh/jspdf').then(m => m.jsPDF);
const getAutoTable = () => import('https://esm.sh/jspdf-autotable').then(m => m.default);
const getXLSX = () => import('https://esm.sh/xlsx').then(m => m);

const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'Alex Morgan', role: 'Chef d\'équipe', status: AttendanceStatus.PRESENT, arrivalTime: '08:00', breakStart: '12:00', breakEnd: '13:00', departureTime: '17:00' },
  { id: '2', name: 'Jordan Smith', role: 'Relais technique', status: AttendanceStatus.PRESENT, arrivalTime: '07:45', breakStart: '12:30', breakEnd: '13:30', departureTime: '16:45' },
  { id: '3', name: 'Riley King', role: 'Salarié en insertion', status: AttendanceStatus.ABSENT, absenceReason: AbsenceReason.CP },
  { id: '4', name: 'Taylor Hughes', role: 'Cariste', status: AttendanceStatus.PRESENT, arrivalTime: '08:15', breakStart: '12:00', breakEnd: '13:00', departureTime: '17:15' },
];

const PROJECTS: Project[] = [
  { id: 'p1', name: 'Emargement Equipe 1' },
  { id: 'p2', name: 'Riverside Residential Complex' },
  { id: 'p3', name: 'Urban Logistics Hub' },
];

const App: React.FC = () => {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [selectedProjectId, setSelectedProjectId] = useState(PROJECTS[0].id);
  const [activeTab, setActiveTab] = useState<NavTab>('attendance');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const selectedProject = useMemo(() => 
    PROJECTS.find(p => p.id === selectedProjectId)?.name || 'Projet Inconnu',
  [selectedProjectId]);

  const counts = useMemo(() => {
    return members.reduce(
      (acc, m) => {
        if (m.status === AttendanceStatus.PRESENT) acc.present++;
        if (m.status === AttendanceStatus.ABSENT) acc.absent++;
        return acc;
      },
      { present: 0, absent: 0 }
    );
  }, [members]);

  const toggleStatus = useCallback((id: string, status: AttendanceStatus) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          if (status === AttendanceStatus.PRESENT && !m.arrivalTime) {
            return { ...m, status, arrivalTime: '08:00', breakStart: '12:00', breakEnd: '13:00', departureTime: '17:00', absenceReason: undefined };
          }
          return { ...m, status, absenceReason: status === AttendanceStatus.ABSENT ? AbsenceReason.ANJ : undefined };
        }
        return m;
      })
    );
  }, []);

  const updateMemberData = useCallback((id: string, field: keyof Member, value: any) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  }, []);

  const deleteMember = useCallback((id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce profil ?')) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
  }, []);

  const markAllPresent = useCallback(() => {
    setMembers((prev) =>
      prev.map((m) => ({ 
        ...m, 
        status: AttendanceStatus.PRESENT,
        absenceReason: undefined,
        arrivalTime: m.arrivalTime || '08:00',
        breakStart: m.breakStart || '12:00',
        breakEnd: m.breakEnd || '13:00',
        departureTime: m.departureTime || '17:00'
      }))
    );
  }, []);

  const addNewMember = useCallback((name: string, role: string) => {
    if (!name.trim()) return;
    const newMember: Member = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      role: role || 'Salarié en insertion',
      status: AttendanceStatus.UNMARKED,
      arrivalTime: '08:00',
      breakStart: '12:00',
      breakEnd: '13:00',
      departureTime: '17:00'
    };
    setMembers((prev) => [newMember, ...prev]);
  }, []);

  const exportPDF = async () => {
    const jsPDF = await getJsPDF();
    const autoTable = await getAutoTable();
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString();

    doc.setFontSize(18);
    doc.text(`Rapport de Présence - ${selectedProject}`, 14, 20);
    doc.setFontSize(11);
    doc.text(`Date: ${dateStr}`, 14, 30);

    const tableData = members.map(m => [
      m.name,
      m.role,
      m.status,
      m.absenceReason || '-',
      m.arrivalTime || '-',
      m.departureTime || '-',
      m.signature ? 'Signé' : 'Non signé',
      m.comment || ''
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Nom', 'Rôle', 'Statut', 'Motif', 'Arrivée', 'Départ', 'Sign', 'Commentaire']],
      body: tableData,
    });

    doc.save(`Presence_${selectedProject.replace(/\s+/g, '_')}_${dateStr}.pdf`);
  };

  const exportExcel = async () => {
    const XLSX = await getXLSX();
    const dateStr = new Date().toLocaleDateString();
    
    const data = members.map(m => ({
      'Nom': m.name,
      'Rôle': m.role,
      'Statut': m.status,
      'Motif Absence': m.absenceReason || '-',
      'Arrivée': m.arrivalTime || '-',
      'Pause Début': m.breakStart || '-',
      'Pause Fin': m.breakEnd || '-',
      'Départ': m.departureTime || '-',
      'Signé': m.signature ? 'Oui' : 'Non',
      'Commentaire': m.comment || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Présences');
    
    XLSX.writeFile(workbook, `Presence_${selectedProject.replace(/\s+/g, '_')}_${dateStr}.xlsx`);
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background-light dark:bg-background-dark overflow-x-hidden pb-10">
      <Header />

      <main className="flex-1 pb-64 pt-4">
        {/* Indicateur de statut hors-ligne pour mobile */}
        {!isOnline && (
          <div className="mx-4 mb-4 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 p-2 rounded-lg flex items-center justify-center gap-2 text-xs font-bold animate-pulse">
            <span className="material-symbols-outlined text-sm">cloud_off</span>
            Mode hors-ligne activé
          </div>
        )}

        <ProjectSection 
          projects={PROJECTS} 
          selectedId={selectedProjectId} 
          onSelect={setSelectedProjectId} 
        />
        
        <AddMemberSection onAdd={addNewMember} />

        <div className="px-4 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold dark:text-white">
            Liste de l'équipe 
            <span className="text-sm font-normal text-slate-500 ml-1">
              ({members.length})
            </span>
          </h2>
          <button 
            onClick={markAllPresent}
            className="text-xs font-semibold text-primary bg-primary/10 px-3 py-2 rounded-full hover:bg-primary/20 transition-all active:scale-95"
          >
            Tout présent
          </button>
        </div>

        <section className="px-4 space-y-4">
          {members.map((member) => (
            <MemberCard 
              key={member.id} 
              member={member} 
              onToggle={toggleStatus} 
              onUpdate={updateMemberData}
              onDelete={deleteMember}
            />
          ))}
        </section>
      </main>

      <Footer 
        presentCount={counts.present} 
        absentCount={counts.absent} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onExportPDF={exportPDF}
        onExportExcel={exportExcel}
      />
    </div>
  );
};

export default App;
