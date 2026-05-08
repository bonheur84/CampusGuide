import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ContexteUtilisateur } from '../contexte/ContexteUtilisateur';
const Navigation = () => {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const { utilisateur, photoProfil, notifications } = useContext(ContexteUtilisateur);
  const emplacement = useLocation();
  const nbNonLues = notifications?.filter(n => !n.lue).length || 0;
  const estActif = (chemin) => emplacement.pathname === chemin;
  const NavLink = ({ to, icon, label }) => (
    <Link to={to} className={`no-underline text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${estActif(to) ? 'bg-blue-50 text-primary' : 'text-slate-500 hover:bg-blue-50 hover:text-primary'}`}>
      <i className={`fa-solid ${icon}`}></i><span>{label}</span>
    </Link>
  );
  const MobileNavLink = ({ to, icon, label, badge = false }) => (
    <Link to={to} onClick={() => setMenuOuvert(false)} className={`no-underline text-sm font-medium flex items-center justify-between px-4 py-3 rounded-xl transition-all ${estActif(to) ? 'bg-blue-50 text-primary' : 'text-slate-500 hover:bg-blue-50 hover:text-primary'}`}>
      <div className="flex items-center gap-3">
        <i className={`fa-solid ${icon}`}></i>{label}
      </div>
      {badge && <span className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_8px_rgba(58,176,255,0.6)]"></span>}
    </Link>
  );
  return (
    <header className="fixed w-full flex justify-between items-center px-6 md:px-10 py-4 bg-white/30 backdrop-blur-md border-b border-slate-200 z-1000 transition-all duration-300">
      <Link to="/" className="flex items-center gap-3 cursor-pointer no-underline">
        <div className="flex items-center justify-center bg-primary text-white text-lg rounded-[10px] w-10 h-10">
          <i className="fa-solid fa-graduation-cap"></i>
        </div>
        <div className="text-slate-600 leading-tight text-[10px]">
          <h1 className="text-base font-bold text-slate-800">Campus<span className="text-primary">Guide</span></h1>
          <p className="text-xs">Université Nouveaux Horizons</p>
        </div>
      </Link>
      <nav className="hidden lg:flex items-center gap-1">
        <NavLink to="/" icon="fa-house" label="Accueil" />
        {utilisateur.role === 'admin' ? (
          <>
            <NavLink to="/admin" icon="fa-gauge-high" label="Dashboard" />
            <NavLink to="/mentors" icon="fa-people-arrows" label="Mentors" />
            <NavLink to="/clubs" icon="fa-users" label="Clubs" />
            <NavLink to="/calendrier" icon="fa-calendar-alt" label="Calendrier" />
          </>
        ) : (
          <>
            <NavLink to="/mentors" icon="fa-people-arrows" label="Mentorat" />
            <NavLink to="/clubs" icon="fa-users" label="Clubs" />
            <NavLink to="/campus" icon="fa-map-marked-alt" label="Campus" />
            <NavLink to="/orientation" icon="fa-compass" label="Orientation" />
            <NavLink to="/calendrier" icon="fa-calendar-alt" label="Calendrier" />
            <NavLink to="/guide" icon="fa-book-open-reader" label="Guide" />
          </>
        )}
      </nav>
      <div className="flex items-center gap-4">
        <div className="relative flex items-center gap-2.5 cursor-pointer px-3 py-1.5 rounded-lg transition-all duration-200 border border-transparent hover:bg-white hover:border-slate-200 group">
          <div className="relative">
            <div 
              className="bg-slate-200 text-slate-500 text-[13px] font-bold w-9 h-9 flex items-center justify-center rounded-full overflow-hidden shadow-sm"
              style={photoProfil ? { backgroundImage: `url(${photoProfil})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
              {!photoProfil && (utilisateur.prenom ? utilisateur.prenom[0] : 'U')}
            </div>
            {nbNonLues > 0 && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary border-2 border-white rounded-full animate-bounce shadow-sm"></span>}
          </div>
          <span className="hidden sm:inline text-sm font-semibold text-slate-800">{utilisateur.prenom}</span>
          <i className="fas fa-chevron-down text-[11px] text-slate-400 transition-transform duration-200 group-hover:rotate-180"></i>
          <div className="absolute top-[calc(100%+10px)] right-0 w-[260px] bg-white rounded-xl shadow-lg border border-slate-200 p-2 opacity-0 invisible -translate-y-2 transition-all duration-200 z-2000 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
            <Link to="/parametres" className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-600 no-underline rounded-md hover:bg-slate-50 transition-all duration-150">
              <i className="fas fa-cog text-sm w-[18px] text-center text-primary"></i>Paramètres
            </Link>
            <Link to="/profil" className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-600 no-underline rounded-md hover:bg-slate-50 transition-all duration-150">
              <i className="fa-solid fa-user text-sm w-[18px] text-center text-primary"></i>Profil
            </Link>
            {utilisateur.role === 'admin' && (
              <Link to="/admin" className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-600 no-underline rounded-md hover:bg-slate-50 hover:text-slate-800 transition-all duration-150">
                <i className="fa-solid fa-gauge text-sm w-[18px] text-center text-slate-400"></i>Tableau de bord
              </Link>
            )}
            <div className="h-px bg-slate-200 mx-2 my-1"></div>
            <Link to="/notifications" className="flex items-center justify-between px-3 py-2.5 text-sm text-slate-600 no-underline rounded-md hover:bg-slate-50 hover:text-slate-800 transition-all duration-150">
              <div className="flex items-center gap-2.5">
                <i className="fa-solid fa-bell text-sm w-[18px] text-center text-slate-400"></i>Notifications
              </div>
              {nbNonLues > 0 && <span className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_8px_rgba(58,176,255,0.6)]"></span>}
            </Link>
            <div className="h-px bg-slate-200 mx-2 my-1"></div>
            <Link 
              to="/login" 
              onClick={() => mettreAJourUtilisateur(null)}
              className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-500 no-underline rounded-md hover:bg-slate-50 transition-all duration-150"
            >
              <i className="fas fa-sign-out-alt text-sm w-[18px] text-center text-red-500"></i>Déconnexion
            </Link>
          </div>
        </div>
        <button 
          onClick={() => setMenuOuvert(!menuOuvert)}
          className="lg:hidden text-slate-600 text-xl cursor-pointer p-2 hover:bg-slate-100 rounded-lg transition-all duration-200 relative"
        >
          <i className="fa-solid fa-bars"></i>
          {nbNonLues > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full border border-white"></span>}
        </button>
      </div>
      <div className={`${menuOuvert ? 'flex' : 'hidden'} absolute top-full left-0 w-full bg-white border-b border-slate-200 flex-col p-4 gap-2 lg:hidden shadow-lg animate-fadeInDown`}>
        <MobileNavLink to="/" icon="fa-house" label="Accueil" />
        {utilisateur.role === 'admin' ? (
          <>
            <MobileNavLink to="/admin" icon="fa-gauge-high" label="Tableau de bord" />
            <MobileNavLink to="/mentors" icon="fa-people-arrows" label="Gestion Mentors" />
            <MobileNavLink to="/clubs" icon="fa-users" label="Clubs" />
            <MobileNavLink to="/calendrier" icon="fa-calendar-alt" label="Calendrier" />
          </>
        ) : (
          <>
            <MobileNavLink to="/mentors" icon="fa-people-arrows" label="Mentorat" />
            <MobileNavLink to="/clubs" icon="fa-users" label="Clubs" />
            <MobileNavLink to="/campus" icon="fa-map-marked-alt" label="Campus" />
            <MobileNavLink to="/orientation" icon="fa-compass" label="Orientation" />
            <MobileNavLink to="/calendrier" icon="fa-calendar-alt" label="Calendrier" />
            <MobileNavLink to="/guide" icon="fa-book-open-reader" label="Guide" />
          </>
        )}
        <div className="h-px bg-slate-100 my-1"></div>
        <MobileNavLink to="/notifications" icon="fa-bell" label="Notifications" badge={nbNonLues > 0} />
      </div>
    </header>
  );
};
export default Navigation;