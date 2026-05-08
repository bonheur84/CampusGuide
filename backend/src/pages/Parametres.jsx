import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Parametres = () => {
  const [listeCandidatures, setListeCandidatures] = useState([]);

  useEffect(() => {
    const stock = localStorage.getItem('campus_mentors');
    if (stock) {
      const mentors = JSON.parse(stock);
      // On filtre pour ne garder que les mentors ajoutés par l'utilisateur (on exclut les IDs 1, 2, 3 qui sont des faux mentors par défaut si besoin)
      // Mais ici le user veut voir "tous les comptes que l'étudiant va postuler"
      // On affiche tout ce qui est dans le localStorage
      setListeCandidatures(mentors);
    }
  }, []);

  const supprimerCandidature = (id) => {
    if (window.confirm('Voulez-vous vraiment retirer cette candidature de mentor ?')) {
      const nouvelleListe = listeCandidatures.filter(m => m.id !== id);
      localStorage.setItem('campus_mentors', JSON.stringify(nouvelleListe));
      setListeCandidatures(nouvelleListe);
      alert('La candidature a été retirée.');
    }
  };

  return (
    <main className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16 anime-apparition">
      <section className="flex flex-col items-center text-center max-w-[1200px] mx-auto mb-10">
        <span className="bg-sky-100 text-primary px-4 py-2 rounded-full text-[10px] md:text-xs border border-primary font-bold tracking-wider inline-flex items-center gap-2 shadow-[0_4px_15px_rgba(58,176,255,0.1)]">
          <i className="fa-solid fa-cog"></i> PARAMÈTRES
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-[66px] font-bold my-6 text-slate-900 leading-tight md:leading-none max-w-[800px]">
          Mes <span className="text-primary">Candidatures</span>
        </h1>
        <p className="text-slate-500 text-lg md:text-[22px] max-w-[800px]">
          Gérez vos différents profils de mentorat et suivez vos demandes.
        </p>
      </section>

      <section className="max-w-[800px] mx-auto pb-20 flex flex-col gap-8 px-4">
        
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3 ml-2">
            <i className="fa-solid fa-chalkboard-user text-primary"></i> 
            Vos profils Mentor ({listeCandidatures.length})
          </h3>

          {listeCandidatures.length > 0 ? (
            <div className="grid gap-4">
              {listeCandidatures.map((candidat) => (
                <div key={candidat.id} className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-all">
                  <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center font-bold text-slate-300 text-xl shrink-0">
                      {candidat.photo ? <img src={candidat.photo} alt="Mentor" className="w-full h-full object-cover" /> : candidat.nom[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{candidat.nom}</h4>
                      <p className="text-xs text-slate-500 uppercase font-black tracking-widest mt-0.5">{candidat.filiere} • {candidat.annee}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-primary border border-blue-100">{candidat.specialite}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-50 text-green-700 border border-green-100">Candidature active</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 w-full md:w-auto">
                    <Link to={`/devenir-mentor?edit=${candidat.id}`} className="flex-1 md:flex-none px-5 py-2.5 bg-slate-100 text-slate-700 no-underline rounded-xl font-bold hover:bg-slate-200 transition-all text-xs flex items-center justify-center gap-2">
                      <i className="fa-solid fa-pen"></i> Modifier
                    </Link>
                    <button 
                      onClick={() => supprimerCandidature(candidat.id)}
                      className="flex-1 md:flex-none px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all border border-red-100 text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <i className="fa-solid fa-trash"></i> Retirer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[30px] p-12 text-center">
              <i className="fa-solid fa-folder-open text-4xl text-slate-300 mb-4 block"></i>
              <p className="text-slate-500 font-medium">Vous n'avez pas encore postulé pour être mentor.</p>
              <Link to="/devenir-mentor" className="inline-block mt-6 px-8 py-3 bg-primary text-white no-underline rounded-2xl font-bold shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all">
                Postuler maintenant
              </Link>
            </div>
          )}
        </div>

        <div className="mt-8 p-6 bg-linear-to-br from-slate-900 to-slate-800 rounded-[30px] text-white flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="text-center md:text-left">
              <h4 className="font-bold text-lg mb-1">Besoin d'aide ?</h4>
              <p className="text-slate-400 text-sm">Consultez notre guide ou contactez le support.</p>
           </div>
           <Link to="/guide" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white no-underline rounded-xl font-bold text-sm transition-all border border-white/10">
              Voir le Guide Étudiant
           </Link>
        </div>

      </section>
    </main>
  );
};

export default Parametres;
