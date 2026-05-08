import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FournisseurUtilisateur } from './contexte/ContexteUtilisateur';
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
const App = () => {
  return (
    <FournisseurUtilisateur>
      <Router>
        <div className="min-h-screen bg-bg">
          <Navigation />
          <main className="pt-0">
            <Routes>
              <Route path="/" element={<Accueil />} />
              <Route path="/accueil" element={<Accueil />} />
              <Route path="/mentors" element={<Mentors />} />
              <Route path="/clubs" element={<Clubs />} />
              <Route path="/campus" element={<Campus />} />
              <Route path="/orientation" element={<Orientation />} />
              <Route path="/calendrier" element={<Calendrier />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/profil" element={<Profil />} />
              <Route path="/parametres" element={<Parametres />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/login" element={<Login />} />
              <Route path="/devenir-mentor" element={<DevenirMentor />} />
              <Route path="/profil-mentor" element={<ProfilMentor />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <footer className="py-10 text-center text-slate-400 text-sm border-t border-slate-200 mt-20">
            <p> 2024 CampusGuide - Université Nouveaux Horizons</p>
          </footer>
        </div>
      </Router>
    </FournisseurUtilisateur>
  );
};
export default App;