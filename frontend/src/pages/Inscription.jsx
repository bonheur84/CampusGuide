import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUtilisateurs } from '../api';

const Inscription = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    motDePasse: '',
    filiere: '',
    annee: '',
  });
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setErreur(null);
  };

  const gererSoumission = async (event) => {
    event.preventDefault();
    setChargement(true);
    setErreur(null);

    try {
      const data = await apiUtilisateurs.inscription(
        formData.email,
        formData.motDePasse,
        formData.nom,
        formData.filiere,
        formData.annee,
      );

      localStorage.setItem('campus_token', data.token);
      localStorage.setItem('campus_user_id', data.utilisateur.id);
      window.location.href = '/';
    } catch (error) {
      setErreur(error.message || 'Impossible de créer le compte.');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="fixed inset-0 flex min-h-screen items-center justify-center bg-bg px-6 py-10 z-2000 overflow-y-auto">
      <div className="w-full max-w-[460px] rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(58,176,255,0.12)] md:px-12 md:py-10 anime-apparition">
        <div className="mb-7 text-center">
          <img src="/assets/logo-campusguide.png" alt="Logo CampusGuide" className="mx-auto mb-4 h-20 w-auto rounded-xl" />
          <h2 className="text-2xl font-extrabold text-slate-800">Créer un compte</h2>
          <p className="mt-2 text-sm text-slate-500">Rejoignez votre espace CampusGuide</p>
        </div>

        {erreur && (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-3.5 text-sm font-medium text-red-600">
            <i className="fa-solid fa-circle-exclamation mr-2 text-red-400"></i>
            {erreur}
          </div>
        )}

        <form onSubmit={gererSoumission} className="space-y-4">
          <input name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom complet" required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-primary" />
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Adresse email" required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-primary" />
          <input name="motDePasse" type="password" value={formData.motDePasse} onChange={handleChange} placeholder="Mot de passe" minLength="6" required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-primary" />
          <div className="grid grid-cols-2 gap-3">
            <input name="filiere" value={formData.filiere} onChange={handleChange} placeholder="Filière" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-primary" />
            <input name="annee" value={formData.annee} onChange={handleChange} placeholder="Année" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-primary" />
          </div>
          <button type="submit" disabled={chargement} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-bold text-white shadow-[0_4px_12px_rgba(58,176,255,0.35)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
            {chargement ? <><i className="fa-solid fa-spinner fa-spin"></i> Création...</> : 'Créer mon compte'}
          </button>
        </form>

        <button type="button" onClick={() => navigate('/login')} className="mt-6 w-full text-center text-sm font-semibold text-primary hover:underline">
          J&apos;ai déjà un compte
        </button>
      </div>
    </div>
  );
};

export default Inscription;
