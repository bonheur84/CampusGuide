import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { FournisseurUtilisateur, ContexteUtilisateur } from './contexte/ContexteUtilisateur';
import Navigation from './components/Navigation';
import PageTransition from './components/ui/PageTransition';
import OfflineIndicator from './components/OfflineIndicator';
import AIAssistant from './components/AIAssistant';
// Importation des pages (on va les créer juste après)
import Accueil from './pages/Accueil';
import Mentors from './pages/Mentors';
import Clubs from './pages/Clubs';
import Campus from './pages/Campus';
import Orientation from './pages/Orientation';
import Calendrier from './pages/Calendrier';
import Guide from './pages/Guide';
import Profil from './pages/Profil';
import Parametres from './pages/Parametres';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import DevenirMentor from './pages/DevenirMentor';
import ProfilMentor from './pages/ProfilMentor';
import AdminDashboard from './pages/AdminDashboard';
import APropos from './pages/APropos';

const RouteProtegee = ({ children }) => {
  const { utilisateur, pret } = useContext(ContexteUtilisateur);

  if (!pret) {
    return <div className="flex items-center justify-center min-h-screen bg-bg">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-sky-200 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
      </div>
    </div>;
  }

  if (!utilisateur.id) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const ContenuApp = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="pt-0">
          <Routes>
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/" element={<RouteProtegee><PageTransition><Accueil /></PageTransition></RouteProtegee>} />
            <Route path="/accueil" element={<RouteProtegee><PageTransition><Accueil /></PageTransition></RouteProtegee>} />
            <Route path="/mentors" element={<RouteProtegee><PageTransition><Mentors /></PageTransition></RouteProtegee>} />
            <Route path="/clubs" element={<RouteProtegee><PageTransition><Clubs /></PageTransition></RouteProtegee>} />
            <Route path="/campus" element={<RouteProtegee><PageTransition><Campus /></PageTransition></RouteProtegee>} />
            <Route path="/orientation" element={<RouteProtegee><PageTransition><Orientation /></PageTransition></RouteProtegee>} />
            <Route path="/calendrier" element={<RouteProtegee><PageTransition><Calendrier /></PageTransition></RouteProtegee>} />
            <Route path="/guide" element={<RouteProtegee><PageTransition><Guide /></PageTransition></RouteProtegee>} />
            <Route path="/profil" element={<RouteProtegee><PageTransition><Profil /></PageTransition></RouteProtegee>} />
            <Route path="/parametres" element={<RouteProtegee><PageTransition><Parametres /></PageTransition></RouteProtegee>} />
            <Route path="/notifications" element={<RouteProtegee><PageTransition><Notifications /></PageTransition></RouteProtegee>} />
            <Route path="/devenir-mentor" element={<RouteProtegee><PageTransition><DevenirMentor /></PageTransition></RouteProtegee>} />
            <Route path="/profil-mentor" element={<RouteProtegee><PageTransition><ProfilMentor /></PageTransition></RouteProtegee>} />
            <Route path="/admin" element={<RouteProtegee><PageTransition><AdminDashboard /></PageTransition></RouteProtegee>} />
            <Route path="/a-propos" element={<RouteProtegee><PageTransition><APropos /></PageTransition></RouteProtegee>} />
          </Routes>
        </main>
        <footer className="py-10 text-center text-slate-400 text-sm border-t border-slate-200 mt-10">
          <p> 2024 CampusGuide - Université Nouveaux Horizons</p>
        </footer>
      </div>
      <OfflineIndicator />
      {/* AI Assistant - Positioned by the component itself */}
      <AIAssistant />
    </Router>
  );
};

const App = () => {
  return (
    <FournisseurUtilisateur>
      <ContenuApp />
    </FournisseurUtilisateur>
  );
};

export default App;