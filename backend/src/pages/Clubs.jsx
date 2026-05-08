import React, { useState } from 'react';

const Clubs = () => {
  const [recherche, setRecherche] = useState('');
  const [filtreActif, setFiltreActif] = useState('tous');

  const tousLesClubs = [
    { id: 1, nom: "Club de Manga", description: "Partagez votre passion pour les mangas, participez à des débats et des événements cosplay.", membres: 206, categorie: "art", categorieNom: "Art et Culture", icone: "fa-book", lien: "https://chat.whatsapp.com/GzsUAwKoXgU6pP72O2lME7" },
    { id: 2, nom: "Club d'informatique", description: "Hackathons, projets collaboratifs, ateliers de programmation et initiation à l'IA.", membres: 62, categorie: "tech", categorieNom: "Tech", icone: "fa-code", lien: "https://wa.me/22997047047" },
    { id: 3, nom: "Club de Scrabble", description: "Des tournois réguliers, des analyses de parties et des sessions d'entraînement pour tous les niveaux.", membres: 45, categorie: "academique", categorieNom: "Académique", icone: "fa-chess-board", lien: "https://wa.me/22997047047" },
    { id: 4, nom: "Club Musical", description: "Instrument, chant, composition et concerts organisés tout au long de l'année universitaire.", membres: 33, categorie: "art", categorieNom: "Art & Culture", icone: "fa-music", lien: "https://wa.me/22997047047" },
    { id: 5, nom: "Club d'Echec", description: "Des tournois réguliers, des analyses de parties et des sessions d'entraînement pour tous les niveaux.", membres: 24, categorie: "academique", categorieNom: "Académique", icone: "fa-chess", lien: "https://wa.me/22997047047" },
    { id: 6, nom: "Club Football", description: "Entraînements hebdomadaires, tournois inter-universités et matchs amicaux.", membres: 98, categorie: "sport", categorieNom: "Sport", icone: "fa-futbol", lien: "https://wa.me/22997047047" },
    { id: 7, nom: "Club Basketball", description: "Rejoignez notre équipe de basket et participez aux compétitions universitaires.", membres: 28, categorie: "sport", categorieNom: "Sport", icone: "fa-basketball", lien: "https://wa.me/22997047047" },
    { id: 8, nom: "Club d'Art", description: "Explorez votre créativité à travers la peinture, le dessin et la photographie.", membres: 24, categorie: "art", categorieNom: "Art & Culture", icone: "fa-camera", lien: "https://wa.me/22997047047" },
    { id: 9, nom: "Club Sciences", description: "Expériences, visites industrielles et conférences en sciences fondamentales et appliquées.", membres: 37, categorie: "academique", categorieNom: "Académique", icone: "fa-flask", lien: "https://wa.me/22997047047" },
    { id: 10, nom: "Club Voleyball", description: "Participez à nos entraînements de volley et développez votre esprit d'équipe.", membres: 41, categorie: "sport", categorieNom: "Sport", icone: "fa-volleyball", lien: "https://wa.me/22997047047" },
    { id: 11, nom: "Club Eloquence", description: "Développez vos talents d'orateur et participez à des concours de débat et de plaidoirie.", membres: 19, categorie: "art", categorieNom: "Art & Culture", icone: "fa-microphone", lien: "https://wa.me/22997047047" }
  ];

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

  return (
    <main className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16 anime-apparition">
      {/* Bannière harmonisée (Bleu Campus) */}
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

        {/* Barre de recherche centrée */}
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
        {/* Catégories de clubs */}
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

        {/* Grille des Clubs avec le nouveau design de cartes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {clubsFiltrés.map((club, index) => (
             <CarteClub key={club.id} club={club} index={index} />
          ))}
          
          {clubsFiltrés.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-500">
              <i className="fas fa-search text-5xl mb-4 text-slate-300"></i>
              <p className="text-xl font-medium">Aucun club trouvé</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

const CarteClub = ({ club, index }) => {
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
    <div className={`bg-white rounded-[24px] p-6 border-t-[6px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] hover:-translate-y-2 ${borderClass} flex flex-col h-full`}>
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
        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-slate-50 text-slate-400`}>
          ID: {club.id}
        </span>
      </div>

      <a href={club.lien} target="_blank" rel="noopener noreferrer" className="no-underline">
        <button className={`w-full py-3.5 rounded-xl text-white text-[14px] font-bold transition-all hover:brightness-95 flex items-center justify-center gap-2 shadow-lg ${badgeBg} hover:shadow-xl`}>
          <i className="fa-brands fa-whatsapp"></i> Rejoindre sur WhatsApp
        </button>
      </a>
    </div>
  );
};

export default Clubs;
