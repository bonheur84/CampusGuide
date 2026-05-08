import React, { useState, useEffect, useContext } from 'react';
import { apiEvenements } from '../api';
import { ContexteUtilisateur } from '../contexte/ContexteUtilisateur';
const Calendrier = () => {
  const { utilisateur } = useContext(ContexteUtilisateur);
  const estAdmin = utilisateur?.role === 'admin';
  const [evenementsServeur, setEvenementsServeur] = useState([]);
  const [chargementEv, setChargementEv] = useState(true);
  const [inscriptions, setInscriptions] = useState({});
  // Formulaire création (admin)
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [creation, setCreation] = useState({
    titre: '', description: '', date: '', heure: '09:00',
    lieu: 'Campus Principal', categorie: 'academique',
    maxInscrits: 100, organisateur: 'Administration'
  });
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  useEffect(() => {
    const charger = async () => {
      try {
        const data = await apiEvenements.getAll({ avenir: 'true' });
        setEvenementsServeur(data.evenements);
      } catch {
        setEvenementsServeur([]);
      } finally {
        setChargementEv(false);
      }
    };
    charger();
  }, []);
  const creerEvenement = async (e) => {
    e.preventDefault();
    try {
      setEnvoiEnCours(true);
      const data = await apiEvenements.creer(creation);
      setEvenementsServeur(prev => [...prev, data.evenement].sort((a, b) => a.date.localeCompare(b.date)));
      setCreation({ titre: '', description: '', date: '', heure: '09:00', lieu: 'Campus Principal', categorie: 'academique', maxInscrits: 100, organisateur: 'Administration' });
      setFormulaireOuvert(false);
    } catch (err) {
      alert(err.message || 'Erreur lors de la création.');
    } finally {
      setEnvoiEnCours(false);
    }
  };
  const supprimerEvenement = async (id) => {
    if (!window.confirm('Supprimer cet événement définitivement ?')) return;
    try {
      await apiEvenements.supprimer(id);
      setEvenementsServeur(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      alert(err.message || 'Erreur lors de la suppression.');
    }
  };
  const sInscrire = async (id) => {
    try {
      const data = await apiEvenements.inscrire(id);
      setInscriptions(prev => ({ ...prev, [id]: true }));
      setEvenementsServeur(prev =>
        prev.map(e => e.id === id ? { ...e, inscrits: data.inscrits } : e)
      );
    } catch (err) {
      alert(err.message || "Inscription impossible.");
    }
  };
  const mois = [
    {
      nom: "Octobre 2025",
      evenements: [
        { jour: "01", titre: "Début des cours de mise à niveau", date: "Mercredi 01 octobre 2025", type: "Académique", couleur: "border-l-primary", badge: "bg-blue-50 text-sky-600" },
        { jour: "08", titre: "Meet the Staff : Rencontre du Recteur avec le Personnel", date: "Mercredi 8 octobre 2025", type: "Événement", couleur: "border-l-amber-500", badge: "bg-amber-50 text-amber-600" },
        { jour: "14", titre: "Réunion de comité de gestion", date: "Mardi 14 octobre 2025", type: "Réunion", couleur: "border-l-purple-500", badge: "bg-purple-50 text-purple-600" },
        { jour: "17", titre: "Réunion de la Commission des Études", date: "Vendredi 17 octobre 2025", type: "Réunion", couleur: "border-l-purple-500", badge: "bg-purple-50 text-purple-600" },
        { jour: "21", titre: "Réunion de comité de gestion", date: "Mardi 21 octobre 2025", type: "Réunion", couleur: "border-l-purple-500", badge: "bg-purple-50 text-purple-600" },
        { jour: "22", titre: "Début de l'année académique 2025-2026", details: ["Début de l'année académique 2025-2026", "Début des cours pour les promotions montantes"], date: "Mercredi 22 octobre 2025", type: "Académique", couleur: "border-l-primary", badge: "bg-blue-50 text-sky-600" },
        { jour: "25", titre: "Fin des cours de mise à niveau", details: ["Fin des cours de mise à niveau", "Conseil de la Faculté de Droit", "Conseil de la Faculté des Sciences de Gestion"], date: "Samedi 25 octobre 2025", type: "Académique", couleur: "border-l-primary", badge: "bg-blue-50 text-sky-600", type2: "Réunion", badge2: "bg-purple-50 text-purple-600" },
        { jour: "28", titre: "Test d'orientation", details: ["Test d'orientation", "Réunion de comité de gestion"], date: "Mardi 28 octobre 2025", type: "Examens", couleur: "border-l-red-500", badge: "bg-red-50 text-red-600", type2: "Réunion", badge2: "bg-purple-50 text-purple-600" },
        { jour: "30", titre: "CIAQ : Formation transversale", details: ["CIAQ : Formation transversale", "Communication des résultats des tests d'orientation"], date: "Jeudi 30 octobre 2025", type: "Événement", couleur: "border-l-amber-500", badge: "bg-amber-50 text-amber-600" },
        { jour: "31", titre: "CIAQ : Formation transversale", date: "Vendredi 31 octobre 2025", type: "Événement", couleur: "border-l-amber-500", badge: "bg-amber-50 text-amber-600" }
      ]
    },
    {
      nom: "Novembre 2025",
      evenements: [
        { jour: "03", titre: "Début des cours pour les nouveaux étudiants", details: ["Début des cours pour les nouveaux étudiants", "Réunion de la commission de la recherche"], date: "Lundi 03 novembre 2025", type: "Académique", couleur: "border-l-primary", badge: "bg-blue-50 text-sky-600", type2: "Réunion", badge2: "bg-purple-50 text-purple-600" },
        { jour: "04", titre: "Réunion de comité de gestion", date: "Mardi 04 novembre 2025", type: "Réunion", couleur: "border-l-purple-500", badge: "bg-purple-50 text-purple-600" },
        { jour: "05", titre: "Conseils de Facultés", details: ["Conseil de la Faculté des Sciences Informatiques", "Conseil de la Faculté des Sciences Technologiques"], date: "Mercredi 05 novembre 2025", type: "Réunion", couleur: "border-l-purple-500", badge: "bg-purple-50 text-purple-600" },
        { jour: "08", titre: "Pédagogie universitaire", date: "Ven 07 au Samedi 08 nov 2025", type: "Événement", couleur: "border-l-amber-500", badge: "bg-amber-50 text-amber-600" },
        { jour: "11", titre: "Fête du Travail (Férié)", date: "Mardi 11 novembre 2025", type: "Congés", couleur: "border-l-green-500", badge: "bg-green-50 text-green-600" },
        { jour: "20", titre: "Journée de l'Orientation", date: "Jeudi 20 novembre 2025", type: "Événement", couleur: "border-l-amber-500", badge: "bg-amber-50 text-amber-600" }
      ]
    },
    {
      nom: "Décembre 2025",
      evenements: [
        { jour: "05", titre: "Semaine de la Recherche", date: "Lun 01 au Ven 05 déc 2025", type: "Événement", couleur: "border-l-amber-500", badge: "bg-amber-50 text-amber-600" },
        { jour: "15", titre: "Début des vacances de Noël", date: "Lundi 15 décembre 2025", type: "Congés", couleur: "border-l-green-500", badge: "bg-green-50 text-green-600" },
        { jour: "25", titre: "Noël", date: "Jeudi 25 décembre 2025", type: "Congés", couleur: "border-l-green-500", badge: "bg-green-50 text-green-600" }
      ]
    },
    {
      nom: "Janvier 2026",
      evenements: [
        { jour: "01", titre: "Nouvel An", date: "Jeudi 01 janvier 2026", type: "Congés", couleur: "border-l-green-500", badge: "bg-green-50 text-green-600" },
        { jour: "04", titre: "Martyrs de l'Indépendance", date: "Dimanche 04 janvier 2026", type: "Congés", couleur: "border-l-green-500", badge: "bg-green-50 text-green-600" },
        { jour: "05", titre: "Reprise des cours", date: "Lundi 05 janvier 2026", type: "Académique", couleur: "border-l-primary", badge: "bg-blue-50 text-sky-600" },
        { jour: "16", titre: "Commémoration Laurent Désiré Kabila", date: "Vendredi 16 janvier 2026", type: "Congés", couleur: "border-l-green-500", badge: "bg-green-50 text-green-600" },
        { jour: "17", titre: "Commémoration Patrice Emery Lumumba", date: "Samedi 17 janvier 2026", type: "Congés", couleur: "border-l-green-500", badge: "bg-green-50 text-green-600" },
        { jour: "26", titre: "Début des examens du 1er Semestre", date: "Lundi 26 janvier 2026", type: "Examens", couleur: "border-l-red-500", badge: "bg-red-50 text-red-600" }
      ]
    },
    {
      nom: "Février 2026",
      evenements: [
        { jour: "07", titre: "Fin des examens du 1er Semestre", date: "Samedi 07 février 2026", type: "Examens", couleur: "border-l-red-500", badge: "bg-red-50 text-red-600" },
        { jour: "09", titre: "Début du 2ème Semestre", date: "Lundi 09 février 2026", type: "Académique", couleur: "border-l-primary", badge: "bg-blue-50 text-sky-600" }
      ]
    },
    {
      nom: "Mars 2026",
      evenements: [
        { jour: "08", titre: "Journée Internationale de la Femme", date: "Dimanche 08 mars 2026", type: "Événement", couleur: "border-l-amber-500", badge: "bg-amber-50 text-amber-600" },
        { jour: "23", titre: "Semaine de l'entrepreneuriat UNH", date: "Lun 23 au Sam 28 mars 2026", type: "Événement", couleur: "border-l-amber-500", badge: "bg-amber-50 text-amber-600" }
      ]
    },
    {
      nom: "Avril 2026",
      evenements: [
        { jour: "06", titre: "Journée du Combat de Simon Kimbangu", date: "Lundi 06 avril 2026", type: "Congés", couleur: "border-l-green-500", badge: "bg-green-50 text-green-600" },
        { jour: "13", titre: "Vacances de Pâques", date: "Lundi 13 au Samedi 18 avril 2026", type: "Congés", couleur: "border-l-green-500", badge: "bg-green-50 text-green-600" }
      ]
    },
    {
      nom: "Mai 2026",
      evenements: [
        { jour: "01", titre: "Fête du Travail", date: "Vendredi 01 mai 2026", type: "Congés", couleur: "border-l-green-500", badge: "bg-green-50 text-green-600" },
        { jour: "17", titre: "Journée de la Libération", date: "Dimanche 17 mai 2026", type: "Congés", couleur: "border-l-green-500", badge: "bg-green-50 text-green-600" }
      ]
    },
    {
      nom: "Juin 2026",
      evenements: [
        { jour: "15", titre: "Début des examens du 2ème Semestre", date: "Lundi 15 juin 2026", type: "Examens", couleur: "border-l-red-500", badge: "bg-red-50 text-red-600" },
        { jour: "27", titre: "Fin des examens du 2ème Semestre", date: "Samedi 27 juin 2026", type: "Examens", couleur: "border-l-red-500", badge: "bg-red-50 text-red-600" },
        { jour: "30", titre: "Fête de l'Indépendance", date: "Mardi 30 juin 2026", type: "Congés", couleur: "border-l-green-500", badge: "bg-green-50 text-green-600" }
      ]
    },
    {
      nom: "Juillet 2026",
      evenements: [
        { jour: "01", titre: "Début de la session de rattrapage", date: "Mercredi 01 juillet 2026", type: "Examens", couleur: "border-l-red-500", badge: "bg-red-50 text-red-600" },
        { jour: "15", titre: "Clôture de l'année académique", date: "Mercredi 15 juillet 2026", type: "Académique", couleur: "border-l-primary", badge: "bg-blue-50 text-sky-600" }
      ]
    },
    {
      nom: "Septembre 2026",
      evenements: [
        { jour: "01", titre: "Inscriptions 2026-2027", date: "Mardi 01 septembre 2026", type: "Académique", couleur: "border-l-primary", badge: "bg-blue-50 text-sky-600" },
        { jour: "15", titre: "Tests d'admission", date: "Mardi 15 septembre 2026", type: "Examens", couleur: "border-l-red-500", badge: "bg-red-50 text-red-600" }
      ]
    }
  ];
  const categorieEv = {
    'tech': { couleur: 'border-l-blue-500', badge: 'bg-blue-50 text-blue-600' },
    'academique': { couleur: 'border-l-primary', badge: 'bg-sky-50 text-sky-600' },
    'sport': { couleur: 'border-l-emerald-500', badge: 'bg-emerald-50 text-emerald-600' },
    'art': { couleur: 'border-l-purple-500', badge: 'bg-purple-50 text-purple-600' },
  };
  return (
    <main className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16 anime-apparition">
      <section className="flex flex-col items-center text-center max-w-[1200px] mx-auto">
        <span className="bg-sky-100 text-primary px-4 py-2 rounded-full text-[10px] md:text-xs border border-primary font-bold tracking-wider inline-flex items-center gap-2 shadow-[0_4px_15px_rgba(58,176,255,0.1)]">
          <i className="fa-solid fa-calendar-alt"></i> Calendrier Academique
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-[66px] font-bold my-6 text-slate-900 leading-tight md:leading-none max-w-[1000px]">
          Année universitaire <span className="text-primary">2025 – 2026</span>
        </h1>
        <p className="text-slate-500 text-base md:text-[17.6px] mb-8 max-w-[800px]">
          Retrouvez toutes les dates importantes : rentrées, examens, congés et événements de l'Université Nouveaux Horizons.
        </p>
      </section>
      <section className="max-w-4xl mx-auto mb-16 px-4">
        <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-primary/20">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <i className="fa-solid fa-calendar-star text-primary"></i> Événements à venir
            <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">En direct</span>
          </h2>
          {estAdmin && (
            <button
              onClick={() => setFormulaireOuvert(v => !v)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all shadow-md"
            >
              <i className={`fa-solid ${formulaireOuvert ? 'fa-times' : 'fa-plus'}`}></i>
              {formulaireOuvert ? 'Annuler' : 'Créer un événement'}
            </button>
          )}
        </div>
        {estAdmin && formulaireOuvert && (
          <form onSubmit={creerEvenement} className="bg-white border border-primary/20 rounded-2xl p-6 mb-8 shadow-lg space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <i className="fa-solid fa-calendar-plus text-primary"></i> Nouvel événement
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Titre *</label>
                <input required value={creation.titre} onChange={e => setCreation(p => ({...p, titre: e.target.value}))}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:border-primary outline-none bg-slate-50 text-sm" placeholder="Titre de l'événement" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <textarea value={creation.description} onChange={e => setCreation(p => ({...p, description: e.target.value}))}
                  rows={2} className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:border-primary outline-none bg-slate-50 text-sm resize-none" placeholder="Description..." />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Date *</label>
                <input required type="date" value={creation.date} onChange={e => setCreation(p => ({...p, date: e.target.value}))}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:border-primary outline-none bg-slate-50 text-sm" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Heure</label>
                <input type="time" value={creation.heure} onChange={e => setCreation(p => ({...p, heure: e.target.value}))}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:border-primary outline-none bg-slate-50 text-sm" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Lieu</label>
                <input value={creation.lieu} onChange={e => setCreation(p => ({...p, lieu: e.target.value}))}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:border-primary outline-none bg-slate-50 text-sm" placeholder="Campus Principal" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Catégorie *</label>
                <select value={creation.categorie} onChange={e => setCreation(p => ({...p, categorie: e.target.value}))}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:border-primary outline-none bg-slate-50 text-sm">
                  <option value="academique">Académique</option>
                  <option value="tech">Tech</option>
                  <option value="sport">Sport</option>
                  <option value="art">Art & Culture</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Places max</label>
                <input type="number" min="1" value={creation.maxInscrits} onChange={e => setCreation(p => ({...p, maxInscrits: parseInt(e.target.value)}))}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:border-primary outline-none bg-slate-50 text-sm" />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Organisateur</label>
                <input value={creation.organisateur} onChange={e => setCreation(p => ({...p, organisateur: e.target.value}))}
                  className="w-full mt-1 p-3 rounded-xl border border-slate-200 focus:border-primary outline-none bg-slate-50 text-sm" placeholder="Administration" />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" disabled={envoiEnCours}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-primary transition-all disabled:opacity-50">
                <i className="fa-solid fa-floppy-disk mr-2"></i>
                {envoiEnCours ? 'Enregistrement...' : 'Créer l\'événement'}
              </button>
            </div>
          </form>
        )}
        {chargementEv ? (
          <div className="text-center py-10 text-slate-400">
            <i className="fas fa-spinner fa-spin text-2xl text-primary mb-2"></i>
            <p className="text-sm">Chargement depuis le serveur...</p>
          </div>
        ) : evenementsServeur.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {evenementsServeur.map(ev => {
              const style = categorieEv[ev.categorie] || { couleur: 'border-l-slate-400', badge: 'bg-slate-50 text-slate-500' };
              const complet = ev.inscrits >= ev.maxInscrits;
              const dejaInscrit = inscriptions[ev.id];
              return (
                <div key={ev.id} className={`bg-white rounded-2xl p-5 border border-slate-100 border-l-4 ${style.couleur} shadow-sm hover:shadow-md transition-all relative group`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-slate-900 text-[15px] leading-snug flex-1 pr-2">{ev.titre}</h3>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg shrink-0 ${style.badge}`}>{ev.categorie}</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{ev.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-semibold mb-4">
                    <span><i className="fa-solid fa-calendar mr-1"></i>{ev.date}</span>
                    <span><i className="fa-solid fa-clock mr-1"></i>{ev.heure}</span>
                    <span><i className="fa-solid fa-location-dot mr-1"></i>{ev.lieu}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-bold">
                      {ev.inscrits}/{ev.maxInscrits} inscrits
                      {complet && <span className="ml-1 text-red-500">(Complet)</span>}
                    </span>
                    {estAdmin ? (
                      /* Admin : bouton supprimer */
                      <button
                        onClick={() => supprimerEvenement(ev.id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center gap-1.5"
                      >
                        <i className="fa-solid fa-trash-can"></i> Supprimer
                      </button>
                    ) : (
                      /* Étudiant : bouton s'inscrire */
                      <button
                        onClick={() => sInscrire(ev.id)}
                        disabled={complet || dejaInscrit}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          dejaInscrit ? 'bg-emerald-50 text-emerald-600 cursor-default' :
                          complet ? 'bg-slate-100 text-slate-400 cursor-not-allowed' :
                          'bg-primary text-white hover:-translate-y-0.5 hover:shadow-lg shadow-primary/20'
                        }`}
                      >
                        <i className={`fa-solid ${dejaInscrit ? 'fa-check' : 'fa-user-plus'} mr-1.5`}></i>
                        {dejaInscrit ? 'Inscrit !' : complet ? 'Complet' : "S'inscrire"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
            <i className="fa-solid fa-calendar-xmark text-3xl mb-3"></i>
            <p className="text-sm font-medium">Aucun événement à venir pour le moment.</p>
          </div>
        )}
      </section>
      <section className="max-w-4xl mx-auto pb-20 px-4">
        <div className="flex gap-4 md:gap-6 flex-wrap justify-center mb-12 bg-white py-4 px-6 rounded-xl border border-slate-200">
          <span className="flex items-center gap-2 text-[11px] md:text-[13px] font-semibold text-slate-500">
            <span className="w-3 h-3 rounded-full shrink-0 bg-primary"></span> Académique
          </span>
          <span className="flex items-center gap-2 text-[11px] md:text-[13px] font-semibold text-slate-500">
            <span className="w-3 h-3 rounded-full shrink-0 bg-red-500"></span> Examens
          </span>
          <span className="flex items-center gap-2 text-[11px] md:text-[13px] font-semibold text-slate-500">
            <span className="w-3 h-3 rounded-full shrink-0 bg-green-500"></span> Congés
          </span>
          <span className="flex items-center gap-2 text-[11px] md:text-[13px] font-semibold text-slate-500">
            <span className="w-3 h-3 rounded-full shrink-0 bg-amber-500"></span> Événements
          </span>
          <span className="flex items-center gap-2 text-[11px] md:text-[13px] font-semibold text-slate-500">
            <span className="w-3 h-3 rounded-full shrink-0 bg-purple-500"></span> Réunions
          </span>
        </div>
        {mois.map((m, mIdx) => (
          <div key={mIdx} className="mb-10">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5 mb-4 pb-3 border-b-2 border-slate-100">
              <i className="fa-solid fa-calendar-day text-primary"></i> {m.nom}
            </h2>
            <div className="flex flex-col gap-3">
              {m.evenements.map((ev, evIdx) => (
                <div 
                  key={evIdx} 
                  className={`flex items-center gap-4 px-5 py-4 rounded-[14px] bg-white border border-slate-200 border-l-4 ${ev.couleur} transition-all duration-200 hover:translate-x-1 hover:shadow-md`}
                >
                  <div className="flex flex-col items-center min-w-12">
                    <span className="text-2xl font-extrabold text-slate-900 leading-none">{ev.jour}</span>
                  </div>
                  <div className="flex-1">
                    <strong className="text-[15px] text-slate-900 block mb-0.5 leading-snug">{ev.titre}</strong>
                    {ev.details ? (
                      <ul className="list-disc pl-4 text-[13px] text-slate-900 m-0 space-y-1">
                        {ev.details.map((d, dIdx) => <li key={dIdx}>{d}</li>)}
                      </ul>
                    ) : (
                      <p className="text-[13px] text-slate-500">{ev.date}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0 items-end justify-center">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-lg ${ev.badge} whitespace-nowrap`}>
                      {ev.type}
                    </span>
                    {ev.type2 && (
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-lg ${ev.badge2} whitespace-nowrap`}>
                        {ev.type2}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="text-center mt-12">
          <a 
            href="/assets/CALENDRIER-ACADEMIQUE-2025-2026_officiel(2).pdf" 
            download="Calendrier_Academique_UNH_2025-2026.pdf"
            className="px-10 py-4 bg-slate-900 text-white no-underline rounded-2xl font-bold hover:bg-primary transition-all inline-flex items-center gap-3 mx-auto shadow-xl"
          >
            <i className="fa-solid fa-file-pdf"></i> Télécharger le calendrier complet 2025-2026
          </a>
        </div>
      </section>
    </main>
  );
};
export default Calendrier;