import React, { useState } from 'react';

const Campus = () => {
  const [recherche, setRecherche] = useState('');
  const [salleSelectionnee, setSalleSelectionnee] = useState(null);

  const batiments = [
    {
      nom: 'Batiment Principal (UNH 1)',
      icon: 'fa-building',
      salles: [
        {
          nom: 'Salle 412/B',
          etage: '2ème étage',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 30,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif et de 30 places assises. Idéale pour les cours magistraux et les travaux de groupe.',
          itineraire: 'Entrez par l\'accueil principal, prenez l\'escalier central jusqu\'au 2ème étage. Tournez à droite dans le couloir B, la salle 412 se trouve au fond à gauche.',
          photo: '/assets/auditoire (3).jpg'
        },
        {
          nom: 'Salle 411/B',
          etage: '2ème étage',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 25,
          description: 'Salle de cours standard avec tableau blanc et vidéoprojecteur. Lumière naturelle abondante grâce à ses grandes fenêtres donnant sur la cour intérieure.',
          itineraire: 'Entrez par l\'accueil principal, prenez l\'escalier central jusqu\'au 2ème étage. Tournez à droite dans le couloir B, la salle 411 est en face de la salle 412.',
          photo: '/assets/auditoire (2).jpg'
        },
        {
          nom: 'Salle 421 A/B',
          etage: '3ème étage',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 40,
          description: 'Salle modulable en deux espaces (A et B) grâce à une cloison amovible. Idéale pour les séances de TD en petits groupes ou les examens.',
          itineraire: 'Montez jusqu\'au 3ème étage par l\'escalier ou l\'ascenseur. Au niveau de l\'aile A/B, la salle 421 est la première à gauche en sortant de l\'ascenseur.',
          photo: '/assets/auditoire (3).jpg'
        },
        {
          nom: 'Salle 422 A/B',
          etage: '3ème étage',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 40,
          description: 'Salle jumelle de la 421 A/B. Équipée de mobilier modulable pour faciliter le travail en équipe. Connexion Wi-Fi haut débit disponible.',
          itineraire: 'Montez jusqu\'au 3ème étage. La salle 422 se trouve juste à côté de la 421, dans le même couloir à gauche.',
          photo: '/assets/auditoire (3).jpg'
        },
        {
          nom: 'Salle 402/A',
          etage: '1er étage',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 28,
          description: 'Salle de cours du premier étage, aile A. Équipée d\'un écran de projection et d\'un système audio pour les présentations et soutennances.',
          itineraire: 'Depuis l\'accueil, montez d\'un étage par l\'escalier principal. Tournez à gauche dans le couloir A. La salle 402 est la deuxième porte sur votre droite.',
          photo: '/assets/auditoire (3).jpg'
        },
        {
          nom: 'Salle 401/A',
          etage: '1er étage',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 28,
          description: 'Première salle du couloir A au 1er étage. Vue panoramique sur l\'entrée du campus. Très appréciée pour les TD de petits groupes.',
          itineraire: 'Depuis l\'accueil, montez d\'un étage. Tournez à gauche dans le couloir A. La salle 401 est la première porte sur votre droite, juste après les toilettes.',
          photo: '/assets/auditoire (2).jpg'
        },
        {
          nom: 'Bureau du recteur',
          etage: 'Dernier étage',
          type: 'Bureau',
          typeCouleur: 'bg-orange-50 text-orange-600',
          capacite: 10,
          description: 'Bureau administratif du Doyen de l\'université. Accès sur rendez-vous uniquement. Espace chaleureux et solennel, utilisé pour les réunions importantes et les réceptions officielles.',
          itineraire: 'Prenez l\'ascenseur principal jusqu\'au dernier étage. Traversez le hall vitré, le bureau du Doyen est la grande porte en bois au fond du couloir central.',
          photo: '/assets/auditoire (5).jpg'
        },
        {
          nom: 'Bibliothèque',
          etage: '2ème étage',
          type: 'Bibliothèque',
          typeCouleur: 'bg-purple-50 text-purple-600',
          capacite: 100,
          description: 'Grande bibliothèque universitaire avec plus de 5 000 ouvrages spécialisés. Espace de lecture silencieux, accès Internet haut débit, prises électriques à chaque place et service d\'impression.',
          itineraire: 'Montez au 2ème étage par l\'escalier ou l\'ascenseur. La bibliothèque est signalée par un panneau violet. Grande double porte vitrée visible depuis le palier.',
          photo: '/assets/biblio.jpg'
        },
        {
          nom: 'Salle 421',
          etage: '3ème étage',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 35,
          description: 'Salle de cours standard au 3ème étage. Entièrement rénovée en 2023 avec du nouveau mobilier ergonomique et un tableau blanc interactif dernière génération.',
          itineraire: 'Montez au 3ème étage. Le couloir principal mène directement à la salle 421, identifiable par son numéro en rouge sur la porte.',
          photo: '/assets/auditoire (2).jpg'
        },
        {
          nom: 'Labo Informatique',
          etage: '1er étage',
          type: 'Laboratoire',
          typeCouleur: 'bg-green-50 text-green-600',
          capacite: 25,
          description: 'Laboratoire informatique doté de 25 postes de travail récents sous Windows et Linux. Logiciels disponibles : suite Office, Visual Studio Code, MATLAB, SPSS, et outils de développement web.',
          itineraire: 'Depuis l\'accueil, prenez le couloir de droite au 1er étage. Le Labo Informatique est signalé par une porte verte avec un logo ordinateur. Accès par badge étudiant.',
          photo: '/assets/auditoire (8).jpg'
        },
        {
          nom: 'Salle Justine',
          etage: '1er étage',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 20,
          description: 'Salle polyvalente baptisée « Justine » en hommage à une ancienne étudiante méritante. Utilisée pour les ateliers créatifs, séminaires et réunions de clubs étudiants.',
          itineraire: 'Depuis l\'entrée, suivez les panneaux au 1er étage en direction de l\'aile gauche. La salle Justine est reconnaissable à la plaque commémorative dorée sur la porte.',
          photo: '/assets/auditoire (4).jpg'
        },
        {
          nom: "Bureau d'Administration",
          etage: '1er étage',
          type: 'Bureau',
          typeCouleur: 'bg-orange-50 text-orange-600',
          capacite: 8,
          description: 'Bureau administratif principal de l\'université. Gestion des inscriptions, paiements, attestations et délivrance des documents officiels. Ouvert du lundi au vendredi de 8h à 16h.',
          itineraire: 'Depuis l\'entrée principale, le Bureau d\'Administration est la première grande pièce à droite au 1er étage. Signalé par un panneau orange « Administration ».',
          photo: '/assets/auditoire (5).jpg'
        },
        {
          nom: 'Hall',
          etage: 'Rez-de-chaussée',
          type: 'Espace commun',
          typeCouleur: 'bg-slate-50 text-slate-600',
          capacite: 200,
          description: 'Grand hall d\'entrée du bâtiment principal. Point de rencontre central avec un panneau d\'affichage des cours, distributeurs automatiques et espace d\'attente confortable.',
          itineraire: 'Le hall est directement accessible depuis l\'entrée principale du bâtiment. Impossible de le manquer dès l\'entrée.',
          photo: '/assets/auditoire (6).jpg'
        }
      ]
    },
    {
      nom: 'Bâtiment 2 (UNH 1)',
      icon: 'fa-building',
      salles: [
        {
          nom: 'Salle 431',
          etage: '2ème étage',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 32,
          description: 'Salle de cours du bâtiment 2, aile 4. Équipée d\'un vidéoprojecteur et d\'un système de climatisation. Utilisée principalement pour les cours de médecine et sciences.',
          itineraire: 'Entrez dans le bâtiment 2 par l\'entrée latérale. Montez au 2ème étage. La salle 431 est la première porte à gauche dans le couloir 4.',
          photo: '/assets/auditoire (3).jpg'
        },
        {
          nom: 'Salle 432',
          etage: '2ème étage',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 32,
          description: 'Salle adjacente à la 431. Utilisée alternativement pour les travaux dirigés. Dispose d\'une connexion réseau câblée pour les expériences nécessitant une haute stabilité.',
          itineraire: 'Même accès que la salle 431. La salle 432 est juste à côté, deuxième porte à gauche dans le couloir 4.',
          photo: '/assets/auditoire (2).jpg'
        },
        {
          nom: 'Salle 433',
          etage: '2ème étage',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 30,
          description: 'Salle de cours légèrement plus petite, idéale pour les groupes de TD et les examens oraux. Vue sur la cour intérieure du bâtiment 2.',
          itineraire: 'Depuis le couloir 4 au 2ème étage du bâtiment 2, la salle 433 est la troisième porte à gauche après l\'escalier.',
          photo: '/assets/auditoire (2).jpg'
        },
        {
          nom: 'Salle 443 — Centre de Simulation Médicale',
          etage: '3ème étage',
          type: 'Laboratoire',
          typeCouleur: 'bg-green-50 text-green-600',
          capacite: 20,
          description: 'Centre de simulation médicale haute-fidélité équipé de mannequins simulateurs, moniteurs vitaux et matériel chirurgical pédagogique. Réservé aux étudiants en médecine sous supervision.',
          itineraire: 'Montez au 3ème étage du bâtiment 2. La salle 443 est au bout du couloir médical, identifiable par la porte sécurisée bleue et le panneau « Simulation ».',
          photo: '/assets/auditoire (2).jpg'
        },
        {
          nom: 'Salle 442',
          etage: '3ème étage',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 28,
          description: 'Salle de cours du 3ème étage utilisée pour les séminaires de recherche et les présentations de mémoires. Équipée d\'un système audio-visuel complet.',
          itineraire: 'Montez au 3ème étage du bâtiment 2 par l\'escalier de secours ou l\'ascenseur. La salle 442 est à mi-chemin dans le couloir principal, côté fenêtre.',
          photo: '/assets/auditoire (2).jpg'
        },
        {
          nom: 'Salle 441',
          etage: '3ème étage',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 28,
          description: 'Salle de cours standard au 3ème étage. Bien éclairée naturellement, dispose d\'un tableau blanc magnétique et de supports pour présenter des affiches scientifiques.',
          itineraire: 'Au 3ème étage du bâtiment 2, la salle 441 est la première porte du couloir, juste en face de l\'escalier.',
          photo: '/assets/auditoire (2).jpg'
        }
      ]
    },
    {
      nom: 'Batiment 3 (UNH 2)',
      icon: 'fa-building',
      salles: [
        {
          nom: 'Labo Chimie',
          etage: 'Rez-de-chaussée',
          type: 'Laboratoire',
          typeCouleur: 'bg-green-50 text-green-600',
          capacite: 20,
          description: 'Laboratoire de chimie entièrement équipé : hottes aspirantes, paillasses en céramique, réactifs classifiés et matériel de sécurité (douche d\'urgence, extincteurs). Accès en blouse et lunettes obligatoires.',
          itineraire: 'Le Labo Chimie est situé au rez-de-chaussée du bâtiment 3 (UNH 2). Entrez par l\'accès latéral réservé aux laboratoires, signalé par un panneau « Danger – Produits chimiques ».',
          photo: '/assets/auditoire (7).jpg'
        },
        {
          nom: 'Salle de Conférence',
          etage: '2ème étage',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 60,
          description: 'Salle de conférence professionnelle avec table ovale centrale, système de visioconférence intégré et écran panoramique. Idéale pour les réunions internationales et les soutenances de thèse.',
          itineraire: 'Montez au 2ème étage du bâtiment 3 par l\'ascenseur vitré. La salle de conférence est au bout du couloir principal, identifiable par ses grandes portes vitrées.',
          photo: '/assets/auditoire.jpg'
        }
      ]
    },
    {
      nom: 'Batiment 4 (UNH 3)',
      icon: 'fa-building',
      salles: [
        {
          nom: 'Amphithéâtre',
          etage: 'Rez-de-chaussée',
          type: 'Amphi',
          typeCouleur: 'bg-red-50 text-red-600',
          capacite: 180,
          description: 'Amphithéâtre secondaire du campus, plus intime que celui du bâtiment 3. Capacité de 180 places avec système de projection 4K et sonorisation Dolby. Utilisé pour les cours en amphi des filières science et droit.',
          itineraire: 'Depuis l\'entrée du bâtiment 4, descendez le hall d\'entrée jusqu\'au fond. L\'amphithéâtre est signalé par un panneau rouge et des portes insonorisées à double battant.',
          photo: '/assets/auditoire (2).jpg'
        },
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

      {salleSelectionnee && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 z-3000" onClick={() => setSalleSelectionnee(null)}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[20px] w-[90%] max-w-[520px] z-4000 overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.2)] anime-apparition">
            <div className="relative h-52 overflow-hidden bg-slate-100">
              <img
                src={salleSelectionnee.photo}
                alt={salleSelectionnee.nom}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://picsum.photos/seed/campus/600/300'; }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
              <button
                className="absolute top-3 right-3 bg-white/90 border-none w-8 h-8 rounded-lg cursor-pointer text-sm text-slate-600 flex items-center justify-center hover:bg-white transition-all duration-200 shadow-md"
                onClick={() => setSalleSelectionnee(null)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
              <div className="absolute bottom-4 left-5 text-white">
                <h3 className="text-xl font-bold drop-shadow">{salleSelectionnee.nom}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${salleSelectionnee.typeCouleur}`}>
                    {salleSelectionnee.type}
                  </span>
                  <span className="text-[11px] text-white/80 flex items-center gap-1">
                    <i className="fa-solid fa-layer-group text-[10px]"></i> {salleSelectionnee.etage}
                  </span>
                  {salleSelectionnee.capacite && (
                    <span className="text-[11px] text-white/80 flex items-center gap-1">
                      <i className="fa-solid fa-users text-[10px]"></i> {salleSelectionnee.capacite} places
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-circle-info text-primary"></i> Description
                </p>
                <p className="text-[13.5px] text-slate-600 leading-relaxed">
                  {salleSelectionnee.description || 'Aucune description disponible pour cet espace.'}
                </p>
              </div>

              <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
                <p className="text-xs font-black text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                  <i className="fa-solid fa-route"></i> Itinéraire
                </p>
                <p className="text-[13px] text-slate-600 leading-relaxed">
                  {salleSelectionnee.itineraire || `Prenez l'escalier ou l'ascenseur vers le ${salleSelectionnee.etage}. La salle se trouve dans l'aile correspondante du bâtiment.`}
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