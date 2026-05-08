import React from 'react';

const Guide = () => {
  const sections = [
    {
      titre: "Vie Académique",
      description: "Calendriers, examens, règlements et tout sur vos études.",
      icon: "fa-graduation-cap",
      couleur: "bg-sky-50 text-sky-600",
      conseils: [
        "Soyez assidu en cours, c'est la clé numéro un de la réussite.",
        "N'attendez pas la veille des examens pour commencer à réviser, travaillez régulièrement."
      ]
    },
    {
      titre: "Espace Numérique",
      description: "Moodle, messagerie, portail étudiant et support technique.",
      icon: "fa-laptop-code",
      couleur: "bg-red-50 text-red-600",
      conseils: [
        "Consultez vos emails universitaires tous les jours pour ne manquer aucune annonce.",
        "Sauvegardez vos travaux sur le cloud pour éviter toute perte de données."
      ]
    },
    {
      titre: "Vie au Campus",
      description: "Infrastructures, bibliothèques, cafétérias et parkings.",
      icon: "fa-building-columns",
      couleur: "bg-green-50 text-green-600",
      conseils: [
        "Allez à la bibliothèque pour vous concentrer loin des distractions.",
        "Accordez-vous des vraies pauses entre vos cours pour recharger votre énergie."
      ]
    },
    {
      titre: "Clubs & Sport",
      description: "Rejoignez un club ou une équipe sportive pour vous épanouir.",
      icon: "fa-volleyball",
      couleur: "bg-amber-50 text-amber-600",
      conseils: [
        "Rejoignez au moins un club ou une activité pour vous faire des amis hors de votre filière.",
        "Le sport aide énormément à gérer le stress pendant les périodes d'examens."
      ]
    },
    {
      titre: "Services Étudiants",
      description: "Bourses, santé, logement et orientation professionnelle.",
      icon: "fa-hand-holding-heart",
      couleur: "bg-blue-50 text-blue-600",
      conseils: [
        "N'hésitez jamais à demander de l'aide (soutien psychologique, orientation professionnelle).",
        "Anticipez ! Cherchez vos stages bien avant les dates butoirs avec les conseillers."
      ]
    },
    {
      titre: "Aide & FAQ",
      description: "Toutes les réponses aux questions les plus fréquentes.",
      icon: "fa-circle-question",
      couleur: "bg-teal-50 text-teal-600",
      conseils: [
        "L'entraide entre étudiants est le meilleur moyen de surmonter les difficultés.",
        "Si vous avez un doute, cherchez d'abord la réponse par vous-même avant de demander."
      ]
    }
  ];

  return (
    <main className="pt-[140px] px-[5%] pb-16 anime-apparition">
      <section className="flex flex-col items-center text-center max-w-[1200px] mx-auto">
        <span className="bg-sky-100 text-primary px-4 py-2 rounded-full text-xs border border-primary font-bold tracking-wider inline-flex items-center gap-2 shadow-[0_4px_15px_rgba(58,176,255,0.1)]">
          <i className="fa-solid fa-book-open-reader"></i> GUIDE ÉTUDIANT
        </span>
        <h1 className="text-4xl md:text-[66px] font-bold my-6 text-slate-900 leading-tight md:leading-none max-w-[800px]">
          Tout savoir sur <span className="text-primary">l'UNH</span>
        </h1>
        <p className="text-slate-500 text-base md:text-[17.6px] mb-8 max-w-[800px]">
          Votre guide complet pour réussir votre vie universitaire — règlements, conseils pratiques et ressources essentielles.
        </p>
      </section>

      <section className="pb-15 mb-16">
        <div className="max-w-[800px] mx-auto bg-white border border-slate-200 rounded-[20px] overflow-hidden shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]">
          <div className="py-7 px-8 text-center">
            <h2 className="text-[22px] font-extrabold text-slate-900 mt-2.5 mb-2">
              Bienvenue à l'UNH en <span className="text-primary">5 minutes</span>
            </h2>
            <p className="text-sm text-slate-500">
              Regardez cette courte vidéo pour tout comprendre sur la vie universitaire à l'Université Nouveaux Horizons.
            </p>
          </div>
          <div className="bg-slate-900 w-full aspect-video flex items-center justify-center overflow-hidden">
             <video 
                controls 
                className="w-full h-full object-cover"
                poster="https://images.unsplash.com/photo-1523050353091-c1198822d737?auto=format&fit=crop&q=80&w=1200"
              >
                <source src="/assets/cambridge.mp4" type="video/mp4" />
                Votre navigateur ne supporte pas la lecture de vidéos.
             </video>
          </div>
          <div className="flex justify-center flex-wrap gap-4 md:gap-8 py-[18px] px-6 border-t border-slate-100">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-500">
              <i className="fa-solid fa-info-circle text-primary"></i> Document officiel
            </div>
            <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-500">
              <i className="fa-solid fa-clock text-primary"></i> 5:12
            </div>
            <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-500">
              <i className="fa-solid fa-graduation-cap text-primary"></i> Nouveaux étudiants
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-primary">
            <div className={`h-[90px] flex items-center justify-center ${section.couleur}`}>
              <i className={`fa-solid ${section.icon} fa-2x`}></i>
            </div>
            <div className="p-5">
              <h3 className="text-base font-bold text-slate-900 mb-1.5">{section.titre}</h3>
              <p className="text-[13px] text-slate-500 mb-4 leading-relaxed">{section.description}</p>
              <ul className="list-none p-0 flex flex-col gap-2.5">
                {section.conseils.map((conseil, cIdx) => (
                  <li key={cIdx} className="flex items-start gap-2.5 text-[13px] text-slate-500 font-medium px-3 py-2 bg-slate-50 rounded-[10px] leading-relaxed transition-colors duration-200 hover:bg-sky-50">
                    <i className="fa-solid fa-lightbulb text-amber-500 text-sm shrink-0 mt-0.5"></i> 
                    {conseil}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Guide;
