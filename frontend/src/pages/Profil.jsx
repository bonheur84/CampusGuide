import React, { useState, useContext, useEffect } from 'react';
import { ContexteUtilisateur } from '../contexte/ContexteUtilisateur';
import { apiUtilisateurs } from '../api';

const Profil = () => {
  const { utilisateur, photoProfil, mettreAJourUtilisateur, mettreAJourPhoto, ajouterNotification } = useContext(ContexteUtilisateur);

  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [erreurMdp, setErreurMdp] = useState(null);
  const [photoAperçu, setPhotoAperçu] = useState(null);

  const [nom, setNom] = useState('');
  const [filiere, setFiliere] = useState('');
  const [promotion, setPromotion] = useState('');

  const [mdpData, setMdpData] = useState({
    ancien: '',
    nouveau: '',
    confirmation: ''
  });

  const getDefaultPhoto = (userId) => {
    const photoOptions = [
      'https://picsum.photos/seed/user1/200/200.jpg',
      'https://picsum.photos/seed/user2/200/200.jpg',
      'https://picsum.photos/seed/user3/200/200.jpg',
      'https://picsum.photos/seed/user4/200/200.jpg',
      'https://picsum.photos/seed/user5/200/200.jpg',
      'https://picsum.photos/seed/user6/200/200.jpg',
      'https://picsum.photos/seed/user7/200/200.jpg',
      'https://picsum.photos/seed/user8/200/200.jpg',
      'https://picsum.photos/seed/user9/200/200.jpg',
      'https://picsum.photos/seed/user10/200/200.jpg'
    ];
    const hash = userId ? userId.split('').reduce((a, b) => a + b.charCodeAt(0), 0) : 0;
    const photoIndex = Math.abs(hash) % photoOptions.length;
    return photoOptions[photoIndex];
  };

  useEffect(() => {
    if (utilisateur && utilisateur.id) {
      setNom(utilisateur.nom || '');
      setFiliere(utilisateur.filiere || 'informatique');
      setPromotion(utilisateur.promotion || 'L1');
      setPhotoAperçu(photoProfil || utilisateur.avatar || getDefaultPhoto(utilisateur.id));
    }
  }, [utilisateur, photoProfil]);

  const compresserImage = (base64Original) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 400;
        let { width, height } = img;
        if (width > height) {
          if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
        } else {
          if (height > MAX) { width = Math.round(width * MAX / height); height = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width  = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = base64Original;
    });
  };

  const gérerPhoto = (e) => {
    const fichier = e.target.files[0];
    if (!fichier) return;

    const lecteur = new FileReader();
    lecteur.onload = async (ev) => {
      const photoCompressée = await compresserImage(ev.target.result);
      setPhotoAperçu(photoCompressée);
      mettreAJourPhoto(photoCompressée);
      try {
        const res = await apiUtilisateurs.modifier(utilisateur.id, {
          nom: utilisateur.nom,
          filiere: utilisateur.filiere,
          promotion: utilisateur.promotion,
          avatar: photoCompressée
        });
        mettreAJourUtilisateur(res.utilisateur);
      } catch (err) {
        console.error('Erreur sauvegarde photo:', err);
      }
    };
    lecteur.readAsDataURL(fichier);
  };

  const gérerChangementMdp = async (e) => {
    e.preventDefault();
    if (mdpData.nouveau !== mdpData.confirmation) {
      setErreurMdp('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    try {
      setChargement(true);
      setErreurMdp(null);
      await apiUtilisateurs.modifierMotDePasse(utilisateur.id, mdpData.ancien, mdpData.nouveau);
      ajouterNotification('Mot de passe modifié', 'Votre mot de passe a été mis à jour avec succès.', 'success', 'fa-lock');
      setMdpData({ ancien: '', nouveau: '', confirmation: '' });
    } catch (err) {
      setErreurMdp(err.message);
    } finally {
      setChargement(false);
    }
  };

  const modifierInfos = async (e) => {
    e.preventDefault();
    try {
      setChargement(true);
      setErreur(null);
      const res = await apiUtilisateurs.modifier(utilisateur.id, {
        nom,
        filiere,
        promotion,
        avatar: photoAperçu
      });
      mettreAJourUtilisateur(res.utilisateur);
      if (photoAperçu) mettreAJourPhoto(photoAperçu);
      ajouterNotification('Profil mis à jour', 'Vos informations personnelles ont été enregistrées.', 'success', 'fa-user-check');
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  };

  if (!utilisateur || !utilisateur.id) {
    return (
      <div className="pt-40 text-center">
        <p className="text-slate-500">Veuillez vous connecter pour accéder à votre profil.</p>
      </div>
    );
  }

  return (
    <main className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16 anime-apparition">
      <section className="max-w-[1000px] mx-auto">
        <div className="flex flex-col md:flex-row gap-8">

          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <i className="fa-solid fa-user-circle text-primary"></i> Informations Personnelles
              </h2>

              <form onSubmit={modifierInfos} className="space-y-5">
                <div className="flex flex-col items-center gap-4 mb-8">
                  <div className="w-32 h-32 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center text-slate-300 relative group transition-all hover:border-primary">
                    {photoAperçu ? (
                      <img src={photoAperçu} className="w-full h-full object-cover" alt="Avatar" />
                    ) : (
                      <i className="fa-solid fa-user text-4xl"></i>
                    )}
                    <label className="absolute inset-0 bg-black/40 text-white text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all">
                      CHANGER PHOTO
                      <input type="file" className="hidden" accept="image/*" onChange={gérerPhoto} />
                    </label>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Photo de profil</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom complet</label>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="w-full p-4 rounded-2xl border border-slate-200 focus:border-primary outline-none bg-slate-50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email (Non modifiable)</label>
                  <input disabled type="email" value={utilisateur.email} className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Filière</label>
                    <select value={filiere} onChange={(e) => setFiliere(e.target.value)} className="w-full p-4 rounded-2xl border border-slate-200 focus:border-primary outline-none bg-slate-50">
                      <option value="informatique">Informatique</option>
                      <option value="medecine">Médecine</option>
                      <option value="droit">Droit</option>
                      <option value="gestion">Gestion</option>
                      <option value="architecture">Architecture</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Promotion</label>
                    <select value={promotion} onChange={(e) => setPromotion(e.target.value)} className="w-full p-4 rounded-2xl border border-slate-200 focus:border-primary outline-none bg-slate-50">
                      <option value="L1">Licence 1</option>
                      <option value="L2">Licence 2</option>
                      <option value="L3">Licence 3</option>
                      <option value="M1">Master 1</option>
                      <option value="M2">Master 2</option>
                    </select>
                  </div>
                </div>

                {erreur && <p className="text-red-500 text-xs font-bold mt-2">{erreur}</p>}
                <button disabled={chargement} type="submit" className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-primary transition-all mt-4 disabled:opacity-50">
                  {chargement ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
};

export default Profil;
