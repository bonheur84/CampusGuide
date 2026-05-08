import React, { useContext, useState, useEffect } from 'react';
import { ContexteUtilisateur } from '../contexte/ContexteUtilisateur';

const Profil = () => {
  const { utilisateur, photoProfil, mettreAJourUtilisateur, mettreAJourPhoto, ajouterNotification } = useContext(ContexteUtilisateur);
  
  // États locaux pour le formulaire
  const [prenom, setPrenom] = useState(utilisateur.prenom || '');
  const [nom, setNom] = useState(utilisateur.nom || '');
  const [email, setEmail] = useState(utilisateur.email || '');

  // Synchronisation des états locaux si l'utilisateur change dans le contexte (ex: chargement initial)
  useEffect(() => {
    if (utilisateur) {
      setPrenom(utilisateur.prenom || '');
      setNom(utilisateur.nom || '');
      setEmail(utilisateur.email || '');
    }
  }, [utilisateur]);

  // Fonction pour gérer le changement de photo
  const gérerChangementPhoto = (e) => {
    const fichier = e.target.files[0];
    if (fichier) {
      const lecteur = new FileReader();
      lecteur.onload = (event) => {
        mettreAJourPhoto(event.target.result);
        ajouterNotification("Photo mise à jour", "Votre photo de profil a été changée avec succès.", "success", "fa-image");
      };
      lecteur.readAsDataURL(fichier);
    }
  };

  // Fonction pour enregistrer les modifications
  const enregistrerModifications = (e) => {
    e.preventDefault();
    const infosMisesAJour = {
      ...utilisateur,
      prenom: prenom,
      nom: nom,
      email: email
    };
    mettreAJourUtilisateur(infosMisesAJour);
    ajouterNotification("Profil mis à jour", "Vos informations personnelles ont été modifiées.", "info", "fa-user-check");
    alert('✓ Vos informations ont bien été mises à jour !');
  };

  return (
    <div className="px-4 md:px-[5%] pb-16 anime-apparition">
      <div className="max-w-[1000px] mx-auto py-10">
        <h1 className="text-3xl font-bold mb-10">Paramètres du <span className="text-primary">Profil</span></h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Carte de gauche : Photo */}
          <div className="w-full md:w-[300px] shrink-0">
            <div className="carte-etudiant flex flex-col items-center text-center">
              <div 
                className="w-32 h-32 rounded-full bg-slate-100 mb-6 flex items-center justify-center text-4xl text-slate-400 overflow-hidden border-4 border-white shadow-md"
                style={photoProfil ? { backgroundImage: `url(${photoProfil})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              >
                {!photoProfil && (prenom ? prenom[0] : 'U')}
              </div>
              
              <h2 className="font-bold text-lg mb-1">{prenom} {nom}</h2>
              <p className="text-xs text-slate-500 mb-6">{email}</p>

              <label className="bouton-secondaire cursor-pointer text-sm w-full py-2">
                Changer la photo
                <input type="file" className="hidden" accept="image/*" onChange={gérerChangementPhoto} />
              </label>
            </div>
          </div>

          {/* Formulaire à droite */}
          <div className="flex-1">
            <form onSubmit={enregistrerModifications} className="carte-etudiant space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Prénom</label>
                  <input 
                    type="text" 
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Nom</label>
                  <input 
                    type="text" 
                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Adresse Email</label>
                <input 
                  type="email" 
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="pt-4">
                <button type="submit" className="bouton-principal w-full md:w-auto px-10">
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
