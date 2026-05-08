import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CompteurAnime = ({ valeur, symbole = '+' }) => {
  const [compte, setCompte] = useState(0);

  useEffect(() => {
    let debut = 0;
    const fin = parseInt(valeur);
    const duree = 2000;
    const pas = fin / (duree / 16);

    const timer = setInterval(() => {
      debut += pas;
      if (debut >= fin) {
        setCompte(fin);
        clearInterval(timer);
      } else {
        setCompte(Math.floor(debut));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [valeur]);

  return <span>{compte}{symbole}</span>;
};

const Accueil = () => {
  return (
    <div className="anime-apparition">
      <main className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16">
        <section className="flex flex-col items-center text-center max-w-[1200px] mx-auto">
          <span className="bg-sky-100 text-primary px-4 py-2 rounded-full text-[10px] md:text-xs border border-primary font-bold tracking-wider relative z-2 inline-flex items-center gap-2 shadow-[0_4px_15px_rgba(58,176,255,0.1)]">
            <i className="fa-solid fa-graduation-cap"></i> <span>ESPACE ÉTUDIANT</span>
          </span>
          
          <h1 className="text-4xl md:text-6xl lg:text-[66px] font-bold my-6 text-slate-900 leading-tight md:leading-none max-w-[900px]">
            Votre succes commence ici, avec Campus<span className="text-primary">guide</span>
          </h1>
          
          <p className="text-slate-500 text-base md:text-[17.6px] mb-8 max-w-[800px]">
            Trouvez vos salles de cours, connectez-vous avec des mentors, et naviguez dans le campus en toute simplicité.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10 w-full sm:w-auto px-4 sm:px-0">
            <Link to="/campus" className="px-6 py-3.5 rounded-[15px] font-semibold bg-primary text-white no-underline inline-block text-[15px] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(58,176,255,0.4)] transition-all duration-300">
              Explorer le Campus <i className="fa-solid fa-arrow-right ml-2.5"></i>
            </Link>
            <Link to="/mentors" className="px-6 py-3.5 rounded-[15px] font-semibold bg-white text-primary border border-primary no-underline inline-block text-[15px] hover:bg-sky-50 hover:border-primary-dark hover:text-primary-dark hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300">
              Trouver un Mentor
            </Link>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-[1000px] mx-auto w-full px-2">
            <div className="bg-orange-50 rounded-xl p-4 md:p-5 text-center border border-orange-200 shadow-sm hover:-translate-y-1 transition-transform duration-300">
              <i className="fa-solid fa-people-arrows text-xl md:text-2xl text-orange-600 mb-3 block"></i>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-1"><CompteurAnime valeur="20" /></h2>
              <p className="text-[11px] md:text-[13px] text-slate-500 font-medium uppercase tracking-wide">Mentors</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 md:p-5 text-center border border-green-200 shadow-sm hover:-translate-y-1 transition-transform duration-300">
              <i className="fa-solid fa-users text-xl md:text-2xl text-green-600 mb-3 block"></i>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-1"><CompteurAnime valeur="20" /></h2>
              <p className="text-[11px] md:text-[13px] text-slate-500 font-medium uppercase tracking-wide">Clubs</p>
            </div>
            <div className="bg-sky-50 rounded-xl p-4 md:p-5 text-center border border-sky-200 shadow-sm hover:-translate-y-1 transition-transform duration-300">
              <i className="fa-solid fa-map-marker-alt text-xl md:text-2xl text-sky-600 mb-3 block"></i>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-1"><CompteurAnime valeur="10" /></h2>
              <p className="text-[11px] md:text-[13px] text-slate-500 font-medium uppercase tracking-wide">Filieres</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 md:p-5 text-center border border-red-200 shadow-sm hover:-translate-y-1 transition-transform duration-300">
              <i className="fa-solid fa-building text-xl md:text-2xl text-red-600 mb-3 block"></i>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-1"><CompteurAnime valeur="20" /></h2>
              <p className="text-[11px] md:text-[13px] text-slate-500 font-medium uppercase tracking-wide">Auditoires</p>
            </div>
          </div>
          
          <div className="w-full max-w-[1200px] mx-auto mt-10 md:mt-15">
            <img src="/assets/Universite-Nouveaux-Horizons.jpg" alt="Campus" className="w-full rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] object-cover h-[250px] md:h-auto" />
          </div>
        </section>
        
        {/* Features Grid Section */}
        <section className="mt-12 rounded-[20px] py-12 md:py-24 text-center bg-white">
          <h2 className="text-3xl md:text-[40px] font-bold mb-4 text-slate-900 px-4">Tout ce dont vous avez besoin</h2>
          <p className="text-slate-500 mb-8 md:mb-12 px-6">Des outils conçus spécifiquement pour l'Université Nouveaux Horizons.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1000px] mx-auto relative z-1 px-6">
            <Link to="/mentors" className="bg-white rounded-2xl p-6 md:p-8 text-center border border-slate-200 transition-all duration-200 cursor-pointer no-underline hover:bg-bg hover:-translate-y-1 hover:shadow-lg hover:border-slate-300">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5 text-2xl bg-orange-50 text-orange-600"><i className="fa-solid fa-people-arrows"></i></div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Système de Mentorat</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Trouvez un mentor pour vous guider dans vos études et votre parcours.</p>
            </Link>
            <Link to="/campus" className="bg-white rounded-2xl p-6 md:p-8 text-center border border-slate-200 transition-all duration-200 cursor-pointer no-underline hover:bg-bg hover:-translate-y-1 hover:shadow-lg hover:border-slate-300">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5 text-2xl bg-sky-50 text-sky-600"><i className="fa-solid fa-map-marked-alt"></i></div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Plan des Bâtiments</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Localisez facilement n'importe quelle salle sur le campus avec notre plan interactif.</p>
            </Link>
            <Link to="/clubs" className="bg-white rounded-2xl p-6 md:p-8 text-center border border-slate-200 transition-all duration-200 cursor-pointer no-underline hover:bg-bg hover:-translate-y-1 hover:shadow-lg hover:border-slate-300">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5 text-2xl bg-green-50 text-green-600"><i className="fa-solid fa-users"></i></div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Clubs & Associations</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Découvrez les clubs disponibles et rejoignez une communauté qui vous ressemble.</p>
            </Link>
            <Link to="/orientation" className="bg-white rounded-2xl p-6 md:p-8 text-center border border-slate-200 transition-all duration-200 cursor-pointer no-underline hover:bg-bg hover:-translate-y-1 hover:shadow-lg hover:border-slate-300">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5 text-2xl bg-teal-50 text-teal-600"><i className="fa-solid fa-compass"></i></div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Orientation Filières</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Répondez à quelques questions et découvrez la filière qui correspond à vos aspirations.</p>
            </Link>
            <Link to="/calendrier" className="bg-white rounded-2xl p-6 md:p-8 text-center border border-slate-200 transition-all duration-200 cursor-pointer no-underline hover:bg-bg hover:-translate-y-1 hover:shadow-lg hover:border-slate-300">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5 text-2xl bg-red-50 text-red-600"><i className="fa-solid fa-calendar-alt"></i></div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Calendrier Académique</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Consultez toutes les dates importantes : examens, inscriptions, événements.</p>
            </Link>
            <Link to="/guide" className="bg-white rounded-2xl p-6 md:p-8 text-center border border-slate-200 transition-all duration-200 cursor-pointer no-underline hover:bg-bg hover:-translate-y-1 hover:shadow-lg hover:border-slate-300">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5 text-2xl bg-blue-50 text-blue-600"><i className="fa-solid fa-play-circle"></i></div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Guide du Nouvel Étudiant</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Tout ce que vous devez savoir pour reussir l'universite.</p>
            </Link>
          </div>
        </section>
        
        <section className="bg-slate-900 mx-auto my-10 md:my-15 max-w-[1200px] rounded-[30px] md:rounded-[40px] px-8 md:px-[8%] py-12 md:py-20 relative overflow-hidden text-white text-left">
          <div className="absolute -top-[100px] -right-[100px] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(58,176,255,0.1)_0%,transparent_70%)] pointer-events-none"></div>
          <span className="text-primary text-xs md:text-sm font-extrabold tracking-[2px] block mb-4 md:mb-6 uppercase">POURQUOI CAMPUSGUIDE ?</span>
          <h2 className="text-3xl md:text-5xl leading-tight mb-8 md:mb-12 max-w-[650px] font-bold">Plus qu'un portail, un <span className="text-primary">Compagnon de Route</span> numérique.</h2>
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="bg-white/5 text-primary w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 border border-white/5">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <h3 className="text-lg mb-2 font-semibold">Centralisation Avancée</h3>
              <p className="text-slate-400 text-sm md:text-[15.2px] max-w-[450px] leading-relaxed">Toutes vos ressources universitaires, du plan du campus aux mentors, réunies au même endroit.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Accueil;
