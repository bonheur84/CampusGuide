import React, { useState } from 'react';

const Campus = () => {
  const [recherche, setRecherche] = useState('');
  const [salleSelectionnee, setSalleSelectionnee] = useState(null);

  const batiments = [
    {
      nom: 'UNH 1',
      icon: 'fa-building',
      salles: [
        // Rez-de-chaussée
        {
          nom: 'Salle 402 A',
          etage: 'Rez-de-chaussée',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 122,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au rez-de-chaussée de l\'UNH 1, la salle 402 A se trouve à droite de l\'entrée principale.',
          photo: '/assets/402A.jpg',
          icon: 'fa-chalkboard-user'
        },
        {
          nom: 'Salle 401 A',
          etage: 'Rez-de-chaussée',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 122,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au rez-de-chaussée de l\'UNH 1, la salle 401 A se trouve à gauche de l\'entrée principale.',
          photo: '/assets/401A.jpg',
          icon: 'fa-chalkboard-user'
        },
        {
          nom: 'Salle Justine',
          etage: 'Rez-de-chaussée',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 105,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au rez-de-chaussée de l\'UNH 1, la salle Justine est située au fond du couloir central.',
          photo: '/assets/justine.jpg',
          icon: 'fa-chalkboard-user'
        },
        {
          nom: 'Salle 402 B',
          etage: 'Rez-de-chaussée',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 122,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au rez-de-chaussée de l\'UNH 1, la salle 402 B est adjacente à la 402 A.',
          photo: '/assets/402B.jpg',
          icon: 'fa-chalkboard-user'
        },
        {
          nom: 'Salle 401 B',
          etage: 'Rez-de-chaussée',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 122,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au rez-de-chaussée de l\'UNH 1, la salle 401 B est adjacente à la 401 A.',
          photo: '/assets/401B.jpg',
          icon: 'fa-chalkboard-user'
        },
        // 1er niveau
        {
          nom: 'Salle 412 A/B',
          etage: '1er niveau',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 125,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au 1er niveau de l\'UNH 1, prenez l\'escalier principal. La salle 412 A/B est à gauche.',
          photo: '/assets/412.jpg',
          icon: 'fa-chalkboard-user'
        },
        {
          nom: 'Salle 411 A/B',
          etage: '1er niveau',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 125,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au 1er niveau de l\'UNH 1, prenez l\'escalier principal. La salle 411 A/B est à droite.',
          photo: '/assets/411.jpg',
          icon: 'fa-chalkboard-user'
        },
        {
          nom: 'Bibliothèque (Salle Mantini)',
          etage: '1er niveau',
          type: 'Bibliothèque',
          typeCouleur: 'bg-purple-50 text-purple-600',
          capacite: 200,
          description: 'Grande bibliothèque universitaire avec plus de 5 000 ouvrages spécialisés. Espace de lecture silencieux, accès Internet haut débit, prises électriques à chaque place et service d\'impression.',
          itineraire: 'Au 1er niveau de l\'UNH 1, la bibliothèque se trouve au fond du couloir central.',
          photo: '/assets/biblio.jpg',
          icon: 'fa-book'
        },
        // 2ème niveau
        {
          nom: 'Salle 422 A/B',
          etage: '2ème niveau',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 130,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au 2ème niveau de l\'UNH 1, prenez l\'escalier principal. La salle 422 A/B est à gauche.',
          photo: '/assets/422.jpg',
          icon: 'fa-chalkboard-user'
        },
        {
          nom: 'Salle 421 A/B',
          etage: '2ème niveau',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 130,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au 2ème niveau de l\'UNH 1, prenez l\'escalier principal. La salle 421 A/B est à droite.',
          photo: '/assets/421.jpg',
          icon: 'fa-chalkboard-user'
        },
        {
          nom: 'Labo informatique (Salle Mwak)',
          etage: '2ème niveau',
          type: 'Laboratoire',
          typeCouleur: 'bg-green-50 text-green-600',
          capacite: 110,
          description: 'Laboratoire informatique doté de 25 postes de travail récents sous Windows et Linux. Logiciels disponibles : suite Office, Visual Studio Code, MATLAB, SPSS, et outils de développement web.',
          itineraire: 'Au 2ème niveau de l\'UNH 1, le labo informatique se trouve au fond du couloir de droite.',
          photo: '/assets/IMG-20260513-WA0019.jpg',
          icon: 'fa-laptop-code'
        }
      ]
    },
    {
      nom: 'UNH 2',
      icon: 'fa-building',
      salles: [
        // Rez-de-chaussée
        {
          nom: 'Préau',
          etage: 'Rez-de-chaussée',
          type: 'Espace commun',
          typeCouleur: 'bg-slate-50 text-slate-600',
          capacite: 150,
          description: 'Espace couvert polyvalent utilisé pour les événements, les pauses et les activités étudiantes.',
          itineraire: 'Au rez-de-chaussée de l\'UNH 2, le préau est directement accessible depuis l\'entrée principale.',
          photo: '/assets/preau.jpg',
          icon: 'fa-umbrella'
        },
        // 1er niveau
        {
          nom: 'Salle 433',
          etage: '1er niveau',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 122,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au 1er niveau de l\'UNH 2, la salle 433 se trouve à gauche de l\'escalier.',
          photo: '/assets/433.jpg',
          icon: 'fa-chalkboard-user'
        },
        {
          nom: 'Salle 432',
          etage: '1er niveau',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 122,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au 1er niveau de l\'UNH 2, la salle 432 est adjacente à la 433.',
          photo: '/assets/432.jpg',
          icon: 'fa-chalkboard-user'
        },
        {
          nom: 'Salle 431',
          etage: '1er niveau',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 122,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au 1er niveau de l\'UNH 2, la salle 431 est à droite de l\'escalier.',
          photo: '/assets/431.jpg',
          icon: 'fa-chalkboard-user'
        },
        // 2ème niveau
        {
          nom: 'Salle 441',
          etage: '2ème niveau',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 115,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au 2ème niveau de l\'UNH 2, la salle 441 se trouve à gauche de l\'escalier.',
          photo: '/assets/441.jpg',
          icon: 'fa-chalkboard-user'
        },
        {
          nom: 'Salle 442',
          etage: '2ème niveau',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 115,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au 2ème niveau de l\'UNH 2, la salle 442 est adjacente à la 441.',
          photo: '/assets/442.jpg',
          icon: 'fa-chalkboard-user'
        },
        {
          nom: 'Salle 443 (Centre de simulation médicale)',
          etage: '2ème niveau',
          type: 'Laboratoire',
          typeCouleur: 'bg-green-50 text-green-600',
          capacite: 105,
          description: 'Centre de simulation médicale haute-fidélité équipé de mannequins simulateurs, moniteurs vitaux et matériel chirurgical pédagogique. Réservé aux étudiants en médecine sous supervision.',
          itineraire: 'Au 2ème niveau de l\'UNH 2, le centre de simulation médicale se trouve au fond du couloir de droite.',
          photo: '/assets/443.jpg',
          icon: 'fa-heart-pulse'
        }
      ]
    },
    {
      nom: 'UNH 3',
      icon: 'fa-building',
      salles: [
        // Rez-de-chaussée
        {
          nom: 'Atelier d\'architecture 2',
          etage: 'Rez-de-chaussée',
          type: 'Atelier',
          typeCouleur: 'bg-amber-50 text-amber-600',
          capacite: 110,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au rez-de-chaussée de l\'UNH 3, l\'atelier d\'architecture 2 se trouve à gauche de l\'entrée.',
          photo: '/assets/atelier-architecture-2.jpg',
          icon: 'fa-drafting-compass'
        },
        {
          nom: 'Labo microbiologie alimentaire',
          etage: 'Rez-de-chaussée',
          type: 'Laboratoire',
          typeCouleur: 'bg-green-50 text-green-600',
          capacite: 108,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au rez-de-chaussée de l\'UNH 3, le labo de microbiologie alimentaire se trouve au fond du couloir.',
          photo: '/assets/labo-micro-alimentaire.jpg',
          icon: 'fa-microscope'
        },
        {
          nom: 'Atelier génie civil',
          etage: 'Rez-de-chaussée',
          type: 'Atelier',
          typeCouleur: 'bg-amber-50 text-amber-600',
          capacite: 105,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au rez-de-chaussée de l\'UNH 3, l\'atelier génie civil se trouve à droite de l\'entrée.',
          photo: '/assets/altelier-genie-ciil.jpg',
          icon: 'fa-helmet-safety'
        },
        {
          nom: 'Labo de technologie alimentaire',
          etage: 'Rez-de-chaussée',
          type: 'Laboratoire',
          typeCouleur: 'bg-green-50 text-green-600',
          capacite: 108,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au rez-de-chaussée de l\'UNH 3, le labo de technologie alimentaire est adjacent au labo de microbiologie.',
          photo: '/assets/labo-technologie-alimentaire.jpg',
          icon: 'fa-flask'
        },
        {
          nom: 'Mini-brasserie',
          etage: 'Rez-de-chaussée',
          type: 'Laboratoire',
          typeCouleur: 'bg-green-50 text-green-600',
          capacite: 200,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au rez-de-chaussée de l\'UNH 3, la mini-brasserie se trouve dans l\'aile ouest.',
          photo: '/assets/IMG-20260513-WA0034.jpg',
          icon: 'fa-beer-mug-empty'
        },
        {
          nom: 'Labo chimie',
          etage: 'Rez-de-chaussée',
          type: 'Laboratoire',
          typeCouleur: 'bg-green-50 text-green-600',
          capacite: 105,
          description: 'Laboratoire de chimie entièrement équipé : hottes aspirantes, paillasses en céramique, réactifs classifiés et matériel de sécurité (douche d\'urgence, extincteurs). Accès en blouse et lunettes obligatoires.',
          itineraire: 'Au rez-de-chaussée de l\'UNH 3, le labo chimie se trouve dans l\'aile est.',
          photo: '/assets/labo-chimie.jpg',
          icon: 'fa-flask-vial'
        },
        {
          nom: 'Labo biochimie alimentaire',
          etage: 'Rez-de-chaussée',
          type: 'Laboratoire',
          typeCouleur: 'bg-green-50 text-green-600',
          capacite: 108,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au rez-de-chaussée de l\'UNH 3, le labo biochimie alimentaire est adjacent au labo chimie.',
          photo: '/assets/labo-biochimie-alimentaire.jpg',
          icon: 'fa-dna'
        },
        // 1er niveau
        {
          nom: 'Local 6',
          etage: '1er niveau',
          type: 'Local',
          typeCouleur: 'bg-gray-50 text-gray-600',
          capacite: 200,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au 1er niveau de l\'UNH 3, le local 6 se trouve à gauche de l\'escalier.',
          photo: '/assets/local6.jpg',
          icon: 'fa-door-closed'
        },
        {
          nom: 'Restaurant',
          etage: '1er niveau',
          type: 'Restauration',
          typeCouleur: 'bg-orange-50 text-orange-600',
          capacite: 140,
          description: 'Restaurant universitaire avec self-service, espace de repas convivial et variété de plats.',
          itineraire: 'Au 1er niveau de l\'UNH 3, le restaurant se trouve au centre du bâtiment.',
          photo: '/assets/restaurant.jpg',
          icon: 'fa-utensils'
        },
        {
          nom: 'Cuisine',
          etage: '1er niveau',
          type: 'Cuisine',
          typeCouleur: 'bg-red-50 text-red-600',
          capacite: 108,
          description: 'Cuisine professionnelle équipée pour la préparation des repas du restaurant universitaire.',
          itineraire: 'Au 1er niveau de l\'UNH 3, la cuisine est adjacente au restaurant.',
          photo: '/assets/cuisine.jpg',
          icon: 'fa-fire-burner'
        },
        {
          nom: 'Local 1',
          etage: '1er niveau',
          type: 'Local',
          typeCouleur: 'bg-gray-50 text-gray-600',
          capacite: 200,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au 1er niveau de l\'UNH 3, le local 1 se trouve à droite de l\'escalier.',
          photo: '/assets/local1.jpg',
          icon: 'fa-door-closed'
        },
        // 2ème niveau
        {
          nom: 'Local 2',
          etage: '2ème niveau',
          type: 'Local',
          typeCouleur: 'bg-gray-50 text-gray-600',
          capacite: 200,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au 2ème niveau de l\'UNH 3, le local 2 se trouve à gauche de l\'escalier.',
          photo: '/assets/local2.jpg',
          icon: 'fa-door-closed'
        },
        {
          nom: 'Local 3',
          etage: '2ème niveau',
          type: 'Local',
          typeCouleur: 'bg-gray-50 text-gray-600',
          capacite: 200,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au 2ème niveau de l\'UNH 3, le local 3 est adjacent au local 2.',
          photo: '/assets/local3.jpg',
          icon: 'fa-door-closed'
        },
        {
          nom: 'Local 4',
          etage: '2ème niveau',
          type: 'Local',
          typeCouleur: 'bg-gray-50 text-gray-600',
          capacite: 200,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au 2ème niveau de l\'UNH 3, le local 4 se trouve au centre du couloir.',
          photo: '/assets/local4.jpg',
          icon: 'fa-door-closed'
        },
        {
          nom: 'Local 5',
          etage: '2ème niveau',
          type: 'Local',
          typeCouleur: 'bg-gray-50 text-gray-600',
          capacite: 200,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au 2ème niveau de l\'UNH 3, le local 5 se trouve à droite de l\'escalier.',
          photo: '/assets/local5.jpg',
          icon: 'fa-door-closed'
        },
        {
          nom: 'Labo de génie électrique',
          etage: '2ème niveau',
          type: 'Laboratoire',
          typeCouleur: 'bg-green-50 text-green-600',
          capacite: 105,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au 2ème niveau de l\'UNH 3, le labo de génie électrique se trouve au fond du couloir.',
          photo: '/assets/labo-genie-electrique.jpg',
          icon: 'fa-bolt'
        }
      ]
    },
    {
      nom: 'UNH 4',
      icon: 'fa-building',
      salles: [
        // Rez-de-chaussée
        {
          nom: 'UNH 4-A',
          etage: 'Rez-de-chaussée',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 130,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au rez-de-chaussée de l\'UNH 4, la salle UNH 4-A se trouve à gauche de l\'entrée.',
          photo: '/assets/unh-a.jpg',
          icon: 'fa-chalkboard-user'
        },
        // 1er niveau
        {
          nom: 'UNH 4-C',
          etage: '1er niveau',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 130,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au 1er niveau de l\'UNH 4, la salle UNH 4-C se trouve à gauche de l\'escalier.',
          photo: '/assets/unh-c.jpg',
          icon: 'fa-chalkboard-user'
        },
        // 2ème niveau
        {
          nom: 'UNH 4-B',
          etage: '2ème niveau',
          type: 'Salle',
          typeCouleur: 'bg-blue-50 text-primary',
          capacite: 130,
          description: 'Grande salle de cours polyvalente équipée d\'un projecteur HD, d\'un tableau interactif. Idéale pour les cours et les travaux de groupe.',
          itineraire: 'Au 2ème niveau de l\'UNH 4, la salle UNH 4-B se trouve à droite de l\'escalier.',
          photo: '/assets/IMG-20260513-WA0050.jpg',
          icon: 'fa-chalkboard-user'
        },
        {
          nom: 'Amphithéâtre',
          etage: '2ème niveau',
          type: 'Amphi',
          typeCouleur: 'bg-red-50 text-red-600',
          capacite: 180,
          description: 'Amphithéâtre principal du campus avec capacité de 180 places, système de projection 4K et sonorisation Dolby. Utilisé pour les cours magistraux, conférences et événements officiels.',
          itineraire: 'Au 2ème niveau de l\'UNH 4, l\'amphithéâtre se trouve au fond du couloir central.',
          photo: '/assets/amphi.jpg',
          icon: 'fa-users-line'
        }
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-3000" onClick={() => setSalleSelectionnee(null)}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl w-[95%] max-w-[600px] z-4000 overflow-hidden shadow-2xl anime-apparition border border-gray-100">
            {/* Header avec image et overlay moderne */}
            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
              <img
                src={salleSelectionnee.photo}
                alt={salleSelectionnee.nom}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                onError={(e) => { e.target.src = '/assets/402A.jpg'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              {/* Bouton de fermeture moderne */}
              <button
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 w-10 h-10 rounded-xl cursor-pointer text-white flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110"
                onClick={() => setSalleSelectionnee(null)}
              >
                <i className="fa-solid fa-times text-lg"></i>
              </button>
              
              {/* Informations superposées */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">{salleSelectionnee.nom}</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${salleSelectionnee.typeCouleur} bg-white/90 backdrop-blur-sm`}>
                        {salleSelectionnee.type}
                      </span>
                      <span className="text-xs text-white/90 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <i className="fa-solid fa-layer-group"></i> {salleSelectionnee.etage}
                      </span>
                      {salleSelectionnee.capacite && (
                        <span className="text-xs text-white/90 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <i className="fa-solid fa-users"></i> {salleSelectionnee.capacite} places
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                    <i className="fa-solid fa-door-open text-xl text-white"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenu principal avec sections modernes */}
            <div className="p-6 space-y-6">
              {/* Section Description avec design moderne */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-5 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <i className="fa-solid fa-circle-info text-primary text-lg"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Description</h4>
                    <p className="text-xs text-gray-500">Caractéristiques de l'espace</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {salleSelectionnee.description || 'Aucune description disponible pour cet espace.'}
                </p>
              </div>

              {/* Section Itinéraire avec design moderne */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <i className="fa-solid fa-route text-white text-lg"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Itinéraire</h4>
                    <p className="text-xs text-gray-500">Comment s'y rendre</p>
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-blue-200/50">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {salleSelectionnee.itineraire || `Prenez l'escalier ou l'ascenseur vers le ${salleSelectionnee.etage}. La salle se trouve dans l'aile correspondante du bâtiment.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Campus;