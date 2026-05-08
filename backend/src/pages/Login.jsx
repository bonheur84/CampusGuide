import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContexteUtilisateur } from '../contexte/ContexteUtilisateur';

const Login = () => {
  const [mode, setMode] = useState('connexion'); // 'connexion' ou 'inscription'
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const { mettreAJourUtilisateur } = useContext(ContexteUtilisateur);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const gererSoumission = (e) => {
    e.preventDefault();
    if (mode === 'inscription') {
      // Simulation d'inscription
      localStorage.setItem('campus_user', JSON.stringify(formData));
      alert('Compte créé avec succès ! Connectez-vous.');
      setMode('connexion');
    } else {
      // Simulation de connexion
      const stock = localStorage.getItem('campus_user');
      if (stock) {
        const user = JSON.parse(stock);
        if (user.email === formData.email && user.password === formData.password) {
          mettreAJourUtilisateur({
            prenom: user.nom.split(' ')[0],
            nom: user.nom.split(' ')[1] || '',
            email: user.email
          });
          alert(`Bienvenue ${user.nom} !`);
          navigate('/');
        } else {
          alert('Email ou mot de passe incorrect.');
        }
      } else {
        // Mode démo par défaut
        mettreAJourUtilisateur({
          prenom: 'Admin',
          nom: 'UNH',
          email: formData.email
        });
        alert('On va dire que ça marche pour la démonstration !');
        navigate('/');
      }
    }
  };

  const seConnecterAvecGoogle = () => {
    const userGoogle = { nom: "Utilisateur Google", email: "utilisateur@gmail.com" };
    mettreAJourUtilisateur({
      prenom: 'Utilisateur',
      nom: 'Google',
      email: userGoogle.email
    });
    alert('Connexion Google réussie !');
    navigate('/');
  };

  return (
    <div className="fixed inset-0 flex flex-col md:flex-row min-h-screen bg-bg z-2000">
      {/* Côté Image */}
      <div 
        className="flex-none md:flex-1 relative flex items-center justify-center min-h-[250px] md:min-h-screen" 
        style={{ 
          backgroundImage: "url('/assets/universite-nouveaux-horizons.jpg')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat' 
        }}
      >
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]"></div>
        <div className="absolute bottom-10 left-10 text-white z-10 hidden md:block">
           <h1 className="text-4xl font-bold mb-2">Université Nouveaux Horizons</h1>
           <p className="opacity-80">L'excellence au cœur de l'éducation.</p>
        </div>
      </div>

      {/* Côté Formulaire */}
      <div className="flex-1 md:flex-[0_0_550px] flex items-center justify-center bg-bg px-6 py-10 md:px-12 md:py-10 overflow-y-auto">
        <div className="bg-white rounded-3xl p-8 md:px-12 md:py-12 w-full max-w-[460px] shadow-[0_20px_60px_rgba(58,176,255,0.12)] anime-apparition scale-90 md:scale-95">
          <div className="text-center mb-6 md:mb-8">
            <div className="flex items-center justify-center bg-primary text-white text-3xl rounded-2xl w-16 h-16 mx-auto mb-4 shadow-lg shadow-primary/20">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <h2 className="text-2xl md:text-[28px] font-extrabold text-slate-800">
              {mode === 'connexion' ? 'Connexion' : 'Inscription'}
            </h2>
            <p className="text-slate-500 text-sm mt-2">Accédez à votre espace CampusGuide</p>
          </div>

          {/* Onglets */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button 
              onClick={() => setMode('connexion')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer ${mode === 'connexion' ? 'bg-white shadow-[0_2px_4px_rgba(0,0,0,0.05)] text-primary' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Se connecter
            </button>
            <button 
              onClick={() => setMode('inscription')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer ${mode === 'inscription' ? 'bg-white shadow-[0_2px_4px_rgba(0,0,0,0.05)] text-primary' : 'text-slate-500 hover:text-slate-700'}`}
            >
              S'inscrire
            </button>
          </div>

          <form onSubmit={gererSoumission} className="space-y-5">
            {mode === 'inscription' && (
              <div>
                <label className="block text-[13px] font-semibold text-slate-500 mb-2">Nom complet</label>
                <div className="flex items-center bg-slate-50 border-[1.5px] border-slate-200 rounded-xl px-3.5 gap-2.5 transition-all duration-200 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(58,176,255,0.15)] focus-within:bg-white text-sm">
                  <i className="fa-solid fa-user text-slate-400 shrink-0"></i>
                  <input 
                    type="text" 
                    name="nom"
                    placeholder="John Doe" 
                    required 
                    className="flex-1 border-none outline-none bg-transparent text-slate-900 font-inter py-3.5"
                    value={formData.nom}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

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

            <div>
              <label className="block text-[13px] font-semibold text-slate-500 mb-2">Mot de passe</label>
              <div className="flex items-center bg-slate-50 border-[1.5px] border-slate-200 rounded-xl px-3.5 gap-2.5 transition-all duration-200 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(58,176,255,0.15)] focus-within:bg-white text-sm">
                <i className="fa-solid fa-lock text-slate-400 shrink-0"></i>
                <input 
                  type="password" 
                  name="password"
                  placeholder="••••••••" 
                  required 
                  className="flex-1 border-none outline-none bg-transparent text-slate-900 font-inter py-3.5"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" className="w-full py-3.5 bg-primary text-white border-none rounded-xl text-base font-bold font-inter cursor-pointer transition-all duration-200 shadow-[0_4px_12px_rgba(58,176,255,0.35)] tracking-wide hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(58,176,255,0.45)]">
                {mode === 'connexion' ? 'Se connecter' : 'Créer mon compte'}
              </button>
            </div>

            <div className="relative flex items-center py-2 mt-2">
              <div className="grow border-t border-slate-200"></div>
              <span className="shrink-0 px-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Ou</span>
              <div className="grow border-t border-slate-200"></div>
            </div>

            <button 
              type="button" 
              onClick={seConnecterAvecGoogle}
              className="w-full py-3.5 bg-white border border-slate-200 rounded-xl text-[14.5px] font-bold text-slate-700 cursor-pointer transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm flex items-center justify-center gap-3"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              {mode === 'connexion' ? 'Se connecter avec Google' : "S'inscrire avec Google"}
            </button>
          </form>
          
          <p className="text-center text-[13px] text-slate-400 mt-8">
            En continuant, vous acceptez nos <span className="text-slate-600 font-semibold cursor-pointer underline">Conditions d'utilisation</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
