class AIService {
  constructor() {
    this.cleHistoriqueBase = 'campus_ai_historique';
    this.reponsesPreprogrammees = {
      'université': {
        keywords: ['université', 'unh', 'nouveaux horizons', 'école', 'campus', 'établissement'],
        reponse: 'L\'Université Nouveaux Horizons (UNH) est une institution d\'enseignement supérieur de qualité. Elle propose plus de 50 filières, compte 5000+ étudiants et 200+ professeurs. Notre mission est de former des leaders compétents et éthiques grâce à l\'innovation pédagogique.'
      },
      'mentorat': {
        keywords: ['mentor', 'mentorat', 'accompagnement', 'tuteur', 'aide', 'conseil'],
        reponse: 'Le système de mentorat de CampusGuide vous permet de vous faire accompagner par des étudiants plus expérimentés. Vous pouvez filtrer les mentors par filière et spécialité, puis les contacter directement via WhatsApp. Pour devenir mentor, rendez-vous sur la page "Devenir Mentor".'
      },
      'clubs': {
        keywords: ['club', 'association', 'activité', 'extra-scolaire', 'loisir', 'passion'],
        reponse: 'CampusGuide propose divers clubs : Académique, Sport, Art & Culture, et Tech. Rejoignez celui qui correspond à vos passions ! Cliquez sur "Rejoindre sur WhatsApp" pour intégrer la communauté. Les clubs sont notés par les étudiants.'
      },
      'événements': {
        keywords: ['événement', 'calendrier', 'date', 'inscription', 'activité', 'conférence'],
        reponse: 'Consultez le calendrier académique pour voir tous les événements à venir : conférences, réunions, examens, congés. Vous pouvez vous inscrire aux événements directement depuis la page Calendrier. Les admins peuvent créer de nouveaux événements.'
      },
      'inscription': {
        keywords: ['inscription', 's\'inscrire', 'rejoindre', 'participer', 'devenir membre'],
        reponse: 'Pour vous inscrire à un événement, allez sur la page Calendrier et cliquez sur "S\'inscrire" sur l\'événement souhaité. Pour rejoindre un club, cliquez sur "Rejoindre sur WhatsApp" sur la carte du club. Pour devenir mentor, utilisez le formulaire sur la page dédiée.'
      },
      'contact': {
        keywords: ['contact', 'téléphone', 'email', 'adresse', 'joindre', 'appeler'],
        reponse: 'Contactez l\'Université Nouveaux Horizons :\n📞 Téléphone : +221 33 123 45 67\n📧 Email : contact@universite-nouveaux-horizons.edu\n📍 Adresse : Campus Principal, 123 Avenue de l\'Université\n🕐 Horaires : Lun - Ven, 8h00 - 18h00'
      },
      'filières': {
        keywords: ['filière', 'formation', 'études', 'licence', 'master', 'diplôme', 'informatique', 'médecine', 'droit', 'gestion', 'architecture'],
        reponse: 'L\'UNH propose plus de 50 filières dont : Informatique, Médecine, Droit, Gestion, Architecture, Sciences Technologiques, Sciences des Aliments et de l\'Environnement, SIC/Multimédia. Utilisez la page Orientation pour découvrir la filière qui vous correspond !'
      },
      'aide': {
        keywords: ['aide', 'help', 'assistance', 'problème', 'difficulté', 'question'],
        reponse: 'Je suis là pour vous aider ! Posez-moi vos questions sur :\n• L\'université et ses filières\n• Le système de mentorat\n• Les clubs et associations\n• Les événements et le calendrier\n• Les inscriptions\n• Les contacts\nComment puis-je vous aider ?'
      },
      'bonjour': {
        keywords: ['bonjour', 'salut', 'hello', 'hey', 'bonsoir', 'coucou'],
        reponse: 'Bonjour ! 👋 Je suis l\'assistant virtuel de CampusGuide. Comment puis-je vous aider aujourd\'hui ? N\'hésitez pas à me poser des questions sur l\'université, les mentors, les clubs, ou tout autre sujet !'
      },
      'merci': {
        keywords: ['merci', 'thanks', 'remercie', 'super', 'génial', 'parfait'],
        reponse: 'Je vous en prie ! 😊 N\'hésitez pas si vous avez d\'autres questions. Je suis là pour vous aider !'
      }
    };
  }

  // Obtenir la clé de stockage spécifique à l'utilisateur
  getCleHistorique() {
    const userId = localStorage.getItem('campus_user_id');
    return userId ? `${this.cleHistoriqueBase}_${userId}` : this.cleHistoriqueBase;
  }

  // Analyser la question et retourner la réponse la plus pertinente
  analyserQuestion(question) {
    const questionLower = question.toLowerCase();
    let meilleureReponse = null;
    let meilleurScore = 0;

    for (const [categorie, data] of Object.entries(this.reponsesPreprogrammees)) {
      let score = 0;
      for (const keyword of data.keywords) {
        if (questionLower.includes(keyword)) {
          score++;
        }
      }
      if (score > meilleurScore) {
        meilleurScore = score;
        meilleureReponse = data.reponse;
      }
    }

    if (meilleureReponse) {
      return meilleureReponse;
    }

    return "Je n'ai pas bien compris votre question. Pouvez-vous la reformuler ? Je peux vous aider sur : l'université, le mentorat, les clubs, les événements, les inscriptions, ou les contacts. Essayez de mots-clés comme 'mentor', 'club', 'calendrier', etc.";
  }

  // Sauvegarder l'historique dans localStorage
  sauvegarderHistorique(historique) {
    const cle = this.getCleHistorique();
    localStorage.setItem(cle, JSON.stringify(historique));
  }

  // Charger l'historique depuis localStorage
  chargerHistorique() {
    const cle = this.getCleHistorique();
    const historique = localStorage.getItem(cle);
    return historique ? JSON.parse(historique) : [];
  }

  // Effacer l'historique
  effacerHistorique() {
    const cle = this.getCleHistorique();
    localStorage.removeItem(cle);
  }

  // Ajouter un message à l'historique
  ajouterMessage(contenu, estUtilisateur = true) {
    const historique = this.chargerHistorique();
    const nouveauMessage = {
      id: Date.now(),
      contenu,
      estUtilisateur,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    historique.push(nouveauMessage);
    // Garder seulement les 50 derniers messages
    if (historique.length > 50) {
      historique.shift();
    }
    this.sauvegarderHistorique(historique);
    return nouveauMessage;
  }

  // Obtenir une réponse complète (avec historique pour contexte)
  obtenirReponse(question, historique = []) {
    const reponse = this.analyserQuestion(question);
    this.ajouterMessage(question, true);
    this.ajouterMessage(reponse, false);
    return reponse;
  }
}

export default new AIService();