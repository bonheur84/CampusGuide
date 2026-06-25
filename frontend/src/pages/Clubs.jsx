import React, { useState, useEffect } from 'react';
import { apiClubs } from '../api';
import SkeletonCard from '../components/ui/SkeletonCard';
import StarRating from '../components/ui/StarRating';
import Tooltip from '../components/ui/Tooltip';
import LazyImage from '../components/ui/LazyImage';
const Clubs = () => {
  const [recherche, setRecherche] = useState('');
  const [filtreActif, setFiltreActif] = useState('tous');
  const [tousLesClubs, setTousLesClubs] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [clubSelectionne, setClubSelectionne] = useState(null);
  // Charger les clubs depuis le backend
  useEffect(() => {
    const chargerClubs = async () => {
      try {
        setChargement(true);
        const data = await apiClubs.getAll();
        setTousLesClubs(data.clubs);
        setErreur(null);
      } catch (err) {
        console.error('Impossible de joindre le serveur.');
        setErreur('Le serveur est inaccessible. Vérifiez que le backend est démarré.');
      } finally {
        setChargement(false);
      }
    };
    chargerClubs();
  }, []);
  const categories = [
    { id: 'tous', nom: 'Tous', icone: 'fa-th' },
    { id: 'academique', nom: 'Académique', icone: 'fa-graduation-cap' },
    { id: 'sport', nom: 'Sport', icone: 'fa-futbol' },
    { id: 'art', nom: 'Art & Culture', icone: 'fa-palette' },
    { id: 'tech', nom: 'Tech', icone: 'fa-laptop-code' }
  ];
  const clubsFiltrés = tousLesClubs.filter(club => {
    const correspondRecherche = club.nom.toLowerCase().includes(recherche.toLowerCase()) || 
                               club.description.toLowerCase().includes(recherche.toLowerCase());
    const correspondFiltre = filtreActif === 'tous' || club.categorie === filtreActif;
    return correspondRecherche && correspondFiltre;
  });
  // Rejoindre un club et mettre à jour le compteur localement
  const rejoindreClub = async (id) => {
    try {
      const data = await apiClubs.rejoindre(id);
      setTousLesClubs(prev =>
        prev.map(c => c.id === id ? { ...c, membres: data.membres } : c)
      );
    } catch (err) {
      console.error('Impossible de rejoindre le club pour le moment.');
    }
  };
  return (
    <main className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16 anime-apparition">
      <section className="flex flex-col items-center text-center max-w-[1200px] mx-auto mb-12">
        <span className="bg-sky-100 text-primary px-4 py-2 rounded-full text-[10px] md:text-xs border border-primary font-bold tracking-wider inline-flex items-center gap-2 shadow-[0_4px_15px_rgba(58,176,255,0.1)]">
          <i className="fa-solid fa-users"></i> CLUBS & ASSOCIATIONS
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-[66px] font-bold my-6 text-slate-900 leading-tight md:leading-none max-w-[900px]">
          Rejoignez une <span className="text-primary">Communauté</span>
        </h1>
        <p className="text-slate-500 text-lg md:text-[22px] mb-8 max-w-[800px] leading-relaxed">
          Découvrez les clubs étudiants de l'université et trouvez celui qui correspond à vos passions.
        </p>
        <div className="bg-white w-full max-w-[600px] px-5 py-4 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center gap-3 border border-slate-200 mb-8 mx-auto">
          <Tooltip content="Rechercher un club">
            <i className="fa-solid fa-search text-slate-400 text-lg"></i>
          </Tooltip>
          <input 
            type="text" 
            placeholder="Rechercher un club par son nom..." 
            className="flex-1 border-none outline-none text-base text-slate-800 font-inter bg-transparent"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>
      </section>
      <section className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[2px]">Tous les Clubs</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setFiltreActif(cat.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${filtreActif === cat.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary'}`}
            >
              <i className={`fas ${cat.icone}`}></i> {cat.nom}
            </button>
          ))}
        </div>
        {chargement && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
          </div>
        )}
        {erreur && !chargement && (
          <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-100">
            <i className="fas fa-server text-4xl mb-3 text-red-300"></i>
            <p className="text-red-500 font-semibold">{erreur}</p>
            <p className="text-sm text-red-400 mt-1">Lancez le backend : <code className="bg-red-100 px-2 py-0.5 rounded">npm run dev</code></p>
          </div>
        )}
        {!chargement && !erreur && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {clubsFiltrés.map((club, index) => (
              <CarteClub key={club.id} club={club} index={index} onRejoindre={rejoindreClub} onClick={() => setClubSelectionne(club)} />
            ))}
            {clubsFiltrés.length === 0 && (
              <div className="col-span-full text-center py-20 text-slate-500">
                <i className="fas fa-search text-5xl mb-4 text-slate-300"></i>
                <p className="text-xl font-medium">Aucun club trouvé</p>
              </div>
            )}
          </div>
        )}
      </section>

      {clubSelectionne && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-3000" onClick={() => setClubSelectionne(null)}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl w-[95%] max-w-[600px] z-4000 overflow-hidden shadow-2xl anime-apparition border border-gray-100">
            {/* Header avec dégradé moderne */}
            <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <i className={`fa-solid ${clubSelectionne.icone} text-white text-3xl`}></i>
                </div>
              </div>
              <button
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm border border-white/30 w-10 h-10 rounded-xl cursor-pointer text-white flex items-center justify-center hover:bg-white/30 transition-all duration-300"
                onClick={() => setClubSelectionne(null)}
              >
                <i className="fa-solid fa-times text-lg"></i>
              </button>
              <div className="absolute bottom-4 left-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{clubSelectionne.nom}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-3 py-1 bg-white/25 backdrop-blur-sm rounded-full text-white">
                    {clubSelectionne.categorieNom}
                  </span>
                  <span className="text-xs text-white/90 flex items-center gap-1">
                    <i className="fa-solid fa-users"></i> {clubSelectionne.membres} membres
                  </span>
                </div>
              </div>
            </div>

            {/* Contenu principal */}
            <div className="p-6 space-y-6">
              {/* Section Description */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-info-circle text-primary text-sm"></i>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Description</h4>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {clubSelectionne.description}
                </p>
              </div>

              {/* Section Administrateur avec design moderne */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-user-tie text-white text-sm"></i>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Administrateur</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <i className="fa-solid fa-user text-blue-500 text-sm"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Nom</p>
                      <p className="text-sm font-semibold text-gray-900">{clubSelectionne.administrateurNom || 'Bonheur Nzau'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <i className="fa-solid fa-graduation-cap text-blue-500 text-sm"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Promotion</p>
                      <p className="text-sm font-semibold text-gray-900">{clubSelectionne.administrateurPromotion || 'L2 informatique'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <i className="fa-solid fa-envelope text-blue-500 text-sm"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{clubSelectionne.administrateurEmail || 'nzaubonheur84@gmail.com'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <i className="fa-solid fa-phone text-blue-500 text-sm"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Téléphone</p>
                      <p className="text-sm font-semibold text-gray-900">{clubSelectionne.administrateurTelephone || '0975079756'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Compétences avec design moderne */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-graduation-cap text-white text-sm"></i>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Compétences acquises</h4>
                </div>
                {clubSelectionne.competences ? (
                  <div className="flex flex-wrap gap-2">
                    {(typeof clubSelectionne.competences === 'string' ? JSON.parse(clubSelectionne.competences) : clubSelectionne.competences).map((competence, index) => (
                      <span key={index} className="px-3 py-1.5 bg-white text-emerald-700 rounded-lg text-xs font-medium shadow-sm border border-emerald-200 hover:bg-emerald-50 transition-colors duration-200">
                        {competence}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm leading-relaxed bg-white p-3 rounded-lg">
                    En rejoignant ce club, vous développerez des compétences en leadership, travail d'équipe, communication et gestion de projet.
                  </p>
                )}
              </div>

              {/* Section Action avec design moderne */}
              <div className="bg-gradient-to-r from-primary to-primary/90 rounded-xl p-5 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-users text-white"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wide">Rejoindre le club</h4>
                    <p className="text-xs text-white/80">Devenez membre de la communauté</p>
                  </div>
                </div>
                <p className="text-sm text-white/90 mb-4 leading-relaxed">
                  Prêt(e) à rejoindre l'aventure ? Cliquez sur le bouton ci-dessous pour intégrer le groupe WhatsApp et participer aux activités du club.
                </p>
                <a href={clubSelectionne.lien} target="_blank" rel="noopener noreferrer" className="no-underline" onClick={() => { rejoindreClub(clubSelectionne.id); setClubSelectionne(null); }}>
                  <button className="w-full py-3.5 bg-white text-primary rounded-xl font-bold text-sm transition-all hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-3">
                    <i className="fa-brands fa-whatsapp text-lg"></i>
                    <span>Rejoindre sur WhatsApp</span>
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};
const CarteClub = ({ club, index, onRejoindre, onClick }) => {
  const palettes = [
    'border-t-blue-500 from-blue-50 text-blue-700 bg-blue-500',
    'border-t-purple-500 from-purple-50 text-purple-700 bg-purple-500',
    'border-t-rose-500 from-rose-50 text-rose-700 bg-rose-500',
    'border-t-amber-500 from-amber-50 text-amber-700 bg-amber-500',
    'border-t-emerald-500 from-emerald-50 text-emerald-700 bg-emerald-500',
    'border-t-indigo-500 from-indigo-50 text-indigo-700 bg-indigo-500',
    'border-t-teal-500 from-teal-50 text-teal-700 bg-teal-500',
  ];
  const currentPalette = palettes[index % palettes.length];
  const classes = currentPalette.split(' ');
  const borderClass = classes[0];
  const bgGradient = classes[1];
  const textClass = classes[2];
  const badgeBg = classes[3];
  return (
    <div className={`bg-white rounded-[24px] p-6 border-t-[6px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] hover:-translate-y-2 ${borderClass} flex flex-col h-full cursor-pointer`}
         onClick={onClick}>
      <div className="flex items-center gap-4 mb-5">
        <div className={`w-14 h-14 rounded-2xl ${badgeBg} bg-opacity-10 flex items-center justify-center text-xl`}>
          <i className={`fa-solid ${club.icone} ${textClass}`}></i>
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-lg leading-tight">{club.nom}</h3>
          <p className="text-[11px] text-slate-400 uppercase font-black tracking-widest mt-1">{club.categorieNom}</p>
          <div className="mt-2">
            <StarRating itemId={club.id} itemType="club" initialRating={club.moyenneRating || club.note || 0} size="sm" showCount={true} />
          </div>
        </div>
      </div>
      <div className="mb-6 flex-1">
        <p className="text-sm text-slate-600 leading-relaxed">
          {club.description}
        </p>
      </div>
      <div className="flex items-center justify-between mb-6 pt-4 border-t border-slate-50">
        <span className="text-xs text-slate-400 font-bold flex items-center gap-2">
          <i className="fa-solid fa-user-group text-primary"></i> {club.membres} membres
        </span>
      </div>
      <a href={club.lien} target="_blank" rel="noopener noreferrer" className="no-underline" onClick={(e) => { e.stopPropagation(); onRejoindre(club.id); }}>
        <button className={`w-full py-3.5 rounded-xl text-white text-[14px] font-bold transition-all hover:brightness-95 flex items-center justify-center gap-2 shadow-lg ${badgeBg} hover:shadow-xl`}>
          <i className="fa-brands fa-whatsapp"></i> Rejoindre sur WhatsApp
        </button>
      </a>
    </div>
  );
};
export default Clubs;