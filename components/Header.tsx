
import React from 'react';

interface HeaderProps {
  onShowLink: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowLink }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Émargement Chantier',
          text: 'Lien pour le pointage de l\'équipe :',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Erreur de partage:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier !');
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button 
          onClick={onShowLink}
          className="p-2 bg-primary/10 text-primary rounded-lg transition-colors active:scale-95 flex items-center justify-center"
          title="Afficher le lien et QR Code"
        >
          <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
        </button>
        <h1 className="text-xl font-bold tracking-tight dark:text-white">Pointage</h1>
      </div>
      <div className="flex items-center gap-1">
        <button 
          onClick={handleShare}
          className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all active:scale-90"
          title="Partager le lien"
        >
          <span className="material-symbols-outlined">share</span>
        </button>
        <button className="text-primary font-semibold text-sm px-3 py-1.5 hover:bg-primary/10 rounded-lg active:scale-95 transition-all">
          Historique
        </button>
      </div>
    </header>
  );
};

export default Header;
