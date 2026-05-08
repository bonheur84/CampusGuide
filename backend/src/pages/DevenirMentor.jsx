import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ContexteUtilisateur } from '../contexte/ContexteUtilisateur';

const DevenirMentor = () => {
  const { ajouterNotification } = useContext(ContexteUtilisateur);
  const [photoAperçu, setPhotoAperçu] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('edit');

  const specialisationsParFiliere = {
    'informatique': ['Développement Web', 'Intelligence Artificielle', 'Réseaux & Télécoms', 'Cybersécurité', 'Data Science'],
    'medecine': ['Pédiatrie', 'Chirurgie', 'Gynécologie', 'Ophtalmologie', 'Médecine Générale'],
    'droit': ['Droit Civil', 'Droit des Affaires', 'Droit Pénal', 'Droit International'],
    'gestion': ['Marketing Digital', 'Comptabilité', 'Ressources Humaines', 'Finance'],
    'architecture': ['Architecture Moderne', 'Design d\'Intérieur', 'Urbanisme']
  };

  const [filiereSelectionnee, setFiliereSelectionnee] = useState('informatique');
  const [formData, setFormData] = useState({
    nom: '',
    filiere: 'informatique',
    annee: 'L1',
    specialite: '',
    motivation: ''
  });

  useEffect(() => {
    if (editId) {
      const mentors = JSON.parse(localStorage.getItem('campus_mentors') || '[]');
      const aModifier = mentors.find(m => m.id === parseInt(editId));
      if (aModifier) {
        setFormData({
          nom: aModifier.nom,
          filiere: aModifier.filiere,
          annee: aModifier.annee,
          specialite: aModifier.specialite,
          motivation: aModifier.motivation || aModifier.bio || ''
        });
        setFiliereSelectionnee(aModifier.filiere);
        setPhotoAperçu(aModifier.photo);
      }
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

  const soumettreFormulaire = (e) => {
    e.preventDefault();
    const mentorsExistants = JSON.parse(localStorage.getItem('campus_mentors') || '[]');
    const nom = e.target.nom.value;
    
    if (editId) {
      const index = mentorsExistants.findIndex(m => m.id === parseInt(editId));
      if (index !== -1) {
        mentorsExistants[index] = {
          ...mentorsExistants[index],
          nom: nom,
          filiere: e.target.filiere.value,
          annee: e.target.annee.value,
          specialite: e.target.specialite.value,
          motivation: e.target.motivation.value,
          bio: e.target.motivation.value,
          photo: photoAperçu
        };
        localStorage.setItem('campus_mentors', JSON.stringify(mentorsExistants));
        ajouterNotification("Profil Mentor mis à jour", `Les informations de votre compte mentor ont été actualisées.`, "success", "fa-user-gear");
        alert('Votre profil mentor a été mis à jour avec succès !');
      }
    } else {
      const nouveauMentor = {
        id: Date.now(),
        nom: nom,
        filiere: e.target.filiere.value,
        annee: e.target.annee.value,
        specialite: e.target.specialite.value,
        motivation: e.target.motivation.value,
        bio: e.target.motivation.value,
        photo: photoAperçu
      };
      mentorsExistants.push(nouveauMentor);
      localStorage.setItem('campus_mentors', JSON.stringify(mentorsExistants));
      ajouterNotification("Candidature soumise", "Votre demande pour devenir mentor a été enregistrée avec succès !", "success", "fa-graduation-cap");
      alert('Félicitations ! Votre candidature a été soumise avec succès !');
    }
    navigate('/mentors');
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
                    <option value="gestion">Gestion</option>
                    <option value="architecture">Architecture</option>
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
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[1.5px] ml-1">Biographie & Motivations</label>
                <textarea id="motivation" required rows="4" defaultValue={formData.motivation} placeholder="Parlez-nous de vous et pourquoi vous voulez aider..." className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none resize-none transition-all bg-slate-50/50"></textarea>
              </div>

              <button type="submit" className="w-full py-5 rounded-[20px] bg-primary text-white font-bold text-lg shadow-xl shadow-primary/20 hover:bg-primary-dark hover:-translate-y-1 transition-all flex items-center justify-center gap-3 mt-4">
                <span>{editId ? 'Mettre à jour mon profil' : 'Envoyer ma candidature'}</span>
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default DevenirMentor;
