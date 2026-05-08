import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Mentors = () => {
  const [recherche, setRecherche] = useState('');
  const [filiereActuelle, setFiliereActuelle] = useState('tous');
  const [specActuelle, setSpecActuelle] = useState('tous');
  const [listeMentors, setListeMentors] = useState([]);

  useEffect(() => {
    const mentorsSauvegardes = localStorage.getItem('campus_mentors');
    if (mentorsSauvegardes) {
      setListeMentors(JSON.parse(mentorsSauvegardes));
    } else {
      const fauxMentors = [
        { id: 1, nom: 'Jean Dupont', filiere: 'informatique', annee: 'L3', specialite: 'Développement Web', bio: 'Passionné par le React et le design UI/UX. Je peux vous aider sur vos projets front-end.', photo: null },
        { id: 2, nom: 'Marie Kel', filiere: 'medecine', annee: 'L4', specialite: 'Pédiatrie', bio: 'Étudiante en 4ème année, je partage mes fiches de révisions et conseils pour les stages.', photo: null },
        { id: 3, nom: 'Marc Obiang', filiere: 'droit', annee: 'L2', specialite: 'Droit Civil', bio: 'Spécialisé en droit des obligations. Je vous aide à préparer vos TD.', photo: null },
        { id: 4, nom: 'Alice Mbeki', filiere: 'informatique', annee: 'M1', specialite: 'Intelligence Artificielle', bio: 'Experte en Python et Machine Learning. Je vous aide à comprendre les algorithmes complexes.', photo: null },
        { id: 5, nom: 'Kevin Sifa', filiere: 'gestion', annee: 'L3', specialite: 'Marketing Digital', bio: 'Passionné par les stratégies de marque et le SEO. Je partage mon expérience de stage.', photo: null },
        { id: 6, nom: 'Sarah Toure', filiere: 'architecture', annee: 'M2', specialite: 'Architecture Moderne', bio: 'Aide pour les projets de conception 3D et le rendu architectural.', photo: null },
      ];
      setListeMentors(fauxMentors);
    }
  }, []);

  // Liste des filières uniques
  const filieres = ['tous', 'informatique', 'medecine', 'droit', 'gestion', 'architecture'];

  // Extraire les spécialisations en fonction de la filière sélectionnée
  const specialisationsDisponibles = filiereActuelle === 'tous' 
    ? [] 
    : ['tous', ...new Set(listeMentors.filter(m => m.filiere === filiereActuelle).map(m => m.specialite))];

  const mentorsFiltrés = listeMentors.filter(mentor => {
    const correspondRecherche = mentor.nom.toLowerCase().includes(recherche.toLowerCase()) || 
                               mentor.specialite.toLowerCase().includes(recherche.toLowerCase());
    const correspondFiliere = filiereActuelle === 'tous' || mentor.filiere === filiereActuelle;
    const correspondSpec = specActuelle === 'tous' || mentor.specialite === specActuelle;
    
    return correspondRecherche && correspondFiliere && correspondSpec;
  });

  const changerFiliere = (filiere) => {
    setFiliereActuelle(filiere);
    setSpecActuelle('tous'); // Réinitialiser la spécialité quand on change de filière
  };

  return (
    <main className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16 anime-apparition">
      {/* Bannière harmonisée */}
      <section className="flex flex-col items-center text-center max-w-[1200px] mx-auto mb-12">
        <span className="bg-sky-100 text-primary px-4 py-2 rounded-full text-[10px] md:text-xs border border-primary font-bold tracking-wider inline-flex items-center gap-2 shadow-[0_4px_15px_rgba(58,176,255,0.1)]">
          <i className="fa-solid fa-people-arrows"></i> SYSTÈME DE MENTORAT
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-[66px] font-bold my-6 text-slate-900 leading-tight md:leading-none max-w-[900px]">
          Trouvez votre <span className="text-primary">Mentor</span>
        </h1>
        <p className="text-slate-500 text-lg md:text-[22px] mb-8 max-w-[800px] leading-relaxed">
          Faites-vous accompagner par des étudiants plus expérimentés pour réussir votre parcours académique.
        </p>

        {/* Barre de recherche */}
        <div className="bg-white w-full max-w-[600px] px-5 py-4 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center gap-3 border border-slate-200 mb-8">
          <i className="fa-solid fa-search text-slate-400 text-lg"></i>
          <input 
            type="text" 
            placeholder="Rechercher par nom ou spécialité..." 
            className="flex-1 border-none outline-none text-base text-slate-800 font-inter bg-transparent"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>

        <Link to="/devenir-mentor" className="px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold text-[15px] hover:bg-primary transition-all flex items-center gap-2 shadow-xl hover:-translate-y-1">
          <i className="fa-solid fa-plus"></i> Devenir Mentor
        </Link>
      </section>

      <section className="max-w-[1200px] mx-auto">
        {/* FILTRES NIVEAU 1 : FILIERES */}
        <div className="mb-8">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[2px] text-center mb-6">Filtrer par Filière</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {filieres.map(f => (
              <BoutonFiltre 
                key={f} 
                texte={f === 'tous' ? 'Toutes les Filières' : f.charAt(0).toUpperCase() + f.slice(1)} 
                actif={filiereActuelle === f} 
                onClick={() => changerFiliere(f)} 
                couleur="bg-primary" 
              />
            ))}
          </div>
        </div>

        {/* FILTRES NIVEAU 2 : SPÉCIALISATIONS (Apparaît seulement si une filière est choisie) */}
        {filiereActuelle !== 'tous' && specialisationsDisponibles.length > 1 && (
          <div className="mb-12 anime-apparition-rapide">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[1px] text-center mb-4 italic">Spécialisations en {filiereActuelle}</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {specialisationsDisponibles.map(spec => (
                <button 
                  key={spec}
                  onClick={() => setSpecActuelle(spec)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${specActuelle === spec ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {spec === 'tous' ? 'Toutes les spécialités' : spec}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Grille des Mentors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mentorsFiltrés.map((mentor, index) => (
            <CarteMentor key={mentor.id} mentor={mentor} index={index} />
          ))}
          
          {mentorsFiltrés.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-500">
              <i className="fas fa-search text-5xl mb-4 text-slate-300"></i>
              <p className="text-xl font-medium">Aucun mentor trouvé</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

const BoutonFiltre = ({ texte, actif, onClick, couleur }) => {
  return (
    <button 
      onClick={onClick}
      className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${actif ? `${couleur} text-white shadow-lg shadow-primary/20` : 'bg-white border border-slate-200 text-slate-600 hover:border-primary hover:text-primary'}`}
    >
      {texte}
    </button>
  );
};

const CarteMentor = ({ mentor, index }) => {
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
    <div className={`bg-white rounded-[24px] p-6 border-t-[6px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] hover:-translate-y-2 ${borderClass}`}>
      <div className="flex items-center gap-4 mb-5">
        <div 
          className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center font-bold text-slate-400 text-xl border border-slate-100"
          style={mentor.photo ? { backgroundImage: `url(${mentor.photo})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
          {!mentor.photo && mentor.nom[0]}
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-lg leading-tight">{mentor.nom}</h3>
          <p className="text-[11px] text-slate-400 uppercase font-black tracking-widest mt-1">{mentor.filiere} • {mentor.annee}</p>
        </div>
      </div>
      
      <div className={`p-4 rounded-2xl mb-5 bg-linear-to-br ${bgGradient} to-white/50 border border-white`}>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Spécialité</p>
        <p className={`text-[15px] font-bold ${textClass}`}>{mentor.specialite}</p>
      </div>

      <div className="mb-6">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">À propos</p>
        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
          {mentor.bio || mentor.motivation || "Ce mentor n'a pas encore rempli sa biographie."}
        </p>
      </div>

      <Link 
        to={`/messages?contact=${mentor.id}`} 
        className={`w-full py-3.5 rounded-xl text-white text-[14px] font-bold transition-all hover:brightness-95 flex items-center justify-center gap-2 shadow-lg ${badgeBg} hover:shadow-xl`}
      >
        <i className="fa-solid fa-paper-plane"></i> Contacter
      </Link>
    </div>
  );
};

export default Mentors;
