
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { AttendanceStatus, AbsenceReason, Member, Project, NavTab, Role } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import MemberCard from './components/MemberCard';
import ProjectSection from './components/ProjectSection';
import AddMemberSection from './components/AddMemberSection';

// Importations dynamiques pour les exports
const getJsPDF = () => import('https://esm.sh/jspdf').then(m => m.jsPDF);
const getAutoTable = () => import('https://esm.sh/jspdf-autotable').then(m => m.default);
const getXLSX = () => import('https://esm.sh/xlsx').then(m => m);

const APP_VERSION = "1.0.3"; // On change le numéro pour être sûr de voir la mise à jour

const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'Alex Morgan', role: 'Chef d\'équipe', status: AttendanceStatus.UNMARKED },
  { id: '2', name: 'Jordan Smith', role: 'Relais technique', status: AttendanceStatus.UNMARKED },
];

const PROJECTS: Project[] = [
  { id: 'p1', name: 'Équipe Chantier A' },
  { id: 'p2', name: 'Équipe Chantier B' },
];

const App: React.FC = () => {
  // On récupère ce qu'on a enregistré la dernière fois
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('site_attendance_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [selectedProjectId, setSelectedProjectId] = useState(() => {
    return localStorage.getItem('site_attendance_project') || PROJECTS[0].id;
  });

  const [activeTab, setActiveTab] = useState<NavTab>('attendance');

  // Dès qu'on change un truc, on enregistre dans la mémoire du téléphone
  useEffect(() => {
    localStorage.setItem('site_attendance_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('site_attendance_project', selectedProjectId);
  }, [selectedProjectId]);

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
    if (window.confirm('Supprimer définitivement ce salarié ?')) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
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

  const resetToday = useCallback(() => {
    if (window.confirm('Vider les présences et les signatures d\'aujourd\'hui ?')) {
      setMembers(prev => prev.map(m => ({
        ...m,
        status: AttendanceStatus.UNMARKED,
        signature: undefined,
        comment: '',
        absenceReason: undefined
      })));
    }
  }, []);

  const exportPDF = async () => {
    const jsPDF = await getJsPDF();
    const autoTable = await getAutoTable();
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString();
    const projName = PROJECTS.find(p => p.id === selectedProjectId)?.name || 'Chantier';

    doc.setFontSize(18);
    doc.text(`Émargement - ${projName}`, 14, 20);
    doc.setFontSize(11);
    doc.text(`Date : ${dateStr}`, 14, 30);

    const tableData = members.map(m => [
      m.name,
      m.role,
      m.status,
      m.arrivalTime || '-',
      m.departureTime || '-',
      m.signature ? 'Signé' : 'Non'
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Nom', 'Rôle', 'Statut', 'Arrivée', 'Départ', 'Signature']],
      body: tableData,
    });

    doc.save(`Emargement_${dateStr}.pdf`);
  };

  const exportExcel = async () => {
    const XLSX = await getXLSX();
    const dateStr = new Date().toLocaleDateString();
    
    const data = members.map(m => ({
      'Nom': m.name,
      'Statut': m.status,
      'Arrivée': m.arrivalTime || '-',
      'Départ': m.departureTime || '-'
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Présences');
    XLSX.writeFile(workbook, `Pointage_${dateStr}.xlsx`);
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background-light dark:bg-background-dark pb-32">
      <Header />

      <main className="flex-1 pt-4">
        <ProjectSection 
          projects={PROJECTS} 
          selectedId={selectedProjectId} 
          onSelect={setSelectedProjectId} 
        />
        
        <AddMemberSection onAdd={addNewMember} />

        <div className="px-4 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold dark:text-white">Effectif ({members.length})</h2>
          <button onClick={resetToday} className="text-xs text-rose-500 font-bold bg-rose-50 px-3 py-1.5 rounded-full">
            Vider la journée
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

        <div className="mt-8 text-center pb-10">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Version {APP_VERSION}
          </p>
        </div>
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
