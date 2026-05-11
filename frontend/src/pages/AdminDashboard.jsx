import React, { useState, useEffect, useContext } from 'react';
import { apiUtilisateurs, apiMentors, apiEvenements } from '../api';
import { ContexteUtilisateur } from '../contexte/ContexteUtilisateur';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlerte } from '../components/AlertePersonnalisee';
const AdminDashboard = () => {
  const { utilisateur, ajouterNotification } = useContext(ContexteUtilisateur);
  const [tab, setTab] = useState('utilisateurs'); // 'utilisateurs', 'mentors', 'evenements'
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [chargement, setChargement] = useState(true);
  const { montrerAlerte, AlerteComponent } = useAlerte();
  // Formulaire événement
  const [evForm, setEvForm] = useState({
    titre: '', description: '', date: '', heure: '09:00', lieu: 'Campus Principal', categorie: 'tech'
  });
  useEffect(() => {
    if (utilisateur.role !== 'admin') return;
    chargerDonnees();
  }, [utilisateur]);
  const chargerDonnees = async () => {
    setChargement(true);
    try {
      const [dataU, dataM] = await Promise.all([
        apiUtilisateurs.adminGetTous(),
        apiMentors.getAll({ tous: 'true' })
      ]);
      setUtilisateurs(dataU.utilisateurs);
      setMentors(dataM.mentors);
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
        </header>
        <div className="flex gap-4 mb-8 border-b border-slate-200">
           <button onClick={() => setTab('utilisateurs')} className={`pb-3 px-2 font-bold text-sm transition-all border-b-2 ${tab === 'utilisateurs' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}>Utilisateurs</button>
           <button onClick={() => setTab('mentors')} className={`pb-3 px-2 font-bold text-sm transition-all border-b-2 ${tab === 'mentors' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}>Demandes Mentors</button>
           <button onClick={() => setTab('evenements')} className={`pb-3 px-2 font-bold text-sm transition-all border-b-2 ${tab === 'evenements' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}>Nouvel Événement</button>
        </div>
        {chargement ? (
          <div className="py-20 text-center"><i className="fas fa-spinner fa-spin text-3xl text-primary"></i></div>
        ) : (
          <AnimatePresence mode="wait">
            {tab === 'utilisateurs' && (
              <motion.section key="u" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
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
                    {utilisateurs.map(u => (
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
              </motion.section>
            )}
            {tab === 'mentors' && (
              <motion.section key="m" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mentors.length > 0 ? (
                  mentors.map(m => (
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
                        <p className="text-slate-500 text-sm line-clamp-2 mb-4 italic">"{m.bio}"</p>
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
                  ))
                ) : (
                  <div className="col-span-2 py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 font-medium">Aucun mentor répertorié.</div>
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
          </AnimatePresence>
        )}
      </div>
      <AlerteComponent />
    </main>
  );
};
export default AdminDashboard;