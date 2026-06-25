import React, { useState, useEffect } from 'react';
import { ContexteUtilisateur } from '../contexte/ContexteUtilisateur';
import { useContext } from 'react';

const AcademicJournal = () => {
  const { utilisateur } = useContext(ContexteUtilisateur);
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    titre: '',
    contenu: '',
    matiere: '',
    semestre: 'S1'
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const savedEntries = localStorage.getItem(`campus_journal_${utilisateur.id}`);
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, [utilisateur.id]);

  const saveEntries = (updatedEntries) => {
    setEntries(updatedEntries);
    localStorage.setItem(`campus_journal_${utilisateur.id}`, JSON.stringify(updatedEntries));
  };

  const addEntry = (e) => {
    e.preventDefault();
    if (!newEntry.titre || !newEntry.contenu) return;

    const entry = {
      id: Date.now(),
      ...newEntry,
      date: new Date().toLocaleDateString('fr-FR'),
      timestamp: new Date().toISOString()
    };

    saveEntries([entry, ...entries]);
    setNewEntry({ titre: '', contenu: '', matiere: '', semestre: 'S1' });
    setShowForm(false);
  };

  const deleteEntry = (id) => {
    if (window.confirm('Supprimer cette entrée ?')) {
      saveEntries(entries.filter(e => e.id !== id));
    }
  };

  const matieres = [
    'Mathématiques', 'Physique', 'Informatique', 'Programmation',
    'Base de données', 'Réseaux', 'Algorithmique', 'Génie logiciel',
    'Droit', 'Économie', 'Gestion', 'Marketing', 'Finance',
    'Médecine', 'Biologie', 'Chimie', 'Pharmacie',
    'Architecture', 'Design', 'Autre'
  ];

  const semestres = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'M1', 'M2'];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Carnet de Bord Académique</h2>
          <p className="text-slate-600">Suivez votre progression et notez vos apprentissages</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          Nouvelle entrée
        </button>
      </div>

      {showForm && (
        <form onSubmit={addEntry} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Ajouter une note</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Titre *</label>
              <input
                type="text"
                value={newEntry.titre}
                onChange={(e) => setNewEntry({...newEntry, titre: e.target.value})}
                placeholder="Ex: Cours sur les algorithmes"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Matière</label>
                <select
                  value={newEntry.matiere}
                  onChange={(e) => setNewEntry({...newEntry, matiere: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary outline-none"
                >
                  <option value="">Sélectionner...</option>
                  {matieres.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Semestre</label>
                <select
                  value={newEntry.semestre}
                  onChange={(e) => setNewEntry({...newEntry, semestre: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary outline-none"
                >
                  {semestres.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Contenu *</label>
              <textarea
                value={newEntry.contenu}
                onChange={(e) => setNewEntry({...newEntry, contenu: e.target.value})}
                placeholder="Notez ce que vous avez appris..."
                rows="4"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary outline-none resize-none"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all"
              >
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
              >
                Annuler
              </button>
            </div>
          </div>
        </form>
      )}

      {entries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <i className="fas fa-book-open text-6xl text-slate-300 mb-4"></i>
          <p className="text-slate-500 text-lg font-medium">Aucune entrée pour le moment</p>
          <p className="text-slate-400 text-sm mt-2">Commencez par ajouter votre première note académique</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map(entry => (
            <div key={entry.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{entry.titre}</h3>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    {entry.matiere && (
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                        {entry.matiere}
                      </span>
                    )}
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                      {entry.semestre}
                    </span>
                    <span className="text-xs">{entry.date}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all"
                  title="Supprimer"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{entry.contenu}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcademicJournal;