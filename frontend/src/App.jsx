import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FournisseurUtilisateur, ContexteUtilisateur } from './contexte/ContexteUtilisateur';
import Navigation from './components/Navigation';
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

const RouteProtegee = ({ children }) => {
  const { utilisateur, pret } = useContext(ContexteUtilisateur);

  if (!pret) {
    return <div className="flex items-center justify-center min-h-screen bg-bg">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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
      <div className="min-h-screen bg-bg">
        <Navigation />
        <main className="pt-0">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<RouteProtegee><Accueil /></RouteProtegee>} />
            <Route path="/accueil" element={<RouteProtegee><Accueil /></RouteProtegee>} />
            <Route path="/mentors" element={<RouteProtegee><Mentors /></RouteProtegee>} />
            <Route path="/clubs" element={<RouteProtegee><Clubs /></RouteProtegee>} />
            <Route path="/campus" element={<RouteProtegee><Campus /></RouteProtegee>} />
            <Route path="/orientation" element={<RouteProtegee><Orientation /></RouteProtegee>} />
            <Route path="/calendrier" element={<RouteProtegee><Calendrier /></RouteProtegee>} />
            <Route path="/guide" element={<RouteProtegee><Guide /></RouteProtegee>} />
            <Route path="/profil" element={<RouteProtegee><Profil /></RouteProtegee>} />
            <Route path="/parametres" element={<RouteProtegee><Parametres /></RouteProtegee>} />
            <Route path="/notifications" element={<RouteProtegee><Notifications /></RouteProtegee>} />
            <Route path="/devenir-mentor" element={<RouteProtegee><DevenirMentor /></RouteProtegee>} />
            <Route path="/profil-mentor" element={<RouteProtegee><ProfilMentor /></RouteProtegee>} />
            <Route path="/admin" element={<RouteProtegee><AdminDashboard /></RouteProtegee>} />
          </Routes>
        </main>
        <footer className="py-10 text-center text-slate-400 text-sm border-t border-slate-200 mt-20">
          <p> 2024 CampusGuide - Université Nouveaux Horizons</p>
        </footer>
      </div>
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