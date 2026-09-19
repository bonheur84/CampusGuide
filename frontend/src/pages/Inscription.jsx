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
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="fixed inset-0 z-2000 flex min-h-screen flex-col overflow-y-auto bg-bg md:flex-row">
      <div
        className="relative flex min-h-45 flex-none items-center justify-center md:min-h-screen md:flex-1"
        style={{
          backgroundImage: "url('/assets/Universite-Nouveaux-Horizons.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-primary/25"></div>
        <div className="relative hidden max-w-sm px-8 text-white md:block">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-white/80">CampusGuide</p>
          <h1 className="text-4xl font-extrabold leading-tight">Votre campus, plus simple à vivre.</h1>
          <p className="mt-4 text-base leading-relaxed text-white/85">Trouvez vos repères, vos clubs et les bonnes personnes dès votre arrivée.</p>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8 md:flex-[0_0_550px] md:px-12 md:py-10">
        <div className="anime-apparition w-full max-w-115 rounded-3xl bg-white p-7 shadow-[0_20px_60px_rgba(58,176,255,0.12)] sm:p-9 md:px-12 md:py-10">
          <div className="mb-7 text-center">
            <img src="/assets/logo-campusguide.png" alt="Logo CampusGuide" className="mx-auto mb-4 h-16 w-auto rounded-xl sm:h-20" />
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
          <div>
            <label htmlFor="nom" className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Nom complet</label>
            <input id="nom" name="nom" value={formData.nom} onChange={handleChange} placeholder="Ex. Marie Koudjo" autoComplete="name" required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10" />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Adresse email</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="vous@exemple.com" autoComplete="email" required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10" />
          </div>
          <div>
            <label htmlFor="motDePasse" className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Mot de passe</label>
            <div className="relative">
              <input id="motDePasse" name="motDePasse" type={showPassword ? 'text' : 'password'} value={formData.motDePasse} onChange={handleChange} placeholder="6 caractères minimum" minLength="6" autoComplete="new-password" required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-12 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700">
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="filiere" className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Filière <span className="font-normal normal-case tracking-normal">(facultatif)</span></label>
              <input id="filiere" name="filiere" value={formData.filiere} onChange={handleChange} placeholder="Informatique" autoComplete="organization-title" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10" />
            </div>
            <div>
              <label htmlFor="annee" className="mb-2 ml-1 block text-xs font-bold uppercase tracking-wider text-slate-400">Année <span className="font-normal normal-case tracking-normal">(facultatif)</span></label>
              <input id="annee" name="annee" value={formData.annee} onChange={handleChange} placeholder="L1, L2, L3..." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10" />
            </div>
          </div>
          <button type="submit" disabled={chargement} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-bold text-white shadow-[0_4px_12px_rgba(58,176,255,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(58,176,255,0.3)] disabled:cursor-not-allowed disabled:opacity-60">
            {chargement ? <><i className="fa-solid fa-spinner fa-spin"></i> Création...</> : 'Créer mon compte'}
          </button>
        </form>

        <button type="button" onClick={() => navigate('/login')} className="mt-6 w-full text-center text-sm font-semibold text-primary hover:underline">
          J&apos;ai déjà un compte
        </button>
        </div>
      </div>
    </div>
  );
};

export default Inscription;
