import React from 'react';
import { Link } from 'react-router-dom';
import LazyImage from '../components/ui/LazyImage';

const APropos = () => {
  return (
    <main className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16">
      {/* Hero Section */}
      <section className="max-w-[1200px] mx-auto mb-16">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0">
            <LazyImage 
              src="https://images.unsplash.com/photo-1562774053-701939374585?w=1600" 
              alt="Campus universitaire"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 to-slate-800/50"></div>
          </div>
          <div className="relative z-10 p-8 md:p-16 text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">À propos de l'Université</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl">
              Université Nouveaux Horizons - Former les leaders de demain
            </p>
          </div>
        </div>
      </section>

      {/* Galerie Photos */}
      <section className="max-w-[1200px] mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">Notre Campus</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <LazyImage 
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800" 
              alt="Campus universitaire"
              className="w-full h-64"
              placeholder={<div className="w-full h-64 bg-slate-200 animate-pulse flex items-center justify-center"><i className="fa-solid fa-building text-slate-400 text-4xl"></i></div>}
            />
            <div className="bg-white p-4">
              <p className="text-sm font-bold text-slate-900">Bâtiment Principal</p>
              <p className="text-xs text-slate-500">Cœur de l'université</p>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <LazyImage 
              src="https://images.unsplash.com/photo-1523050854058-8df90110a9f1?w=800" 
              alt="Bibliothèque"
              className="w-full h-64"
              placeholder={<div className="w-full h-64 bg-slate-200 animate-pulse flex items-center justify-center"><i className="fa-solid fa-book text-slate-400 text-4xl"></i></div>}
            />
            <div className="bg-white p-4">
              <p className="text-sm font-bold text-slate-900">Bibliothèque</p>
              <p className="text-xs text-slate-500">Plus de 100 000 ouvrages</p>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <LazyImage 
              src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800" 
              alt="Amphithéâtre"
              className="w-full h-64"
              placeholder={<div className="w-full h-64 bg-slate-200 animate-pulse flex items-center justify-center"><i className="fa-solid fa-chalkboard-teacher text-slate-400 text-4xl"></i></div>}
            />
            <div className="bg-white p-4">
              <p className="text-sm font-bold text-slate-900">Amphithéâtres</p>
              <p className="text-xs text-slate-500">Salles de conférence modernes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Histoire et Mission */}
      <section className="max-w-[1200px] mx-auto mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-primary font-bold text-sm uppercase tracking-wider mb-2 block">Notre Histoire</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Une vision d'excellence</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Fondée avec la mission de fournir une éducation de qualité supérieure, l'Université Nouveaux Horizons s'est imposée comme une référence dans l'enseignement supérieur. Notre engagement envers l'innovation pédagogique et le développement personnel de nos étudiants nous distingue.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Depuis notre création, nous avons formé des milliers de professionnels qui contribuent activement au développement de notre société.
            </p>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Notre Mission</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fas fa-check text-white text-xs"></i>
                </div>
                <span className="text-slate-600">Former des leaders compétents et éthiques</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fas fa-check text-white text-xs"></i>
                </div>
                <span className="text-slate-600">Promouvoir l'innovation et la recherche</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fas fa-check text-white text-xs"></i>
                </div>
                <span className="text-slate-600">Contribuer au développement sociétal</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="fas fa-check text-white text-xs"></i>
                </div>
                <span className="text-slate-600">Favoriser l'inclusion et la diversité</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Chiffres Clés */}
      <section className="max-w-[1200px] mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">Nos Chiffres Clés</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center hover:shadow-lg transition-all">
            <div className="text-4xl font-bold text-primary mb-2">5000+</div>
            <div className="text-slate-600 font-medium">Étudiants</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center hover:shadow-lg transition-all">
            <div className="text-4xl font-bold text-primary mb-2">50+</div>
            <div className="text-slate-600 font-medium">Filières</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center hover:shadow-lg transition-all">
            <div className="text-4xl font-bold text-primary mb-2">200+</div>
            <div className="text-slate-600 font-medium">Professeurs</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center hover:shadow-lg transition-all">
            <div className="text-4xl font-bold text-primary mb-2">95%</div>
            <div className="text-slate-600 font-medium">Taux d'emploi</div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="max-w-[1200px] mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">Nos Valeurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 border border-blue-100">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-4">
              <i className="fas fa-lightbulb text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Innovation</h3>
            <p className="text-slate-600 leading-relaxed">
              Nous encourageons la créativité et l'innovation dans tous les aspects de notre enseignement et de notre recherche.
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-3xl p-8 border border-purple-100">
            <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-4">
              <i className="fas fa-handshake text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Intégrité</h3>
            <p className="text-slate-600 leading-relaxed">
              L'honnêteté, l'éthique et la transparence sont au cœur de toutes nos actions et décisions.
            </p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-8 border border-emerald-100">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-4">
              <i className="fas fa-users text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Excellence</h3>
            <p className="text-slate-600 leading-relaxed">
              Nous visons l'excellence dans tout ce que nous faisons, de l'enseignement à la recherche.
            </p>
          </div>
        </div>
      </section>

      {/* Administration */}
      <section className="max-w-[1200px] mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">Notre Administration</h2>
        <div className="bg-white rounded-3xl p-8 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <i className="fas fa-user-tie text-slate-400 text-2xl"></i>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Recteur</h3>
                <p className="text-slate-600">Dr. Jean-Pierre Martin</p>
                <p className="text-sm text-slate-500 mt-1">Direction générale et stratégie</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <i className="fas fa-graduation-cap text-slate-400 text-2xl"></i>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Vice-Recteur Académique</h3>
                <p className="text-slate-600">Pr. Marie Dubois</p>
                <p className="text-sm text-slate-500 mt-1">Affaires académiques</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <i className="fas fa-flask text-slate-400 text-2xl"></i>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Directeur de la Recherche</h3>
                <p className="text-slate-600">Pr. Ahmed Benali</p>
                <p className="text-sm text-slate-500 mt-1">Innovation et recherche scientifique</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <i className="fas fa-chart-line text-slate-400 text-2xl"></i>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Directeur Financier</h3>
                <p className="text-slate-600">M. Pierre Leroy</p>
                <p className="text-sm text-slate-500 mt-1">Gestion financière</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact et Localisation */}
      <section className="max-w-[1200px] mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">Contactez-nous</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Informations de Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <i className="fas fa-map-marker-alt text-primary"></i>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Adresse</p>
                  <p className="text-slate-600">Campus Principal, 123 Avenue de l'Université</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <i className="fas fa-phone text-primary"></i>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Téléphone</p>
                  <p className="text-slate-600">+221 33 123 45 67</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <i className="fas fa-envelope text-primary"></i>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Email</p>
                  <p className="text-slate-600">contact@universite-nouveaux-horizons.edu</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <i className="fas fa-clock text-primary"></i>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Horaires</p>
                  <p className="text-slate-600">Lun - Ven: 8h00 - 18h00</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Vie Étudiante et Activités</h3>
              <p className="text-slate-600 text-lg max-w-3xl mx-auto">
                Une expérience universitaire complète qui allie excellence académique et épanouissement personnel
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <i className="fas fa-futbol text-primary text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Sports et Loisirs</h4>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">Clubs de football, basketball, tennis, natation et nombreuses activités sportives pour tous les niveaux.</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">15+ Clubs sportifs disponibles</span>
                  <i className="fas fa-arrow-right text-primary"></i>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-music text-purple-600 text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Culture et Arts</h4>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">Orchestre, théâtre, danse, peinture et ateliers culturels pour exprimer votre créativité.</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">10+ Ateliers culturels</span>
                  <i className="fas fa-arrow-right text-purple-600"></i>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-users text-emerald-600 text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Vie Associative</h4>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">Plus de 30 clubs étudiants pour développer vos compétences et rencontrer de nouvelles personnes.</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">30+ Clubs actifs</span>
                  <i className="fas fa-arrow-right text-emerald-600"></i>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-globe text-amber-600 text-xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Échanges Internationaux</h4>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">Partenariats avec des universités du monde entier pour des semestres d'échange enrichissants.</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">25+ Partenaires mondiaux</span>
                  <i className="fas fa-arrow-right text-amber-600"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1200px] mx-auto">
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Prêt à rejoindre notre communauté?</h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            Découvrez nos programmes et commencez votre voyage vers l'excellence académique.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/clubs" className="px-8 py-4 bg-white text-primary rounded-xl font-bold hover:bg-slate-100 transition-all">
              Découvrir nos Clubs
            </Link>
            <Link to="/mentors" className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">
              Trouver un Mentor
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default APropos;
