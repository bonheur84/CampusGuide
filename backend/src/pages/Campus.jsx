import React, { useState } from 'react';

const Campus = () => {
  const [recherche, setRecherche] = useState('');
  const [salleSelectionnee, setSalleSelectionnee] = useState(null);

  const batiments = [
    {
      nom: "Batiment Principal (UNH 1)",
      icon: "fa-building",
      salles: [
        { nom: "Salle 412/B", etage: "2eme etage", type: "Salle", typeCouleur: "bg-blue-50 text-primary", desc: "Salle de cours équipée de projecteur et tableau interactif", capacite: 30, image: "salle.jpg" },
        { nom: "Salle 411/B", etage: "2eme etage", type: "Salle", typeCouleur: "bg-blue-50 text-primary" },
        { nom: "Salle 421 A/B", etage: "3er étage", type: "Salle", typeCouleur: "bg-blue-50 text-primary" },
        { nom: "Salle 422 A/B", etage: "3er étage", type: "Salle", typeCouleur: "bg-blue-50 text-primary" },
        { nom: "Salle 402/A", etage: "1er étage", type: "Salle", typeCouleur: "bg-blue-50 text-primary" },
        { nom: "Salle 401/A", etage: "1er étage", type: "Salle", typeCouleur: "bg-blue-50 text-primary" },
        { nom: "Bureau du Doyen", etage: "dernier étage", type: "Bureau", typeCouleur: "bg-orange-50 text-orange-600", desc: "Bureau administratif du Doyen, accès sur rendez-vous", capacite: 10, image: "bureau.jpg" },
        { nom: "Bibliothèque", etage: "2eme etage", type: "Bibliothèque", typeCouleur: "bg-purple-50 text-purple-600", desc: "Espace de lecture silencieuse avec accès à internet et prises électriques", capacite: 100, image: "bibliotheque.jpg" },
        { nom: "Salle 421", etage: "3er étage", type: "Salle", typeCouleur: "bg-blue-50 text-primary" },
        { nom: "Labo Informatique", etage: "1er étage", type: "Laboratoire", typeCouleur: "bg-green-50 text-green-600", desc: "Laboratoire équipé de 25 ordinateurs avec logiciels de développement et bureautique", capacite: 25, image: "labo-info.jpg" },
        { nom: "Salle justine", etage: "1er étage", type: "Salle", typeCouleur: "bg-blue-50 text-primary" },
        { nom: "Bureau d'administraction", etage: "1er étage", type: "Bureau", typeCouleur: "bg-orange-50 text-orange-600" },
        { nom: "Hall", etage: "1er etage", type: "Salle", typeCouleur: "bg-blue-50 text-primary" }
      ]
    },
    {
      nom: "Bâtiment 2 (UNH 1)",
      icon: "fa-building",
      salles: [
        { nom: "Salle 431", etage: "2eme etage", type: "Salle", typeCouleur: "bg-blue-50 text-primary" },
        { nom: "Salle 432", etage: "2eme etage", type: "Salle", typeCouleur: "bg-blue-50 text-primary" },
        { nom: "Salle 432", etage: "2eme etage", type: "Salle", typeCouleur: "bg-blue-50 text-primary" },
        { nom: "Salle 433", etage: "2eme etage", type: "Salle", typeCouleur: "bg-blue-50 text-primary" },
        { nom: "Salle 443(Centre de simulation medicale)", etage: "3eme etage", type: "Salle", typeCouleur: "bg-blue-50 text-primary" },
        { nom: "Salle 442", etage: "3eme etage", type: "Salle", typeCouleur: "bg-blue-50 text-primary" },
        { nom: "Salle 441", etage: "3eme etage", type: "Salle", typeCouleur: "bg-blue-50 text-primary" }
      ]
    },
    {
      nom: "Batiment 3 (UNH 2)",
      icon: "fa-building",
      salles: [
        { nom: "Labo Chimie", etage: "RDC", type: "Laboratoire", typeCouleur: "bg-green-50 text-green-600" },
        { nom: "Amphithéâtre", etage: "RDC", type: "Amphi", typeCouleur: "bg-red-50 text-red-600" },
        { nom: "Salle de Conférence", etage: "2ème étage", type: "Salle", typeCouleur: "bg-blue-50 text-primary" }
      ]
    },
    {
      nom: "Batiment 4 (UNH 3)",
      icon: "fa-building",
      salles: [
        { nom: "Labo Chimie", etage: "RDC", type: "Laboratoire", typeCouleur: "bg-green-50 text-green-600" },
        { nom: "Amphithéâtre", etage: "RDC", type: "Amphi", typeCouleur: "bg-red-50 text-red-600" },
        { nom: "Salle de Conférence", etage: "2ème étage", type: "Salle", typeCouleur: "bg-blue-50 text-primary" }
      ]
    }
  ];

  const filtrerSalles = (salles) => {
    return salles.filter(salle => 
      salle.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      salle.etage.toLowerCase().includes(recherche.toLowerCase()) ||
      salle.type.toLowerCase().includes(recherche.toLowerCase())
    );
  };

  return (
    <main className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16 anime-apparition">
      <section className="flex flex-col items-center text-center max-w-[1200px] mx-auto">
        <span className="bg-sky-100 text-primary px-4 py-2 rounded-full text-[10px] md:text-xs border border-primary font-bold tracking-wider inline-flex items-center gap-2 shadow-[0_4px_15px_rgba(58,176,255,0.1)]">
          <i className="fa-solid fa-map-marked-alt"></i> PLAN DU CAMPUS
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-[66px] font-bold my-6 text-slate-900 leading-tight md:leading-none max-w-[800px]">
          Explorez le <span className="text-primary">Campus</span>
        </h1>
        <p className="text-slate-500 text-base md:text-[17.6px] mb-8 max-w-[800px]">
          Localisez facilement les bâtiments, salles de cours et services de l'Université Nouveaux Horizons.
        </p>
      </section>

      <section className="max-w-[1000px] mx-auto pb-20 px-4">
        <div className="bg-white w-full max-w-[500px] px-5 py-3 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-center gap-3 border border-slate-200 mx-auto mb-10">
          <i className="fa-solid fa-search text-slate-400 text-base"></i>
          <input 
            type="text" 
            placeholder="Rechercher une salle, bureau..." 
            className="flex-1 border-none outline-none text-[15px] text-slate-800 font-inter bg-transparent"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
        </div>

        <div id="liste-batiments">
          {batiments.map((batiment, idx) => {
            const sallesFiltrees = filtrerSalles(batiment.salles);
            if (sallesFiltrees.length === 0) return null;

            return (
              <div key={idx} className="mb-10">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2.5">
                  <i className={`fa-solid ${batiment.icon} text-primary`}></i> 
                  {batiment.nom} 
                  <span className="text-[13px] font-medium text-slate-400">{batiment.salles.length} salles</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sallesFiltrees.map((salle, sIdx) => (
                    <div 
                      key={sIdx} 
                      className="bg-white rounded-xl border border-slate-200 px-4 py-3.5 flex justify-between items-center cursor-pointer transition-all duration-200 hover:border-primary hover:shadow-[0_4px_10px_rgba(58,176,255,0.15)] hover:-translate-y-0.5"
                      onClick={() => setSalleSelectionnee(salle)}
                    >
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-location-dot text-primary text-base"></i>
                        <div>
                          <strong className="block text-sm text-slate-900 font-semibold">{salle.nom}</strong>
                          <span className="text-xs text-slate-400">{salle.etage}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${salle.typeCouleur}`}>
                          {salle.type}
                        </span>
                        <i className="fa-solid fa-chevron-right text-xs text-slate-300"></i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modal de salle */}
      {salleSelectionnee && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 z-3000" onClick={() => setSalleSelectionnee(null)}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[20px] w-[90%] max-w-[500px] z-4000 overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.2)] anime-apparition">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg text-slate-900 font-bold">Détails de la salle</h2>
              <button 
                className="bg-slate-100 border-none w-8 h-8 rounded-lg cursor-pointer text-sm text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-all duration-200"
                onClick={() => setSalleSelectionnee(null)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <div className="p-6">
              <div className="bg-slate-100 rounded-xl h-56 mb-6 flex items-center justify-center text-slate-400 overflow-hidden shadow-inner">
                <img 
                  src="/assets/universite-nouveaux-horizons.jpg" 
                  alt={salleSelectionnee.nom} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex flex-col gap-3 text-center">
                <h3 className="text-2xl font-bold text-slate-900">{salleSelectionnee.nom}</h3>
                <div className="flex flex-wrap justify-center gap-3 mt-1">
                  <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-2">
                    <i className="fa-solid fa-layer-group"></i> {salleSelectionnee.etage}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2 ${salleSelectionnee.typeCouleur}`}>
                    <i className="fa-solid fa-tag"></i> {salleSelectionnee.type}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-2">
                    <i className="fa-solid fa-users"></i> {salleSelectionnee.capacite || "30+"} pers.
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed px-4">{salleSelectionnee.desc || "Aucune description disponible pour le moment."}</p>
              </div>
              <div className="mt-6 bg-sky-50 rounded-xl p-4">
                <p className="text-sm mb-1 font-bold text-primary flex items-center gap-2">
                  <i className="fa-solid fa-route"></i> Itinéraire
                </p>
                <p className="text-[13px] text-slate-600">
                  Prenez l'escalier ou l'ascenseur vers le {salleSelectionnee.etage}. La salle se trouve dans l'aile correspondante du bâtiment.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Campus;
