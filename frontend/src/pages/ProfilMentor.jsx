// =============================================
//  Page de profil pour les mentors
// =============================================
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContexteUtilisateur } from '../contexte/ContexteUtilisateur';
import { apiMentors } from '../api';
import ratingService from '../services/RatingService';
const ProfilMentor = () => {
  const { utilisateur } = useContext(ContexteUtilisateur);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: '',
    filiere: '',
    annee: '',
    specialite: '',
    bio: '',
    telephone: ''
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [succes, setSucces] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [mentorId, setMentorId] = useState(null);
  const [ratingStats, setRatingStats] = useState({ moyenne: 0, totalVotes: 0 });
  // Charger les informations du mentor connecté
  useEffect(() => {
    const chargerProfil = async () => {
      try {
        setChargement(true);
        const data = await apiMentors.getMesProfils();
        if (data.success && data.mentors.length > 0) {
          const mentor = data.mentors[0];
          setMentorId(mentor.id);
          setFormData({
            nom: mentor.nom || '',
            filiere: mentor.filiere || '',
            annee: mentor.annee || '',
            specialite: mentor.specialite || '',
            bio: mentor.bio || '',
            telephone: mentor.telephone || ''
          });
          if (mentor.photo) {
            setPhotoPreview(mentor.photo);
          }
          // Charger les statistiques de rating
          const stats = await ratingService.getStatistiques('mentor', mentor.id);
          setRatingStats(stats);
        }
      } catch (err) {
        setErreur('Erreur lors du chargement du profil');
      } finally {
        setChargement(false);
      }
    };
    if (utilisateur.role === 'mentor') {
      chargerProfil();
    }
  }, [utilisateur]);
  const gererChangementPhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const gererSoumission = async (e) => {
    e.preventDefault();
    setChargement(true);
    setErreur(null);
    try {
      const formDataToSend = new FormData();
      // Ajouter tous les champs du formulaire
      Object.keys(formData).forEach(key => {
        if (key !== 'photo' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });
      // Ajouter la photo si elle existe
      if (photo) {
        formDataToSend.append('photo', photo);
      }
      const response = await fetch('/api/mentors/profil', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('campus_token')}`
        },
        body: formDataToSend
      });
      const result = await response.json();
      if (result.success) {
        setSucces(true);
        setTimeout(() => {
          setSucces(false);
        }, 3000);
      } else {
        setErreur(result.erreur || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setErreur('Erreur serveur');
    } finally {
      setChargement(false);
    }
  };
  // Si l'utilisateur n'est pas un mentor, rediriger vers la page d'accueil
  if (utilisateur.role !== 'mentor') {
    return (
      <div className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16 text-center">
        <div className="max-w-[600px] mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-exclamation-triangle text-red-500 text-3xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Accès Restreint</h2>
            <p className="text-slate-600 mb-6">
              Cette page est réservée aux mentors uniquement.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-600 transition-all"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <main className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16 anime-apparition">
      <div className="max-w-[800px] mx-auto">
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            <i className="fas fa-user-edit text-primary mr-3"></i>
            Mon Profil Mentor
          </h1>
          <p className="text-slate-600">
            Gérez vos informations et votre numéro WhatsApp pour que les étudiants puissent vous contacter facilement.
          </p>
        </div>

        {/* Rating Statistics */}
        {mentorId && (
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              <i className="fas fa-star text-amber-500 mr-2"></i>
              Mes Évaluations
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-amber-500 mb-1">{ratingStats.moyenne}/5</div>
                <div className="text-sm text-slate-600">Note moyenne</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-primary mb-1">{ratingStats.nombreVotes}</div>
                <div className="text-sm text-slate-600">Évaluation{ratingStats.nombreVotes > 1 ? 's' : ''}</div>
              </div>
            </div>
          </div>
        )}
        {succes && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl mb-6">
            <div className="flex items-center gap-3">
              <i className="fas fa-check-circle text-green-600"></i>
              <span className="font-medium">Profil mis à jour avec succès !</span>
            </div>
          </div>
        )}
        {erreur && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl mb-6">
            <div className="flex items-center gap-3">
              <i className="fas fa-exclamation-circle text-red-600"></i>
              <span className="font-medium">{erreur}</span>
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <form onSubmit={gererSoumission} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Photo de profil
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {photoPreview ? (
                        <img 
                          src={photoPreview} 
                          alt="Photo de profil" 
                          className="w-24 h-24 rounded-full object-cover border-4 border-slate-200"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-slate-200 border-4 border-slate-200 flex items-center justify-center">
                          <i className="fas fa-user text-slate-400 text-2xl"></i>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={gererChangementPhoto}
                        className="absolute inset-0 w-24 h-24 opacity-0 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-500">
                        Cliquez sur la photo pour la modifier
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Filière
                  </label>
                  <select
                    value={formData.filiere}
                    onChange={(e) => setFormData({...formData, filiere: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    required
                  >
                    <option value="">Sélectionnez une filière</option>
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
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Année d'étude
                  </label>
                  <input
                    type="text"
                    value={formData.annee}
                    onChange={(e) => setFormData({...formData, annee: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Ex: 3ème année"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Spécialité
                  </label>
                  <input
                    type="text"
                    value={formData.specialite}
                    onChange={(e) => setFormData({...formData, specialite: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Ex: Développement Web, Intelligence Artificielle..."
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <i className="fas fa-phone text-primary mr-2"></i>
                    Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Ex: +229 96 00 00 00"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Ce numéro sera utilisé par les étudiants pour vous contacter
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Biographie
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    placeholder="Parlez-nous de votre parcours, vos compétences, votre expérience..."
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/mentors')}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={chargement}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {chargement ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};
export default ProfilMentor;