import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContexteUtilisateur } from '../contexte/ContexteUtilisateur';
import { apiUtilisateurs } from '../api';
const Login = () => {
  const { utilisateur, mettreAJourUtilisateur, pret } = useContext(ContexteUtilisateur);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (pret && utilisateur.id) {
      if (utilisateur.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [pret, utilisateur, navigate]);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [messageSucces, setMessageSucces] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErreur(null); // Effacer l'erreur quand l'utilisateur tape
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const gererSoumission = async (e) => {
    e.preventDefault();
    setChargement(true);
    setErreur(null);
    try {
      // Appel API connexion
      const data = await apiUtilisateurs.connexion(formData.email, formData.password);
        // Stocker les infos utilisateur (et le token)
      const u = data.utilisateur;
      localStorage.setItem('campus_token', data.token);
      localStorage.setItem('campus_user_id', u.id);
      mettreAJourUtilisateur({
        id: u.id,
        prenom: u.nom.split(' ')[0],
        nom: u.nom.split(' ').slice(1).join(' ') || '',
        email: u.email,
        filiere: u.filiere,
        annee: u.annee,
        promotion: u.annee, // S'assurer que promotion est aussi défini
        role: u.role,
      });
      if (u.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      // Afficher l'erreur du serveur proprement
      setErreur(err.message || 'Une erreur est survenue. Vérifiez que le serveur est démarré.');
    } finally {
      setChargement(false);
    }
  };
  const seConnecterAvecGoogle = async () => {
    // Simulation Google — en production, utiliser OAuth2
    try {
      const data = await apiUtilisateurs.connexion('student@campusguide.com', 'student123');
      const u = data.utilisateur;
      localStorage.setItem('campus_token', data.token);
      mettreAJourUtilisateur({
        id: u.id,
        prenom: u.nom.split(' ')[0],
        nom: u.nom.split(' ').slice(1).join(' ') || '',
        email: u.email,
        role: u.role,
      });
      if (u.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch {
      setErreur('Connexion Google indisponible. Essayez avec email/mot de passe.');
    }
  };
  return (
    <div className="fixed inset-0 flex flex-col md:flex-row min-h-screen bg-bg z-2000">
      <div 
        className="flex-none md:flex-1 relative flex items-center justify-center min-h-[250px] md:min-h-screen" 
        style={{ 
          backgroundImage: "url('/assets/universite-nouveaux-horizons.jpg')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat' 
        }}
      >
        <div className="absolute inset-0 bg-primary/20"></div>
      </div>
      <div className="flex-1 md:flex-[0_0_550px] flex items-center justify-center bg-bg px-6 py-10 md:px-12 md:py-10 overflow-y-auto">
        <div className="bg-white rounded-3xl p-8 md:px-12 md:py-12 w-full max-w-[460px] shadow-[0_20px_60px_rgba(58,176,255,0.12)] anime-apparition scale-90 md:scale-95">
          <div className="text-center mb-6 md:mb-8">
            <div>
              <img src="/assets/logo-campusguide.png" alt="Logo UNH Campus" className="w-100 h-27 mx-auto mb-4 rounded-xl" />
            </div>
            <h2 className="text-2xl md:text-[28px] font-extrabold text-slate-800">
            Connexion
          </h2>
            <p className="text-slate-500 text-sm mt-2">Accédez à votre espace CampusGuide</p>
          </div>
          {erreur && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-sm text-red-600 font-medium">
              <i className="fa-solid fa-circle-exclamation text-red-400 shrink-0"></i>
              {erreur}
            </div>
          )}
          <form onSubmit={gererSoumission} className="space-y-5">
            <div>
              <label className="block text-[13px] font-semibold text-slate-500 mb-2">Adresse Email</label>
              <div className="flex items-center bg-slate-50 border-[1.5px] border-slate-200 rounded-xl px-3.5 gap-2.5 transition-all duration-200 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(58,176,255,0.15)] focus-within:bg-white text-sm">
                <i className="fa-solid fa-envelope text-slate-400 shrink-0"></i>
                <input 
                  type="email" 
                  name="email"
                  placeholder="votre@email.com" 
                  required 
                  className="flex-1 border-none outline-none bg-transparent text-slate-900 font-inter py-3.5"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Mot de passe</label>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  name="password" 
                  required 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border border-slate-200 focus:border-primary outline-none bg-slate-50" 
                  value={formData.password} 
                  onChange={handleChange} 
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={chargement}
                className="w-full py-3.5 bg-primary text-white border-none rounded-xl text-base font-bold font-inter cursor-pointer transition-all duration-200 shadow-[0_4px_12px_rgba(58,176,255,0.35)] tracking-wide hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(58,176,255,0.45)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {chargement ? (
                  <><i className="fa-solid fa-spinner fa-spin"></i> Connexion...</>
                ) : (
                  'Se connecter'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;