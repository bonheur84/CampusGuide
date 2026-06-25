import React, { useState, useEffect } from 'react';
import ratingService from '../../services/RatingService';
import { ContexteUtilisateur } from '../../contexte/ContexteUtilisateur';
import { useContext } from 'react';

const StarRating = ({ itemId, itemType, initialRating = 0, onRate, readonly = false, size = 'md', showCount = false }) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const { utilisateur } = useContext(ContexteUtilisateur);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const starSize = sizeClasses[size] || sizeClasses.md;

  // Charger les notes depuis le service (asynchrone pour mentors)
  useEffect(() => {
    const loadRatings = async () => {
      setLoading(true);
      try {
        const [moyenne, count, myVote] = await Promise.all([
          ratingService.getAverageRating(itemType, itemId),
          ratingService.getRatingCount(itemType, itemId),
          utilisateur.id ? ratingService.getMyRating(itemType, itemId) : Promise.resolve(0)
        ]);
        // Utiliser la moyenne du service si des votes existent, sinon utiliser initialRating
        setRating(count > 0 ? moyenne : initialRating);
        setRatingCount(count);
        setMyRating(myVote);
      } catch (err) {
        console.error('Erreur chargement ratings:', err);
        setRating(initialRating);
        setRatingCount(0);
        setMyRating(0);
      } finally {
        setLoading(false);
      }
    };
    loadRatings();
  }, [itemId, itemType, initialRating, utilisateur.id]);

  const handleRating = async (value) => {
    if (readonly || !utilisateur.id) return;
    
    try {
      // Ajouter le rating via le service (asynchrone)
      const nouvelleMoyenne = await ratingService.ajouterRating(itemType, itemId, utilisateur.id, value);
      setRating(nouvelleMoyenne);
      setMyRating(value);
      // Recharger le nombre de votes
      const count = await ratingService.getRatingCount(itemType, itemId);
      setRatingCount(count);
      
      if (onRate) {
        onRate(value);
      }
    } catch (err) {
      console.error('Erreur lors du vote:', err);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {loading ? (
        <span className="text-xs text-slate-400">Chargement...</span>
      ) : (
        <>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              onMouseEnter={() => !readonly && setHover(star)}
              onMouseLeave={() => setHover(0)}
              disabled={readonly}
              className={`transition-all duration-200 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
              type="button"
            >
              <svg
                className={`${starSize} ${
                  // Afficher le vote de l'utilisateur en hover, sinon la moyenne
                  star <= (hover || (myRating > 0 ? myRating : Math.round(rating))) 
                    ? 'text-amber-400 fill-amber-400' 
                    : 'text-slate-300 fill-slate-300'
                }`}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </button>
          ))}
          {rating > 0 && (
            <>
              <span className="ml-2 text-sm font-semibold text-slate-600">
                {rating}/5
              </span>
              {showCount && ratingCount > 0 && (
                <span className="text-xs text-slate-400 ml-1">
                  ({ratingCount} vote{ratingCount > 1 ? 's' : ''})
                </span>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default StarRating;
