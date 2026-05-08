import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ContexteUtilisateur } from '../contexte/ContexteUtilisateur';
import { apiMentors } from '../api';
const DevenirMentor = () => {
  const { ajouterNotification } = useContext(ContexteUtilisateur);
  const [photoAperçu, setPhotoAperçu] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('edit');
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);
  const specialisationsParFiliere = {
    'informatique': ['Développement Web', 'Intelligence Artificielle', 'Réseaux & Télécoms', 'Cybersécurité', 'Data Science'],
    'medecine': ['Pédiatrie', 'Chirurgie', 'Gynécologie', 'Ophtalmologie', 'Médecine Générale'],
    'droit': ['Droit Civil', 'Droit des Affaires', 'Droit Pénal', 'Droit International'],
    'science technologique': ['Génie Civil', 'Génie Électrique', 'Génie Mécanique', 'Génie Chimique', 'Génie Informatique'],
    'science des aliments et de l\'environnement': ['Technologie Alimentaire', 'Nutrition', 'Sécurité Alimentaire', 'Environnement', 'Qualité'],
    'gestion': ['Marketing Digital', 'Comptabilité', 'Ressources Humaines', 'Finance'],
    'architecture': ["Architecture Moderne", "Design d'Intérieur", "Urbanisme"],
    'SIC/multimedia': ['Design Graphique', 'Audiovisuel', 'Multimedia', 'Communication Digitale', 'Web Design']
  };
  const [filiereSelectionnee, setFiliereSelectionnee] = useState('informatique');
  const [formData, setFormData] = useState({
    nom: '',
    filiere: 'informatique',
    annee: 'L1',
    specialite: '',
    motivation: '',
    telephone: ''
  });
  // Charger les données du mentor si on est en mode édition
  useEffect(() => {
    if (editId) {
      const chargerMentor = async () => {
        try {
          const data = await apiMentors.getById(editId);
          const m = data.mentor;
          setFormData({
            nom: m.nom,
            filiere: m.filiere,
            annee: m.annee,
            specialite: m.specialite,
            motivation: m.bio || m.motivation || '',
            telephone: m.telephone || ''
          });
          setFiliereSelectionnee(m.filiere);
          setPhotoAperçu(m.photo);
        } catch (err) {
          console.error('Mentor introuvable via API, repli local.');
          // Repli localStorage si backend indisponible
          const mentors = JSON.parse(localStorage.getItem('campus_mentors') || '[]');
          const aModifier = mentors.find(m => String(m.id) === String(editId));
          if (aModifier) {
            setFormData({
              nom: aModifier.nom,
              filiere: aModifier.filiere,
              annee: aModifier.annee,
              specialite: aModifier.specialite,
              motivation: aModifier.motivation || aModifier.bio || '',
              telephone: aModifier.telephone || ''
            });
            setFiliereSelectionnee(aModifier.filiere);
            setPhotoAperçu(aModifier.photo);
          }
        }
      };
      chargerMentor();
    }
  }, [editId]);
  const gérerPhoto = (e) => {
    const fichier = e.target.files[0];
    if (fichier) {
      const lecteur = new FileReader();
      lecteur.onload = (ev) => setPhotoAperçu(ev.target.result);
      lecteur.readAsDataURL(fichier);
    }
  };
  const soumettreFormulaire = async (e) => {
    e.preventDefault();
    setChargement(true);
    setErreur(null);
    const donnees = {
      nom: e.target.nom.value,
      filiere: e.target.filiere.value,
      annee: e.target.annee.value,
      specialite: e.target.specialite.value,
      bio: e.target.motivation.value,
      photo: photoAperçu,
      telephone: e.target.telephone.value,
    };
    try {
      if (editId) {
        await apiMentors.modifier(editId, donnees);
        ajouterNotification(
          "Profil Mentor mis à jour",
          "Les informations de votre compte mentor ont été actualisées.",
          "success",
          "fa-user-gear"
        );
      } else {
        await apiMentors.creer(donnees);
        ajouterNotification(
          "Candidature soumise",
          "Votre demande pour devenir mentor a été enregistrée !",
          "success",
          "fa-graduation-cap"
        );
      }
      navigate('/mentors');
    } catch (err) {
      setErreur(err.message || 'Impossible de contacter le serveur. Vérifiez que le backend est démarré.');
    } finally {
      setChargement(false);
    }
  };
  return (
    <main className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16 anime-apparition">
      <section className="flex flex-col items-center text-center max-w-[1200px] mx-auto mb-12">
        <span className="bg-sky-100 text-primary px-4 py-2 rounded-full text-[10px] md:text-xs border border-primary font-bold tracking-wider inline-flex items-center gap-2 shadow-[0_4px_15px_rgba(58,176,255,0.1)]">
          <i className="fa-solid fa-graduation-cap"></i> REJOINDRE L'ÉQUIPE
        </span>
        <h1 className="text-4xl md:text-5xl font-bold my-6 text-slate-900 leading-tight">
          Devenir <span className="text-primary">Mentor</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-[700px] leading-relaxed">
          Partagez votre expérience, guidez vos pairs et développez vos compétences en leadership au sein de la communauté UNH.
        </p>
      </section>
      <div className="max-w-[900px] mx-auto">
        {erreur && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-sm text-red-600 font-medium">
            <i className="fa-solid fa-circle-exclamation text-red-400 shrink-0 text-lg"></i>
            {erreur}
          </div>
        )}
        <form id="become-mentor-form" onSubmit={soumettreFormulaire} className="bg-white rounded-[32px] p-8 md:p-12 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex flex-col items-center gap-6">
              <div className={`w-40 h-40 rounded-[28px] flex items-center justify-center text-slate-300 overflow-hidden border-2 border-dashed border-slate-200 transition-all ${photoAperçu ? 'border-solid border-primary ring-4 ring-primary/10' : 'bg-slate-50'}`}>
                {photoAperçu ? <img src={photoAperçu} className="w-full h-full object-cover" alt="Aperçu" /> : <i className="fa-solid fa-camera text-3xl"></i>}
              </div>
              <label className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold cursor-pointer hover:bg-slate-50 hover:border-primary hover:text-primary transition-all">
                Choisir une photo
                <input id="mentor-photo" type="file" className="hidden" accept="image/*" onChange={gérerPhoto} />
              </label>
            </div>
            <div className="flex-1 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[1.5px] ml-1">Nom complet</label>
                  <input id="nom" required type="text" defaultValue={formData.nom} placeholder="Ex: Jean Dupont" className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all bg-slate-50/50" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[1.5px] ml-1">Filière</label>
                  <select id="filiere" required value={filiereSelectionnee} onChange={(e) => setFiliereSelectionnee(e.target.value)} className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none bg-slate-50/50 appearance-none cursor-pointer">
                    <option value="informatique">Informatique</option>
                    <option value="medecine">Médecine</option>
                    <option value="droit">Droit</option>
                    <option value="science technologique">Science Technologique</option>
                    <option value="science des aliments et de l'environnement">Science des Aliments et de l'Environnement</option>
                    <option value="gestion">Gestion</option>
                    <option value="architecture">Architecture</option>
                    <option value="SIC/multimedia">SIC/Multimedia</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[1.5px] ml-1">Année d'étude</label>
                  <select id="annee" required defaultValue={formData.annee} className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none bg-slate-50/50 appearance-none cursor-pointer">
                    <option value="L1">Licence 1</option>
                    <option value="L2">Licence 2</option>
                    <option value="L3">Licence 3</option>
                    <option value="M1">Master 1</option>
                    <option value="M2">Master 2</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[1.5px] ml-1">Spécialité</label>
                  <select id="specialite" required defaultValue={formData.specialite} className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none bg-slate-50/50 appearance-none cursor-pointer">
                    {specialisationsParFiliere[filiereSelectionnee].map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[1.5px] ml-1">Numéro de téléphone</label>
                <input id="telephone" type="tel" defaultValue={formData.telephone} placeholder="Ex: +229 96 00 00 00" className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all bg-slate-50/50" />
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[1.5px] ml-1">Biographie & Motivations</label>
                <textarea id="motivation" required rows="4" defaultValue={formData.motivation} placeholder="Parlez-nous de vous et pourquoi vous voulez aider..." className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none resize-none transition-all bg-slate-50/50"></textarea>
              </div>
              <button 
                type="submit" 
                disabled={chargement}
                className="w-full py-5 rounded-[20px] bg-primary text-white font-bold text-lg shadow-xl shadow-primary/20 hover:bg-primary-dark hover:-translate-y-1 transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {chargement ? (
                  <><i className="fa-solid fa-spinner fa-spin"></i> Envoi en cours...</>
                ) : (
                  <>
                    <span>{editId ? 'Mettre à jour mon profil' : 'Envoyer ma candidature'}</span>
                    <i className="fa-solid fa-paper-plane"></i>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};
export default DevenirMentor;