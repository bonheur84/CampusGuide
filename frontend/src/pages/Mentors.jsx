import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { apiMentors } from '../api';
import { ContexteUtilisateur } from '../contexte/ContexteUtilisateur';
import { useContext } from 'react';
import { useAlerte } from '../components/AlertePersonnalisee';
import SkeletonCard from '../components/ui/SkeletonCard';
import StarRating from '../components/ui/StarRating';
import Tooltip from '../components/ui/Tooltip';
import LazyImage from '../components/ui/LazyImage';
import ratingService from '../services/RatingService';
const Mentors = () => {
  const { utilisateur } = useContext(ContexteUtilisateur);
  const [recherche, setRecherche] = useState('');
  const [filiereActuelle, setFiliereActuelle] = useState('tous');
  const [specActuelle, setSpecActuelle] = useState('tous');
  const [listeMentors, setListeMentors] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const { montrerAlerte, AlerteComponent } = useAlerte();
  // Charger les mentors depuis le backend
  useEffect(() => {
    const chargerMentors = async () => {
      try {
        setChargement(true);
        const data = await apiMentors.getAll();
        setListeMentors(data.mentors);
        setErreur(null);
      } catch (err) {
        console.error('Impossible de joindre le serveur, utilisation des données locales.');
        // Repli sur localStorage si le backend n'est pas disponible
        const mentorsSauvegardes = localStorage.getItem('campus_mentors');
        if (mentorsSauvegardes) {
          setListeMentors(JSON.parse(mentorsSauvegardes));
        } else {
          setErreur('Le serveur est inaccessible. Vérifiez que le backend est démarré.');
        }
      } finally {
        setChargement(false);
      }
    };
    chargerMentors();
  }, []);
  // Liste des filières uniques
  const filieres = ['tous', 'informatique', 'medecine', 'droit', 'science technologique', 'science des aliments et de l\'environnement', 'gestion', 'architecture', 'SIC/multimedia'];
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
    setSpecActuelle('tous');
  };
  return (
    <Fragment>
      <main className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16 anime-apparition">
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
          <div className="bg-white w-full max-w-[600px] px-5 py-4 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center gap-3 border border-slate-200 mb-8">
            <Tooltip content="Rechercher un mentor">
              <i className="fa-solid fa-search text-slate-400 text-lg"></i>
            </Tooltip>
            <input 
              type="text" 
              placeholder="Rechercher par nom ou spécialité..." 
              className="flex-1 border-none outline-none text-base text-slate-800 font-inter bg-transparent"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
            />
          </div>
          {utilisateur.role !== 'admin' && (
            <Link to="/devenir-mentor" className="px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold text-[15px] hover:bg-primary transition-all flex items-center gap-2 shadow-xl hover:-translate-y-1">
              <i className="fa-solid fa-plus"></i> Devenir Mentor
            </Link>
          )}
        </section>
        <section className="max-w-[1200px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[2px] text-center">Nos Mentors</h2>
          </div>
          <div className="mb-8">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[2px] text-center mb-6">Filtrer par Filière</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {filieres.map(f => (
                <Tooltip content={`Filtrer par ${f === 'tous' ? 'toutes les filières' : f}`} key={f}>
                  <BoutonFiltre 
                    texte={f === 'tous' ? 'Toutes les Filières' : f.charAt(0).toUpperCase() + f.slice(1)} 
                    actif={filiereActuelle === f} 
                    onClick={() => changerFiliere(f)} 
                    couleur="bg-primary" 
                  />
                </Tooltip>
              ))}
            </div>
          </div>
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
          )}
        </section>
      </main>
      <AlerteComponent />
    </Fragment>
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
const contacterWhatsApp = async (telephone) => {
  if (!telephone) {
    await montrerAlerte({
      type: 'alert',
      titre: 'Information',
      message: 'Ce mentor n\'a pas renseigné de numéro de téléphone',
      boutonConfirmText: 'OK'
    });
    return;
  }
  // Nettoyer le numéro de téléphone (enlever les espaces, +, etc.)
  const numeroNettoye = telephone.replace(/[\s\-\(\)]/g, '');
  const urlWhatsApp = `https://wa.me/${numeroNettoye}`;
  window.open(urlWhatsApp, '_blank');
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
  const nombreVotes = ratingService.getRatingCount('mentor', mentor.id);
  return (
    <div className={`bg-white rounded-[24px] p-6 border-t-[6px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)] hover:-translate-y-2 ${borderClass}`}>
      <div className="flex items-center gap-4 mb-5">
        {mentor.photo ? (
          <LazyImage 
            src={mentor.photo} 
            alt={mentor.nom}
            className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xl border border-slate-100">
            {mentor.nom[0]}
          </div>
        )}
        <div>
          <h3 className="font-bold text-slate-900 text-lg leading-tight">{mentor.nom}</h3>
          <p className="text-[11px] text-slate-400 uppercase font-black tracking-widest mt-1">{mentor.filiere} • {mentor.annee}</p>
          <div className="mt-2">
            <StarRating itemId={mentor.id} itemType="mentor" initialRating={mentor.moyenneRating || mentor.note || 0} size="sm" showCount={true} />
          </div>
        </div>
      </div>
      <div className={`p-4 rounded-2xl mb-5 bg-linear-to-br ${bgGradient} to-white/50 border border-white`}>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Spécialité</p>
        <p className={`text-[15px] font-bold ${textClass}`}>{mentor.specialite}</p>
      </div>
      <div className="mb-4">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">À propos</p>
        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
          {mentor.bio || mentor.motivation || "Ce mentor n'a pas encore rempli sa biographie."}
        </p>
      </div>
      <div className="mb-5">
        <Tooltip content={mentor.disponible ? 'Ce mentor est disponible pour vous accompagner' : 'Ce mentor est actuellement indisponible'}>
          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${mentor.disponible ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
            <i className={`fas fa-circle text-[6px] mr-1 ${mentor.disponible ? 'text-emerald-500' : 'text-slate-400'}`}></i>
            {mentor.disponible ? 'Disponible' : 'Indisponible'}
          </span>
        </Tooltip>
      </div>
      {mentor.telephone && (
        <div className="mb-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Contact</p>
          <p className="text-sm text-slate-600 font-medium">
            <i className="fas fa-phone text-primary mr-2"></i>
            {mentor.telephone}
          </p>
        </div>
      )}
      <button
        onClick={() => contacterWhatsApp(mentor.telephone)}
        disabled={!mentor.telephone || !mentor.disponible}
        className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
          mentor.telephone && mentor.disponible 
            ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-green-500/20 hover:-translate-y-0.5' 
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
        }`}
      >
        <i className="fab fa-whatsapp"></i>
        {mentor.telephone && mentor.disponible ? 'Contacter via WhatsApp' : 
         !mentor.telephone ? 'Numéro non disponible' : 'Indisponible'}
      </button>
    </div>
  );
};
export default Mentors;