import React, { useState } from 'react';

const Orientation = () => {
  const [etape, setEtape] = useState(0); 
  const [reponses, setReponses] = useState({});
  const [resultat, setResultat] = useState(null);
  const [voirDetails, setVoirDetails] = useState(false);

  const questions = [
    { id: 1, texte: "Qu'est-ce qui vous passionne le plus ?", options: [{ t: "La technologie et le code", v: "informatique" }, { t: "Aider et soigner les gens", v: "medecine" }, { t: "Défendre les droits des autres", v: "droit" }, { t: "Gérer une entreprise", v: "gestion" }] },
    { id: 2, texte: "Quelle est votre matière préférée ?", options: [{ t: "Mathématiques", v: "informatique" }, { t: "Biologie", v: "medecine" }, { t: "Histoire / Philo", v: "droit" }, { t: "Économie", v: "gestion" }] },
    { id: 3, texte: "Où vous voyez-vous dans 10 ans ?", options: [{ t: "Créer un logiciel", v: "informatique" }, { t: "Opérer un patient", v: "medecine" }, { t: "Plaider au tribunal", v: "droit" }, { t: "Diriger une banque", v: "gestion" }] },
    { id: 4, texte: "Comment préférez-vous travailler ?", options: [{ t: "Seul devant un ordinateur", v: "informatique" }, { t: "En équipe dans un hôpital", v: "medecine" }, { t: "En étudiant des textes de loi", v: "droit" }, { t: "En organisant des réunions", v: "gestion" }] },
    { id: 5, texte: "Quel type de problèmes aimez-vous résoudre ?", options: [{ t: "Des bugs informatiques", v: "informatique" }, { t: "Des diagnostics médicaux", v: "medecine" }, { t: "Des litiges complexes", v: "droit" }, { t: "Des défis financiers", v: "gestion" }] },
    { id: 6, texte: "Si vous deviez lire un livre, ce serait sur...", options: [{ t: "L'intelligence artificielle", v: "informatique" }, { t: "Les découvertes médicales", v: "medecine" }, { t: "Les grands procès historiques", v: "droit" }, { t: "Les secrets du succès entrepreneurial", v: "gestion" }] },
    { id: 7, texte: "Quelle activité vous semble la plus stimulante ?", options: [{ t: "Coder une application", v: "informatique" }, { t: "Réaliser une expérience en labo", v: "medecine" }, { t: "Analyser un contrat", v: "droit" }, { t: "Négocier une vente", v: "gestion" }] },
    { id: 8, texte: "Votre environnement de travail idéal est...", options: [{ t: "Un espace moderne et technologique", v: "informatique" }, { t: "Une clinique ou un laboratoire", v: "medecine" }, { t: "Un cabinet ou un tribunal", v: "droit" }, { t: "Un bureau de direction", v: "gestion" }] },
    { id: 9, texte: "Quel super-pouvoir aimeriez-vous avoir ?", options: [{ t: "Tout automatiser par la pensée", v: "informatique" }, { t: "Guérir instantanément", v: "medecine" }, { t: "Détecter les mensonges", v: "droit" }, { t: "Multiplier les investissements", v: "gestion" }] },
    { id: 10, texte: "Pour vous, le succès c'est...", options: [{ t: "Innover technologiquement", v: "informatique" }, { t: "Sauver des vies", v: "medecine" }, { t: "Faire triompher la justice", v: "droit" }, { t: "Bâtir un empire économique", v: "gestion" }] },
  ];

  const gérerRéponse = (valeur) => {
    const nouvellesReponses = { ...reponses, [etape]: valeur };
    setReponses(nouvellesReponses);

    if (etape < questions.length) {
      setEtape(etape + 1);
    } else {
      calculerResultat(nouvellesReponses);
    }
  };

  const calculerResultat = (finalReponses) => {
    const scores = { informatique: 0, medecine: 0, droit: 0, gestion: 0 };
    Object.values(finalReponses).forEach(v => scores[v]++);
    const gagnant = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    
    const infos = {
      informatique: { titre: "Informatique / Sciences", desc: "Vous êtes fait pour l'analyse logique et la résolution de problèmes. Les filières en informatique, génie logiciel ou sciences vous conviendront parfaitement à l'UNH.", details: "La Faculté des Sciences Informatiques de l'UNH propose des programmes pointus en Intelligence Artificielle, Cybersécurité et Développement. Profitez de nos laboratoires équipés et de nos partenariats avec les géants de la tech." },
      medecine: { titre: "Médecine / Sciences de la Santé", desc: "Vous avez un fort intérêt pour le bien-être des autres et les sciences. La faculté de Médecine de l'UNH est faite pour vous.", details: "Notre centre de simulation médicale et nos laboratoires de recherche vous offrent une formation pratique d'excellence dès les premières années. Devenez un professionnel de santé capable de relever les défis de demain." },
      droit: { titre: "Droit / Sciences Politiques", desc: "Vous excellez dans l'argumentation et l'analyse juridique. La faculté de Droit vous ouvrira de grandes portes au sein de l'UNH.", details: "Plongez dans l'étude des lois et des relations internationales. Nos concours de plaidoirie et nos cliniques juridiques vous préparent aux carrières d'avocat, de magistrat ou de diplomate." },
      gestion: { titre: "Gestion / Économie / Commerce", desc: "Vous avez l'esprit d'entreprise et le sens des affaires. La faculté des Sciences de Gestion est votre meilleure option à l'UNH.", details: "Formez-vous au management, au marketing digital et à la finance. Notre incubateur d'entreprises accompagne les étudiants porteurs de projets pour transformer leurs idées en succès commerciaux." },
    };

    setResultat(infos[gagnant]);
    setEtape(11);
  };

  return (
    <div className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16 anime-apparition">
      <div className="max-w-[800px] mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-4 text-slate-800">Quiz d'<span className="text-primary">Orientation</span></h1>
        <p className="text-center text-slate-500 mb-12">Découvrez la faculté qui correspond le mieux à vos aspirations.</p>

        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
          {/* Écran d'accueil */}
          {etape === 0 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-50 text-primary rounded-full flex items-center justify-center text-3xl mx-auto mb-8">
                <i className="fa-solid fa-compass"></i>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-slate-800">Prêt à commencer ?</h2>
              <p className="text-slate-500 mb-10 leading-relaxed max-w-[500px] mx-auto">Répondez sincèrement à ces quelques questions pour obtenir un résultat personnalisé.</p>
              <button onClick={() => setEtape(1)} className="px-12 py-4 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all">
                Démarrer le Quiz
              </button>
            </div>
          )}

          {/* Écran des questions */}
          {etape > 0 && etape <= questions.length && (
            <div id={`question-${etape}`}>
              <div className="flex justify-between items-center mb-10">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Question <span id="current-q-text" className="text-primary">{etape}</span> sur {questions.length}
                </div>
                <div className="flex gap-1">
                  {[...Array(questions.length)].map((_, i) => (
                    <div key={i} className={`w-6 h-1.5 rounded-full transition-all ${i + 1 <= etape ? 'bg-primary' : 'bg-slate-100'}`}></div>
                  ))}
                </div>
              </div>
              
              <h2 className="text-xl md:text-2xl font-bold mb-10 text-slate-800">{questions[etape-1].texte}</h2>
              
              <div className="grid grid-cols-1 gap-4">
                {questions[etape-1].options.map((opt, i) => (
                  <label 
                    key={i} 
                    className="flex items-center gap-4 p-5 rounded-2xl border border-slate-200 cursor-pointer hover:border-primary hover:bg-blue-50/30 transition-all group"
                  >
                    <input 
                      type="radio" 
                      name={`q${etape}`}
                      value={opt.v}
                      className="orientation-radio w-5 h-5 border-2 border-slate-300 text-primary focus:ring-primary"
                      onChange={() => gérerRéponse(opt.v)}
                    />
                    <span className="font-semibold text-slate-700 group-hover:text-primary transition-colors">{opt.t}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Résultat */}
          {etape === 11 && resultat && (
            <div id="orientation-result" className="text-center">
              {!voirDetails ? (
                <div className="anime-apparition">
                  <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-8 shadow-sm">
                    <i className="fa-solid fa-check-double"></i>
                  </div>
                  <h2 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-widest">Votre filière suggérée</h2>
                  <h3 id="result-faculty" className="text-3xl font-extrabold text-slate-900 mb-6">{resultat.titre}</h3>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-10">
                    <p id="result-desc" className="text-slate-600 leading-relaxed">{resultat.desc}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button id="restart-quiz" onClick={() => {setEtape(0); setVoirDetails(false);}} className="px-8 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all">
                      Recommencer
                    </button>
                    <button onClick={() => setVoirDetails(true)} className="px-8 py-3.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                      <i className="fa-solid fa-compass"></i> Explorer la faculté
                    </button>
                  </div>
                </div>
              ) : (
                <div className="anime-apparition text-left">
                  <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => setVoirDetails(false)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition-all">
                      <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <h3 className="text-2xl font-bold text-slate-900">{resultat.titre}</h3>
                  </div>
                  <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8">
                    <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
                      <i className="fa-solid fa-circle-info"></i> Présentation détaillée
                    </h4>
                    <p className="text-slate-700 leading-loose text-lg">
                      {resultat.details}
                    </p>
                    <div className="mt-8 pt-8 border-t border-primary/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Durée</span>
                        <span className="font-bold text-slate-800">3 à 5 ans</span>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Niveau</span>
                        <span className="font-bold text-slate-800">Licence / Master</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => {setEtape(0); setVoirDetails(false);}} className="w-full mt-8 py-4 rounded-2xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-all">
                    Terminer l'exploration
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orientation;
