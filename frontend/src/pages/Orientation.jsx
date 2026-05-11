import React, { useState } from 'react';
const Orientation = () => {
  const [etape, setEtape] = useState(0); 
  const [reponses, setReponses] = useState({});
  const [resultat, setResultat] = useState(null);
  const [voirDetails, setVoirDetails] = useState(false);
  const [selectionTemporaire, setSelectionTemporaire] = useState({});
  const questions = [
    { id: 1, texte: "Qu'est-ce qui vous passionne le plus ?", options: [{ t: "La technologie et le code", v: "informatique" }, { t: "Aider et soigner les gens", v: "medecine" }, { t: "Défendre les droits des autres", v: "droit" }, { t: "Concevoir des systèmes", v: "science technologique" }, { t: "Innover dans l'alimentation", v: "science des aliments et de l'environnement" }, { t: "Gérer une entreprise", v: "gestion" }, { t: "Créer des contenus multimédia", v: "SIC/multimedia" }] },
    { id: 2, texte: "Quelle est votre matière préférée ?", options: [{ t: "Mathématiques", v: "informatique" }, { t: "Biologie", v: "medecine" }, { t: "Histoire / Philo", v: "droit" }, { t: "Physique et Chimie", v: "science technologique" }, { t: "Chimie alimentaire", v: "science des aliments et de l'environnement" }, { t: "Économie", v: "gestion" }, { t: "Communication visuelle", v: "SIC/multimedia" }] },
    { id: 3, texte: "Où vous voyez-vous dans 10 ans ?", options: [{ t: "Créer un logiciel", v: "informatique" }, { t: "Opérer un patient", v: "medecine" }, { t: "Plaider au tribunal", v: "droit" }, { t: "Concevoir un pont", v: "science technologique" }, { t: "Travailler en laboratoire alimentaire", v: "science des aliments et de l'environnement" }, { t: "Diriger une banque", v: "gestion" }, { t: "Produire des films", v: "SIC/multimedia" }] },
    { id: 4, texte: "Comment préférez-vous travailler ?", options: [{ t: "Seul devant un ordinateur", v: "informatique" }, { t: "En équipe dans un hôpital", v: "medecine" }, { t: "En étudiant des textes de loi", v: "droit" }, { t: "En équipe sur un chantier", v: "science technologique" }, { t: "En cuisine industrielle", v: "science des aliments et de l'environnement" }, { t: "En organisant des réunions", v: "gestion" }, { t: "En studio de création", v: "SIC/multimedia" }] },
    { id: 5, texte: "Quel type de problèmes aimez-vous résoudre ?", options: [{ t: "Des bugs informatiques", v: "informatique" }, { t: "Des diagnostics médicaux", v: "medecine" }, { t: "Des litiges complexes", v: "droit" }, { t: "Des défis d'ingénierie", v: "science technologique" }, { t: "Problèmes de qualité alimentaire", v: "science des aliments et de l'environnement" }, { t: "Des défis financiers", v: "gestion" }, { t: "Problèmes techniques audio/vidéo", v: "SIC/multimedia" }] },
    { id: 6, texte: "Si vous deviez lire un livre, ce serait sur...", options: [{ t: "L'intelligence artificielle", v: "informatique" }, { t: "Les découvertes médicales", v: "medecine" }, { t: "Les grands procès historiques", v: "droit" }, { t: "Les innovations technologiques", v: "science technologique" }, { t: "Les secrets de l'alimentation", v: "science des aliments et de l'environnement" }, { t: "Les secrets du succès entrepreneurial", v: "gestion" }, { t: "L'histoire du cinéma", v: "SIC/multimedia" }] },
    { id: 7, texte: "Quelle activité vous semble la plus stimulante ?", options: [{ t: "Coder une application", v: "informatique" }, { t: "Réaliser une expérience en labo", v: "medecine" }, { t: "Analyser un contrat", v: "droit" }, { t: "Construire une machine", v: "science technologique" }, { t: "Inventer une recette", v: "science des aliments et de l'environnement" }, { t: "Négocier une vente", v: "gestion" }, { t: "Monter un clip vidéo", v: "SIC/multimedia" }] },
    { id: 8, texte: "Votre environnement de travail idéal est...", options: [{ t: "Un espace moderne et technologique", v: "informatique" }, { t: "Une clinique ou un laboratoire", v: "medecine" }, { t: "Un cabinet ou un tribunal", v: "droit" }, { t: "Un laboratoire d'ingénierie", v: "science technologique" }, { t: "Une cuisine industrielle", v: "science des aliments et de l'environnement" }, { t: "Un bureau de direction", v: "gestion" }, { t: "Un plateau de tournage", v: "SIC/multimedia" }] },
    { id: 9, texte: "Quel super-pouvoir aimeriez-vous avoir ?", options: [{ t: "Tout automatiser par la pensée", v: "informatique" }, { t: "Guérir instantanément", v: "medecine" }, { t: "Détecter les mensonges", v: "droit" }, { t: "Créer des matériaux révolutionnaires", v: "science technologique" }, { t: "Éradiquer la faim", v: "science des aliments et de l'environnement" }, { t: "Multiplier les investissements", v: "gestion" }, { t: "Contrôler les esprits", v: "SIC/multimedia" }] },
    { id: 10, texte: "Pour vous, le succès c'est...", options: [{ t: "Innover technologiquement", v: "informatique" }, { t: "Sauver des vies", v: "medecine" }, { t: "Faire triompher la justice", v: "droit" }, { t: "Transformer le monde par l'ingénierie", v: "science technologique" }, { t: "Nourrir la planète", v: "science des aliments et de l'environnement" }, { t: "Bâtir un empire économique", v: "gestion" }, { t: "Devenir un influenceur multimédia", v: "SIC/multimedia" }] },
  ];
  const gérerRéponse = (valeur) => {
    const nouvellesReponses = { ...reponses, [etape]: valeur };
    setReponses(nouvellesReponses);
    setSelectionTemporaire({ ...selectionTemporaire, [etape]: valeur });
  };
  const confirmerEtPasser = () => {
    const nouvellesReponses = { ...reponses, [etape]: selectionTemporaire[etape] };
    setReponses(nouvellesReponses);
    if (etape < questions.length) {
      setEtape(etape + 1);
    } else {
      calculerResultat(nouvellesReponses);
    }
  };
  const calculerResultat = (finalReponses) => {
    const scores = { 
      informatique: 0, 
      medecine: 0, 
      droit: 0, 
      science_technologique: 0,
      science_aliments_environnement: 0,
      gestion: 0,
      sic_multimedia: 0
    };
    Object.values(finalReponses).forEach(v => {
      if (v === 'science technologique') scores.science_technologique++;
      else if (v === 'science des aliments et de l\'environnement') scores.science_aliments_environnement++;
      else if (v === 'SIC/multimedia') scores.sic_multimedia++;
      else scores[v]++;
    });
    const gagnant = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    const infos = {
      informatique: { titre: "Informatique / Sciences", desc: "Vous êtes fait pour l'analyse logique et la résolution de problèmes. Les filières en informatique, génie logiciel ou sciences vous conviendront parfaitement à l'UNH.", details: "La Faculté des Sciences Informatiques de l'UNH propose des programmes pointus en Intelligence Artificielle, Cybersécurité et Développement. Profitez de nos laboratoires équipés et de nos partenariats avec les géants de la tech." },
      medecine: { titre: "Médecine / Sciences de la Santé", desc: "Vous avez un fort intérêt pour le bien-être des autres et les Sciences. La faculté de Médecine de l'UNH est faite pour vous.", details: "Notre centre de simulation médicale et nos laboratoires de recherche vous offrent une formation pratique d'excellence dès les premières années. Devenez un professionnel de santé capable de relever les défis de demain." },
      droit: { titre: "Droit / Sciences Politiques", desc: "Vous excellez dans l'argumentation et l'analyse juridique. La faculté de Droit vous ouvrira de grandes portes au sein de l'UNH.", details: "Plongez dans l'étude des lois et des relations internationales. Nos concours de plaidoirie et nos cliniques juridiques vous préparent aux carrières d'avocat, de magistrat ou de diplomate." },
      science_technologique: { titre: "Science Technologique / Ingénierie", desc: "Vous êtes passionné par l'innovation technique et la création de solutions concrètes. La Science Technologique est faite pour vous.", details: "La Faculté des Sciences Technologiques de l'UNH vous offre des programmes en génie civil, électrique, mécanique, chimique et bien d'autres. Nos ateliers et laboratoires vous permettent de transformer vos idées en réalisations concrètes." },
      science_aliments_environnement: { titre: "Science des Aliments et de l'Environnement", desc: "Vous vous souciez de la durabilité et de l'innovation dans le domaine alimentaire. Cette filière est parfaite pour vous.", details: "La Faculté des Sciences des Aliments et de l'Environnement de l'UNH forme des experts capables de relever les défis alimentaires et environnementaux. Nos laboratoires de pointe et nos partenariats industriels vous préparent à des carrières d'avenir." },
      gestion: { titre: "Gestion / Économie / Commerce", desc: "Vous avez l'esprit d'entreprise et le sens des affaires. La faculté des Sciences de Gestion est votre meilleure option à l'UNH.", details: "Formez-vous au management, au marketing digital et à la finance. Notre incubateur d'entreprises accompagne les étudiants porteurs de projets pour transformer leurs idées en succès commerciaux." },
      sic_multimedia: { titre: "SIC / Multimédia", desc: "Vous êtes créatif et passionné par les médias numériques. Le SIC/Multimédia est votre voie.", details: "La Section d'Information et de Communication de l'UNH vous forme aux métiers de demain : design graphique, audiovisuel, production multimédia et communication digitale. Nos studios et équipements professionnels vous permettent de développer votre talent créatif." }
    };
    setResultat(infos[gagnant]);
    setEtape(11);
  };
  return (
    <main className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16 anime-apparition">
      <section className="flex flex-col items-center text-center max-w-[1200px] mx-auto mb-12">
        <span className="bg-sky-100 text-primary px-4 py-2 rounded-full text-[10px] md:text-xs border border-primary font-bold tracking-wider inline-flex items-center gap-2 shadow-[0_4px_15px_rgba(58,176,255,0.1)]">
          <i className="fa-solid fa-map-marked-alt"></i> TEST D'ORIENTATION
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-[66px] font-bold my-6 text-slate-900 leading-tight md:leading-none max-w-[900px]">
          Découvrez votre <span className="text-primary">Parcours</span>
        </h1>
        <p className="text-slate-500 text-lg md:text-[22px] mb-8 max-w-[800px] leading-relaxed">
          Un quiz personnalisé pour vous guider vers la filière qui correspond à vos aspirations et talents.
        </p>
      </section>
      <div className="max-w-[900px] mx-auto">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full blur-3xl opacity-30 -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-sky-50 to-blue-50 rounded-full blur-2xl opacity-20 translate-y-24 -translate-x-24"></div>
          {etape === 0 && (
            <div className="text-center relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl flex items-center justify-center text-4xl mx-auto mb-8 shadow-2xl shadow-blue-500/25">
                <i className="fa-solid fa-compass"></i>
              </div>
              <h2 className="text-3xl font-bold mb-6 text-slate-900">Prêt à commencer votre aventure ?</h2>
              <p className="text-slate-600 mb-12 leading-relaxed max-w-[600px] mx-auto text-lg">
                Répondez sincèrement à ces questions pour découvrir la filière qui illuminera votre avenir académique et professionnel.
              </p>
              <button 
                onClick={() => setEtape(1)} 
                className="px-12 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex items-center gap-3 mx-auto"
              >
                <span>Démarrer le Quiz</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          )}
          {etape > 0 && etape <= questions.length && (
            <div id={`question-${etape}`} className="relative z-10">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                    <span className="text-blue-700 font-bold text-lg">{etape}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question</p>
                    <p className="text-sm font-semibold text-slate-600">sur {questions.length}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[...Array(questions.length)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-8 h-2 rounded-full transition-all duration-500 ${i + 1 <= etape ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25' : 'bg-slate-100'}`}
                    ></div>
                  ))}
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-12 text-slate-900 leading-tight">{questions[etape-1].texte}</h2>
              <div className="grid grid-cols-1 gap-4">
                {questions[etape-1].options.map((opt, i) => (
                  <label 
                    key={i} 
                    className="flex items-center gap-4 p-5 rounded-2xl border-2 border-slate-200 cursor-pointer hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <input 
                        type="radio" 
                        name={`q${etape}`}
                        value={opt.v}
                        checked={selectionTemporaire[etape] === opt.v}
                        className="w-5 h-5 border-2 border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                        onChange={() => gérerRéponse(opt.v)}
                      />
                    </div>
                    <span className="font-semibold text-slate-700 group-hover:text-blue-700 transition-colors relative z-10 text-lg">{opt.t}</span>
                    <div className="ml-auto relative z-10">
                      <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                        selectionTemporaire[etape] === opt.v 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-slate-300 group-hover:border-blue-400'
                      }`}>
                        {selectionTemporaire[etape] === opt.v && (
                          <div className="w-full h-full flex items-center justify-center">
                            <i className="fa-solid fa-check text-white text-xs"></i>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {selectionTemporaire[etape] && (
                <div className="mt-8 text-center">
                  <button 
                    onClick={confirmerEtPasser}
                    className="px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 mx-auto"
                  >
                    <i className="fa-solid fa-check"></i>
                    <span>Confirmer et continuer</span>
                    <i className="fa-solid fa-arrow-right text-sm"></i>
                  </button>
                </div>
              )}
            </div>
          )}
          {etape === 11 && resultat && (
            <div id="orientation-result" className="text-center relative z-10">
              {!voirDetails ? (
                <div className="anime-apparition">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center text-4xl mx-auto mb-8 shadow-2xl shadow-green-500/25">
                    <i className="fa-solid fa-trophy"></i>
                  </div>
                  <h2 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Votre filière idéale</h2>
                  <h3 id="result-faculty" className="text-4xl font-extrabold text-slate-900 mb-8 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{resultat.titre}</h3>
                  <div className="p-8 bg-gradient-to-br from-slate-50 to-gray-50 rounded-3xl border border-slate-200 mb-12 shadow-lg">
                    <p id="result-desc" className="text-slate-700 leading-relaxed text-lg">{resultat.desc}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <button 
                      id="restart-quiz" 
                      onClick={() => {setEtape(0); setVoirDetails(false);}} 
                      className="px-8 py-4 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all duration-300 flex items-center gap-3"
                    >
                      <i className="fa-solid fa-redo"></i>
                      <span>Recommencer</span>
                    </button>
                    <button 
                      onClick={() => setVoirDetails(true)} 
                      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex items-center gap-3"
                    >
                      <i className="fa-solid fa-compass"></i>
                      <span>Explorer la faculté</span>
                      <i className="fa-solid fa-arrow-right text-sm"></i>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="anime-apparition text-left">
                  <div className="flex items-center gap-4 mb-10">
                    <button 
                      onClick={() => setVoirDetails(false)} 
                      className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-gray-100 flex items-center justify-center text-slate-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white transition-all duration-300 shadow-lg"
                    >
                      <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <div>
                      <h3 className="text-3xl font-bold text-slate-900">{resultat.titre}</h3>
                      <p className="text-slate-500 mt-1">Découvrez cette filière en détail</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 border border-blue-200 rounded-3xl p-8 shadow-xl">
                    <h4 className="font-bold text-blue-700 mb-6 flex items-center gap-3 text-lg">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                        <i className="fa-solid fa-circle-info text-white"></i>
                      </div>
                      Présentation détaillée
                    </h4>
                    <p className="text-slate-700 leading-loose text-lg mb-8">
                      {resultat.details}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                          <i className="fa-solid fa-clock text-white text-lg"></i>
                        </div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Durée</span>
                        <span className="font-bold text-slate-800 text-lg">3 à 5 ans</span>
                      </div>
                      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                          <i className="fa-solid fa-graduation-cap text-white text-lg"></i>
                        </div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Niveau</span>
                        <span className="font-bold text-slate-800 text-lg">Licence / Master</span>
                      </div>
                      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                          <i className="fa-solid fa-briefcase text-white text-lg"></i>
                        </div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Débouchés</span>
                        <span className="font-bold text-slate-800 text-lg">Excellent</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {setEtape(0); setVoirDetails(false);}} 
                    className="w-full mt-10 py-4 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <i className="fa-solid fa-home"></i>
                    <span>Retour à l'accueil</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
export default Orientation;