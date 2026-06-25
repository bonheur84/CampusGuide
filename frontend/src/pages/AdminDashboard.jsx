import React, { useState, useEffect, useContext } from 'react';
import { apiUtilisateurs, apiMentors, apiClubs, apiEvenements } from '../api';
import { ContexteUtilisateur } from '../contexte/ContexteUtilisateur';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlerte } from '../components/AlertePersonnalisee';
import SkeletonTable from '../components/ui/SkeletonTable';
import Tooltip from '../components/ui/Tooltip';
import exportService from '../services/ExportService';
import ratingService from '../services/RatingService';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';

ChartJS.register(ArcElement, ChartTooltip, Legend, CategoryScale, LinearScale, BarElement);
const AdminDashboard = () => {
  const { utilisateur, ajouterNotification } = useContext(ContexteUtilisateur);
  const [tab, setTab] = useState('utilisateurs'); // 'utilisateurs', 'mentors', 'clubs', 'evenements', 'analytics'
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [evenements, setEvenements] = useState([]);
  const [chargement, setChargement] = useState(true);
  const { montrerAlerte, AlerteComponent } = useAlerte();
  // Formulaire événement
  const [evForm, setEvForm] = useState({
    titre: '', description: '', date: '', heure: '09:00', lieu: 'Campus Principal', categorie: 'tech'
  });
  // Formulaire création utilisateur
  const [showUserForm, setShowUserForm] = useState(false);
  const [userForm, setUserForm] = useState({
    nom: '',
    email: '',
    motDePasse: '',
    filiere: 'informatique',
    annee: 'L1'
  });
  // Filtres utilisateurs
  const [filterFiliere, setFilterFiliere] = useState('tous');
  const [filterPromotion, setFilterPromotion] = useState('tous');

  // Filtrer les utilisateurs
  const filteredUtilisateurs = utilisateurs.filter(u => {
    const filiereMatch = filterFiliere === 'tous' || u.filiere === filterFiliere;
    const promotionMatch = filterPromotion === 'tous' || u.annee === filterPromotion || u.promotion === filterPromotion;
    return filiereMatch && promotionMatch;
  });

  // Statistiques précédentes pour calculer les pourcentages
  const [previousStats, setPreviousStats] = useState({
    utilisateurs: 0,
    mentors: 0,
    evenements: 0,
    mentorsActifs: 0
  });

  // Calculer le pourcentage de changement
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return 0;
    const change = ((current - previous) / previous) * 100;
    return Math.round(change * 10) / 10; // Arrondir à 1 décimale
  };

  // Sauvegarder les statistiques actuelles pour la prochaine fois
  useEffect(() => {
    if (!chargement && utilisateurs.length > 0) {
      const stats = {
        utilisateurs: utilisateurs.length,
        mentors: mentors.length,
        evenements: evenements.length,
        mentorsActifs: mentors.filter(m => m.status === 'approuve').length
      };
      localStorage.setItem('campus_admin_previous_stats', JSON.stringify(stats));
    }
  }, [chargement, utilisateurs, mentors, evenements]);

  // Charger les statistiques précédentes
  useEffect(() => {
    const saved = localStorage.getItem('campus_admin_previous_stats');
    if (saved) {
      try {
        setPreviousStats(JSON.parse(saved));
      } catch (e) {
        console.error('Erreur lors du chargement des statistiques précédentes');
      }
    }
  }, []);

  // Données pour le graphique circulaire (répartition par filière)
  const filiereData = {
    labels: ['Informatique', 'Médecine', 'Droit', 'Gestion', 'Architecture'],
    datasets: [
      {
        data: [
          utilisateurs.filter(u => u.filiere === 'informatique').length,
          utilisateurs.filter(u => u.filiere === 'medecine').length,
          utilisateurs.filter(u => u.filiere === 'droit').length,
          utilisateurs.filter(u => u.filiere === 'gestion').length,
          utilisateurs.filter(u => u.filiere === 'architecture').length
        ],
        backgroundColor: [
          '#3AB0FF',
          '#FF6B6B',
          '#4ECDC4',
          '#FFE66D',
          '#95E1D3'
        ],
        borderWidth: 0
      }
    ]
  };

  // Données pour le graphique à barres (utilisateurs par promotion)
  const promotionData = {
    labels: ['L1', 'L2', 'L3', 'M1', 'M2'],
    datasets: [
      {
        label: 'Nombre d\'étudiants',
        data: [
          utilisateurs.filter(u => u.annee === 'L1' || u.promotion === 'L1').length,
          utilisateurs.filter(u => u.annee === 'L2' || u.promotion === 'L2').length,
          utilisateurs.filter(u => u.annee === 'L3' || u.promotion === 'L3').length,
          utilisateurs.filter(u => u.annee === 'M1' || u.promotion === 'M1').length,
          utilisateurs.filter(u => u.annee === 'M2' || u.promotion === 'M2').length
        ],
        backgroundColor: '#3AB0FF',
        borderRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      }
    }
  };
  useEffect(() => {
    if (utilisateur.role !== 'admin') return;
    chargerDonnees();
  }, [utilisateur]);
  const chargerDonnees = async () => {
    setChargement(true);
    try {
      const [dataU, dataM, dataC, dataE] = await Promise.all([
        apiUtilisateurs.adminGetTous(),
        apiMentors.getAll({ tous: 'true' }),
        apiClubs.getAll(),
        apiEvenements.getAll()
      ]);
      setUtilisateurs(dataU.utilisateurs);
      setMentors(dataM.mentors);
      setClubs(dataC.clubs);
      setEvenements(dataE.evenements || []);
    } catch (err) {
      console.error(err);
    } finally {
      setChargement(false);
    }
  };
  const handleUpdateStatus = async (id, status) => {
    try {
      await apiMentors.adminUpdateStatus(id, status);
      ajouterNotification("Statut mis à jour", `Le mentor est désormais ${status}`, "success", "fa-check");
      chargerDonnees();
    } catch (err) {
      ajouterNotification("Erreur", err.message, "error");
    }
  };
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await apiEvenements.creer(evForm);
      ajouterNotification("Événement créé", "L'événement a été ajouté au calendrier", "success", "fa-calendar-plus");
      setEvForm({ titre: '', description: '', date: '', heure: '09:00', lieu: 'Campus Principal', categorie: 'tech' });
    } catch (err) {
      ajouterNotification("Erreur", err.message, "error");
    }
  };
  const handleDeleteUser = async (id, nom) => {
    const confirmed = await montrerAlerte({
      type: 'confirm',
      titre: 'Supprimer le compte',
      message: `Voulez-vous vraiment supprimer définitivement le compte de ${nom} ?`,
      boutonConfirmText: 'Supprimer',
      boutonCancelText: 'Annuler'
    });
    
    if (confirmed) {
      try {
        await apiUtilisateurs.supprimer(id);
        ajouterNotification("Compte supprimé", `Le compte de ${nom} a été effacé.`, "success", "fa-trash-can");
        chargerDonnees();
      } catch (err) {
        ajouterNotification("Erreur", err.message, "error");
      }
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await apiUtilisateurs.inscription(
        userForm.email,
        userForm.motDePasse,
        userForm.nom,
        userForm.filiere,
        userForm.annee
      );
      ajouterNotification("Compte créé", `L'étudiant ${userForm.nom} a été ajouté avec succès.`, "success", "fa-user-plus");
      setUserForm({ nom: '', email: '', motDePasse: '', filiere: 'informatique', annee: 'L1' });
      setShowUserForm(false);
      chargerDonnees();
    } catch (err) {
      ajouterNotification("Erreur", err.message, "error");
    }
  };
  const handleDeleteMentor = async (id, nom) => {
    const confirmed = await montrerAlerte({
      type: 'confirm',
      titre: 'Supprimer le profil mentor',
      message: `Voulez-vous vraiment supprimer le profil mentor de ${nom} ?`,
      boutonConfirmText: 'Supprimer',
      boutonCancelText: 'Annuler'
    });
    
    if (confirmed) {
      try {
        await apiMentors.supprimer(id);
        ajouterNotification("Profil supprimé", `Le profil mentor de ${nom} a été retiré.`, "success", "fa-user-minus");
        chargerDonnees();
      } catch (err) {
        ajouterNotification("Erreur", err.message, "error");
      }
    }
  };
  if (utilisateur.role !== 'admin') {
    return <div className="pt-40 text-center text-red-500 font-bold text-2xl">Accès Refusé — Administrateurs uniquement.</div>;
  }
  return (
    <main className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16 bg-[#f8f9fa] min-h-screen anime-apparition">
      <div className="max-w-[1200px] mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Tableau de Bord <span className="text-primary">Admin</span></h1>
          <p className="text-slate-500">Gérez les comptes, validez les mentors et organisez les événements.</p>
          <div className="flex gap-3 mt-4">
            <Tooltip content="Exporter la liste des utilisateurs en CSV">
              <button
                onClick={() => exportService.exportToCSV(
                  filteredUtilisateurs,
                  `utilisateurs_${filterFiliere !== 'tous' ? filterFiliere : 'tous'}_${filterPromotion !== 'tous' ? filterPromotion : 'tous'}`,
                  ['nom', 'email', 'role', 'filiere', 'annee', 'created_at'],
                  ['Nom', 'Email', 'Rôle', 'Filière', 'Année', 'Date de création']
                )}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all flex items-center gap-2"
              >
                <i className="fas fa-file-csv"></i> Export CSV Utilisateurs
              </button>
            </Tooltip>
            <Tooltip content="Exporter la liste des mentors en CSV">
              <button
                onClick={() => exportService.exportToCSV(
                  mentors,
                  'mentors',
                  ['nom', 'filiere', 'annee', 'specialite', 'bio', 'status', 'note', 'nb_etudiants'],
                  ['Nom', 'Filière', 'Année', 'Spécialité', 'Bio', 'Statut', 'Note', 'Étudiants']
                )}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all flex items-center gap-2"
              >
                <i className="fas fa-file-csv"></i> Export CSV Mentors
              </button>
            </Tooltip>
            <Tooltip content="Créer un nouvel utilisateur">
              <button 
                onClick={() => setShowUserForm(!showUserForm)}
                className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-all flex items-center gap-2"
              >
                <i className="fas fa-user-plus"></i> {showUserForm ? 'Fermer' : 'Nouvel Utilisateur'}
              </button>
            </Tooltip>
          </div>
        </header>
        <div className="flex gap-4 mb-8 border-b border-slate-200">
           <Tooltip content="Gérer les utilisateurs">
             <button onClick={() => setTab('utilisateurs')} className={`pb-3 px-2 font-bold text-sm transition-all border-b-2 ${tab === 'utilisateurs' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}>Utilisateurs</button>
           </Tooltip>
           <Tooltip content="Valider les demandes de mentors">
             <button onClick={() => setTab('mentors')} className={`pb-3 px-2 font-bold text-sm transition-all border-b-2 ${tab === 'mentors' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}>Demandes Mentors</button>
           </Tooltip>
           <Tooltip content="Gérer les clubs">
             <button onClick={() => setTab('clubs')} className={`pb-3 px-2 font-bold text-sm transition-all border-b-2 ${tab === 'clubs' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}>Clubs</button>
           </Tooltip>
           <Tooltip content="Créer un nouvel événement">
             <button onClick={() => setTab('evenements')} className={`pb-3 px-2 font-bold text-sm transition-all border-b-2 ${tab === 'evenements' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}>Nouvel Événement</button>
           </Tooltip>
           <Tooltip content="Voir les statistiques avancées">
             <button onClick={() => setTab('analytics')} className={`pb-3 px-2 font-bold text-sm transition-all border-b-2 ${tab === 'analytics' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}>Analytics</button>
           </Tooltip>
        </div>
        {chargement ? (
          <SkeletonTable rows={5} />
        ) : (
          <AnimatePresence mode="wait">
            {tab === 'utilisateurs' && (
              <motion.section key="u" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                {/* Filtres */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-filter text-slate-400"></i>
                    <span className="text-sm font-bold text-slate-600">Filtrer par:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Filière:</label>
                    <select
                      value={filterFiliere}
                      onChange={(e) => setFilterFiliere(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-primary outline-none bg-slate-50"
                    >
                      <option value="tous">Toutes</option>
                      <option value="informatique">Informatique</option>
                      <option value="medecine">Médecine</option>
                      <option value="droit">Droit</option>
                      <option value="gestion">Gestion</option>
                      <option value="architecture">Architecture</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Promotion:</label>
                    <select
                      value={filterPromotion}
                      onChange={(e) => setFilterPromotion(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-primary outline-none bg-slate-50"
                    >
                      <option value="tous">Toutes</option>
                      <option value="L1">L1</option>
                      <option value="L2">L2</option>
                      <option value="L3">L3</option>
                      <option value="M1">M1</option>
                      <option value="M2">M2</option>
                    </select>
                  </div>
                  <button
                    onClick={() => { setFilterFiliere('tous'); setFilterPromotion('tous'); }}
                    className="px-3 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
                  >
                    Réinitialiser
                  </button>
                </div>
                {showUserForm && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <i className="fa-solid fa-user-plus text-primary"></i> Créer un nouvel étudiant
                    </h3>
                    <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-400 uppercase ml-1">Nom complet</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="Jean Dupont" 
                          className="w-full p-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary transition-all bg-slate-50/50"
                          value={userForm.nom}
                          onChange={e => setUserForm({...userForm, nom: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-400 uppercase ml-1">Email</label>
                        <input 
                          type="email" 
                          required 
                          placeholder="jean@email.com" 
                          className="w-full p-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary transition-all bg-slate-50/50"
                          value={userForm.email}
                          onChange={e => setUserForm({...userForm, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-400 uppercase ml-1">Mot de passe</label>
                        <input 
                          type="password" 
                          required 
                          placeholder="••••••••" 
                          className="w-full p-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary transition-all bg-slate-50/50"
                          value={userForm.motDePasse}
                          onChange={e => setUserForm({...userForm, motDePasse: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-400 uppercase ml-1">Filière</label>
                        <select 
                          className="w-full p-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary transition-all bg-slate-50/50"
                          value={userForm.filiere}
                          onChange={e => setUserForm({...userForm, filiere: e.target.value})}
                        >
                          <option value="informatique">Informatique</option>
                          <option value="medecine">Médecine</option>
                          <option value="droit">Droit</option>
                          <option value="gestion">Gestion</option>
                          <option value="architecture">Architecture</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-400 uppercase ml-1">Année</label>
                        <select 
                          className="w-full p-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary transition-all bg-slate-50/50"
                          value={userForm.annee}
                          onChange={e => setUserForm({...userForm, annee: e.target.value})}
                        >
                          <option value="L1">Licence 1</option>
                          <option value="L2">Licence 2</option>
                          <option value="L3">Licence 3</option>
                          <option value="M1">Master 1</option>
                          <option value="M2">Master 2</option>
                        </select>
                      </div>
                      <div className="md:col-span-2 flex gap-3 mt-2">
                        <button 
                          type="submit" 
                          className="flex-1 py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                        >
                          <i className="fa-solid fa-check"></i> Créer le compte
                        </button>
                        <button 
                          type="button"
                          onClick={() => setShowUserForm(false)}
                          className="px-6 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Nom</th>
                        <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Email</th>
                        <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Rôle</th>
                        <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Filière</th>
                        <th className="p-5 text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredUtilisateurs.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-5 font-bold text-slate-800">{u.nom}</td>
                          <td className="p-5 text-slate-500 text-sm">{u.email}</td>
                          <td className="p-5">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-5 text-slate-500 text-sm">{u.filiere || '-'} {u.promotion || ''}</td>
                          <td className="p-5">
                            {u.id !== utilisateur.id && (
                              <button 
                                onClick={() => handleDeleteUser(u.id, u.nom)}
                                className="text-red-400 hover:text-red-600 bg-transparent border-none cursor-pointer p-2 rounded-lg hover:bg-red-50 transition-all"
                              >
                                <i className="fa-solid fa-trash-can"></i>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.section>
            )}
            {tab === 'mentors' && (
              <motion.section key="m" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mentors.length > 0 ? (
                  mentors.map(m => {
                    return (
                    <div key={m.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex gap-6 relative group">
                      <button 
                        onClick={() => handleDeleteMentor(m.id, m.nom)}
                        className="absolute top-4 right-4 w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white cursor-pointer"
                        title="Supprimer le profil mentor"
                      >
                        <i className="fa-solid fa-user-minus text-xs"></i>
                      </button>
                      <div className="w-20 h-20 bg-slate-100 rounded-2xl shrink-0 overflow-hidden">
                        {m.photo ? <img src={m.photo} className="w-full h-full object-cover" /> : <i className="fa-solid fa-user text-3xl text-slate-300 mt-5 ml-6"></i>}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-slate-900 text-lg">{m.nom}</h3>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            m.status === 'approuve' ? 'bg-emerald-100 text-emerald-600' : 
                            m.status === 'rejete' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                            {m.status}
                          </span>
                        </div>
                        <p className="text-primary text-xs font-bold mb-2 uppercase">{m.filiere} • {m.annee}</p>
                        <p className="text-slate-500 text-sm line-clamp-2 mb-3 italic">"{m.bio}"</p>
                        
                        {/* Rating Statistics */}
                        <div className="bg-slate-50 rounded-xl p-3 mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-600 uppercase">Note moyenne</span>
                            <span className="text-lg font-bold text-amber-500">{m.moyenneRating || 0}/5</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500">Nombre de votes</span>
                            <span className="text-sm font-semibold text-slate-700">{m.totalVotes || 0} étudiant{m.totalVotes > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        
                        {m.status === 'en_attente' && (
                          <div className="flex gap-2">
                             <button onClick={() => handleUpdateStatus(m.id, 'approuve')} className="flex-1 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all">Accepter</button>
                             <button onClick={() => handleUpdateStatus(m.id, 'rejete')} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-all">Refuser</button>
                          </div>
                        )}
                        {m.status === 'approuve' && (
                           <button onClick={() => handleUpdateStatus(m.id, 'rejete')} className="w-full py-2 bg-slate-50 text-slate-400 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-500 transition-all">Révoquer le statut</button>
                        )}
                      </div>
                    </div>
                    );
                  })
                ) : (
                  <div className="col-span-2 py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 font-medium">Aucun mentor répertorié.</div>
                )}
              </motion.section>
            )}
            {tab === 'clubs' && (
              <motion.section key="c" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {clubs.length > 0 ? (
                  clubs.map(c => (
                    <div key={c.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex gap-6 relative group">
                      <div className="w-20 h-20 bg-slate-100 rounded-2xl shrink-0 overflow-hidden flex items-center justify-center">
                        <i className={`fa-solid ${c.icone} text-3xl text-slate-400`}></i>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-slate-900 text-lg">{c.nom}</h3>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase bg-primary/10 text-primary`}>
                            {c.categorieNom}
                          </span>
                        </div>
                        <p className="text-slate-500 text-sm line-clamp-2 mb-3 italic">"{c.description}"</p>
                        
                        {/* Rating Statistics */}
                        <div className="bg-slate-50 rounded-xl p-3 mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-600 uppercase">Note moyenne</span>
                            <span className="text-lg font-bold text-amber-500">{c.moyenneRating || 0}/5</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500">Nombre de votes</span>
                            <span className="text-sm font-semibold text-slate-700">{c.totalVotes || 0} étudiant{c.totalVotes > 1 ? 's' : ''}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <i className="fa-solid fa-users"></i>
                          <span>{c.membres} membres</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 font-medium">Aucun club répertorié.</div>
                )}
              </motion.section>
            )}
            {tab === 'evenements' && (
              <motion.section key="e" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <form onSubmit={handleCreateEvent} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-400 uppercase ml-1">Titre</label>
                      <input type="text" required placeholder="Ex: Hackathon UNH" className="w-full p-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary transition-all bg-slate-50/50" value={evForm.titre} onChange={e => setEvForm({...evForm, titre: e.target.value})} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-400 uppercase ml-1">Catégorie</label>
                      <select className="w-full p-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary transition-all bg-slate-50/50" value={evForm.categorie} onChange={e => setEvForm({...evForm, categorie: e.target.value})}>
                        <option value="tech">Tech & Innovation</option>
                        <option value="academique">Académique</option>
                        <option value="sport">Sport</option>
                        <option value="art">Art & Culture</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-400 uppercase ml-1">Date</label>
                      <input type="date" required className="w-full p-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary transition-all bg-slate-50/50" value={evForm.date} onChange={e => setEvForm({...evForm, date: e.target.value})} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-400 uppercase ml-1">Heure</label>
                      <input type="time" required className="w-full p-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary transition-all bg-slate-50/50" value={evForm.heure} onChange={e => setEvForm({...evForm, heure: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">Lieu</label>
                    <input type="text" required placeholder="Ex: Amphi A" className="w-full p-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary transition-all bg-slate-50/50" value={evForm.lieu} onChange={e => setEvForm({...evForm, lieu: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">Description</label>
                    <textarea rows="3" required placeholder="Détails de l'événement..." className="w-full p-3.5 rounded-xl border border-slate-200 outline-none focus:border-primary transition-all bg-slate-50/50 resize-none" value={evForm.description} onChange={e => setEvForm({...evForm, description: e.target.value})}></textarea>
                  </div>
                  <button type="submit" className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">Créer l'événement</button>
                </form>
              </motion.section>
            )}
            {tab === 'analytics' && (
              <motion.section key="a" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <i className="fa-solid fa-users text-blue-600 text-xl"></i>
                      </div>
                      {(() => {
                        const change = calculatePercentageChange(utilisateurs.length, previousStats.utilisateurs);
                        const isPositive = change >= 0;
                        return (
                          <span className={`text-xs font-bold ${isPositive ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'} px-2 py-1 rounded-full`}>
                            {isPositive ? '+' : ''}{change}%
                          </span>
                        );
                      })()}
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-1">{utilisateurs.length}</h3>
                    <p className="text-sm text-slate-500">Utilisateurs</p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <i className="fa-solid fa-people-arrows text-purple-600 text-xl"></i>
                      </div>
                      {(() => {
                        const change = calculatePercentageChange(mentors.length, previousStats.mentors);
                        const isPositive = change >= 0;
                        return (
                          <span className={`text-xs font-bold ${isPositive ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'} px-2 py-1 rounded-full`}>
                            {isPositive ? '+' : ''}{change}%
                          </span>
                        );
                      })()}
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-1">{mentors.length}</h3>
                    <p className="text-sm text-slate-500">Mentors</p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                        <i className="fa-solid fa-calendar text-amber-600 text-xl"></i>
                      </div>
                      {(() => {
                        const change = calculatePercentageChange(evenements.length, previousStats.evenements);
                        const isPositive = change >= 0;
                        return (
                          <span className={`text-xs font-bold ${isPositive ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'} px-2 py-1 rounded-full`}>
                            {isPositive ? '+' : ''}{change}%
                          </span>
                        );
                      })()}
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-1">{evenements.length}</h3>
                    <p className="text-sm text-slate-500">Événements</p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <i className="fa-solid fa-check-circle text-emerald-600 text-xl"></i>
                      </div>
                      {(() => {
                        const mentorsActifs = mentors.filter(m => m.status === 'approuve').length;
                        const change = calculatePercentageChange(mentorsActifs, previousStats.mentorsActifs);
                        const isPositive = change >= 0;
                        return (
                          <span className={`text-xs font-bold ${isPositive ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'} px-2 py-1 rounded-full`}>
                            {isPositive ? '+' : ''}{change}%
                          </span>
                        );
                      })()}
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-1">{mentors.filter(m => m.status === 'approuve').length}</h3>
                    <p className="text-sm text-slate-500">Mentors Actifs</p>
                  </div>
                </div>

                {/* Advanced Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Répartition par Filière - Pie Chart */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Répartition par Filière</h3>
                    <div className="h-64">
                      <Pie data={filiereData} options={chartOptions} />
                    </div>
                  </div>

                  {/* Utilisateurs par Promotion - Bar Chart */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Utilisateurs par Promotion</h3>
                    <div className="h-64">
                      <Bar data={promotionData} options={{
                        ...chartOptions,
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 1
                            }
                          }
                        }
                      }} />
                    </div>
                  </div>
                </div>

                {/* Simple Progress Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Mentors by Status */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Statut des Mentors</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-slate-600">Approuvés</span>
                          <span className="text-sm font-bold text-slate-900">{mentors.filter(m => m.status === 'approuve').length}</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${mentors.length > 0 ? (mentors.filter(m => m.status === 'approuve').length / mentors.length) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-slate-600">En attente</span>
                          <span className="text-sm font-bold text-slate-900">{mentors.filter(m => m.status === 'en_attente').length}</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all duration-500"
                            style={{ width: `${mentors.length > 0 ? (mentors.filter(m => m.status === 'en_attente').length / mentors.length) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-slate-600">Rejetés</span>
                          <span className="text-sm font-bold text-slate-900">{mentors.filter(m => m.status === 'rejete').length}</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 rounded-full transition-all duration-500"
                            style={{ width: `${mentors.length > 0 ? (mentors.filter(m => m.status === 'rejete').length / mentors.length) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Users by Role */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Utilisateurs par Rôle</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-slate-600">Étudiants</span>
                          <span className="text-sm font-bold text-slate-900">{utilisateurs.filter(u => u.role === 'etudiant').length}</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${utilisateurs.length > 0 ? (utilisateurs.filter(u => u.role === 'etudiant').length / utilisateurs.length) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-slate-600">Admins</span>
                          <span className="text-sm font-bold text-slate-900">{utilisateurs.filter(u => u.role === 'admin').length}</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${utilisateurs.length > 0 ? (utilisateurs.filter(u => u.role === 'admin').length / utilisateurs.length) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Statistics Table */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Statistiques Détaillées</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Utilisateurs</p>
                      <p className="text-2xl font-bold text-slate-900">{utilisateurs.length}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Mentors</p>
                      <p className="text-2xl font-bold text-slate-900">{mentors.length}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Clubs</p>
                      <p className="text-2xl font-bold text-slate-900">{clubs.length}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Événements</p>
                      <p className="text-2xl font-bold text-slate-900">{evenements.length}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Taux d'approbation</p>
                      <p className="text-2xl font-bold text-emerald-600">{mentors.length > 0 ? Math.round((mentors.filter(m => m.status === 'approuve').length / mentors.length) * 100) : 0}%</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Moyenne membres/club</p>
                      <p className="text-2xl font-bold text-amber-600">{clubs.length > 0 ? Math.round(clubs.reduce((sum, c) => sum + (c.membres || 0), 0) / clubs.length) : 0}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Filière la plus populaire</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {utilisateurs.length > 0 ? 
                          (() => {
                            const counts = utilisateurs.reduce((acc, u) => {
                              acc[u.filiere] = (acc[u.filiere] || 0) + 1;
                              return acc;
                            }, { informatique: 0, medecine: 0, droit: 0, gestion: 0, architecture: 0 });
                            const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
                            const top = sorted[0]?.[0] || '-';
                            return top.charAt(0).toUpperCase() + top.slice(1);
                          })()
                          : '-'}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Promotion la plus active</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {utilisateurs.length > 0 ?
                          ['L1', 'L2', 'L3', 'M1', 'M2'].map(p => ({
                            promo: p,
                            count: utilisateurs.filter(u => u.annee === p || u.promotion === p).length
                          })).sort((a, b) => b.count - a.count)[0]?.promo || '-'
                          : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        )}
      </div>
      <AlerteComponent />
    </main>
  );
};
export default AdminDashboard;