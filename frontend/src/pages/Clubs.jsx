import React, { useState, useEffect } from 'react';
import { apiClubs } from '../api';
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
          <i className="fa-solid fa-search text-slate-400 text-lg"></i>
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
          <div className="text-center py-20 text-slate-400">
            <i className="fas fa-spinner fa-spin text-4xl mb-4 text-primary"></i>
            <p className="text-lg font-medium">Chargement des clubs depuis le serveur...</p>
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
          <div className="fixed inset-0 bg-slate-900/40 z-3000" onClick={() => setClubSelectionne(null)}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[20px] w-[90%] max-w-[520px] z-4000 overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.2)] anime-apparition">
            <div className="relative h-32 overflow-hidden bg-gradient-to-br from-primary to-primary/80">
              <div className="absolute inset-0 flex items-center justify-center">
                <i className={`fa-solid ${clubSelectionne.icone} text-white text-5xl opacity-80`}></i>
              </div>
              <button
                className="absolute top-3 right-3 bg-white/90 border-none w-8 h-8 rounded-lg cursor-pointer text-sm text-slate-600 flex items-center justify-center hover:bg-white transition-all duration-200 shadow-md"
                onClick={() => setClubSelectionne(null)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
              <div className="absolute bottom-4 left-5 text-white">
                <h3 className="text-xl font-bold drop-shadow">{clubSelectionne.nom}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-white/20 text-white">
                    {clubSelectionne.categorieNom}
                  </span>
                  <span className="text-[11px] text-white/80 flex items-center gap-1">
                    <i className="fa-solid fa-user-group text-[10px]"></i> {clubSelectionne.membres} membres
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-circle-info text-primary"></i> Description
                </p>
                <p className="text-[13.5px] text-slate-600 leading-relaxed">
                  {clubSelectionne.description}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-xs font-black text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-user-tie text-slate-600"></i> Administrateur
                </p>
                <div className="space-y-2">
                  <p className="text-[13px] text-slate-600 leading-relaxed">
                    <span className="font-semibold">Nom:</span> {clubSelectionne.administrateurNom || 'Bonheur Nzau'}
                  </p>
                  <p className="text-[13px] text-slate-600 leading-relaxed">
                    <span className="font-semibold">Promotion:</span> {clubSelectionne.administrateurPromotion || 'L2 informatique'}
                  </p>
                  <p className="text-[13px] text-slate-600 leading-relaxed">
                    <span className="font-semibold">Email:</span> {clubSelectionne.administrateurEmail || 'nzaubonheur84@gmail.com'}
                  </p>
                  <p className="text-[13px] text-slate-600 leading-relaxed">
                    <span className="font-semibold">Téléphone:</span> {clubSelectionne.administrateurTelephone || '0975079756'}
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-graduation-cap text-emerald-600"></i> Compétences acquises
                </p>
                <div className="space-y-2">
                  {clubSelectionne.competences ? (
                    <div className="flex flex-wrap gap-2">
                      {(typeof clubSelectionne.competences === 'string' ? JSON.parse(clubSelectionne.competences) : clubSelectionne.competences).map((competence, index) => (
                        <span key={index} className="text-[11px] font-medium px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-md">
                          {competence}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[13px] text-slate-600 leading-relaxed">
                      En rejoignant ce club, vous développerez des compétences en leadership, travail d'équipe, communication et gestion de projet.
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
                <p className="text-xs font-black text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-users"></i> Rejoindre le club
                </p>
                <p className="text-[13px] text-slate-600 leading-relaxed mb-3">
                  Intéressé(e) par ce club ? Cliquez sur le bouton ci-dessous pour rejoindre le groupe WhatsApp et participer aux activités.
                </p>
                <a href={clubSelectionne.lien} target="_blank" rel="noopener noreferrer" className="no-underline" onClick={() => { rejoindreClub(clubSelectionne.id); setClubSelectionne(null); }}>
                  <button className="w-full py-3 rounded-xl text-white text-[14px] font-bold transition-all hover:brightness-95 flex items-center justify-center gap-2 shadow-lg bg-primary hover:shadow-xl">
                    <i className="fa-brands fa-whatsapp"></i> Rejoindre sur WhatsApp
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