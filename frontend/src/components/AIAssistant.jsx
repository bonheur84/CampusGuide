import React, { useState, useEffect, useRef } from 'react';
import aiService from '../services/AIService';

const AIAssistant = () => {
  const [estOuvert, setEstOuvert] = useState(false);
  const [question, setQuestion] = useState('');
  const [historique, setHistorique] = useState([]);
  const [enTrainDeTaper, setEnTrainDeTaper] = useState(false);
  const [estReduit, setEstReduit] = useState(false);
  const zoneMessagesRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const historiqueCharge = aiService.chargerHistorique();
    setHistorique(historiqueCharge);
  }, []);

  // Recharger l'historique quand l'utilisateur change de compte
  useEffect(() => {
    const handleUserChange = () => {
      const historiqueCharge = aiService.chargerHistorique();
      setHistorique(historiqueCharge);
    };

    window.addEventListener('userChanged', handleUserChange);
    return () => window.removeEventListener('userChanged', handleUserChange);
  }, []);

  useEffect(() => {
    if (zoneMessagesRef.current) {
      zoneMessagesRef.current.scrollTop = zoneMessagesRef.current.scrollHeight;
    }
  }, [historique]);

  useEffect(() => {
    if (estOuvert && inputRef.current) {
      inputRef.current.focus();
    }
  }, [estOuvert]);

  const envoyerQuestion = (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setEnTrainDeTaper(true);
    
    // Simuler un délai de réponse pour un effet plus naturel
    setTimeout(() => {
      const reponse = aiService.obtenirReponse(question);
      const nouvelHistorique = aiService.chargerHistorique();
      setHistorique(nouvelHistorique);
      setQuestion('');
      setEnTrainDeTaper(false);
    }, 500 + Math.random() * 500);
  };

  const effacerConversation = () => {
    aiService.effacerHistorique();
    setHistorique([]);
  };

  const suggestionsRapides = [
    'Comment devenir mentor ?',
    'Quels clubs sont disponibles ?',
    'Comment m\'inscrire à un événement ?',
    'Contact de l\'université'
  ];

  if (!estOuvert) {
    return (
      <button
        onClick={() => setEstOuvert(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full shadow-2xl hover:shadow-primary/50 hover:scale-110 transition-all duration-300 z-[9998] flex items-center justify-center group"
        title="Assistant IA"
      >
        <i className="fa-solid fa-robot text-2xl group-hover:rotate-12 transition-transform"></i>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
      </button>
    );
  }

  return (
    <div className={`fixed ${estReduit ? 'bottom-6 right-6 w-16 h-16' : 'bottom-6 right-6 w-[400px] h-[600px]'} bg-white rounded-3xl shadow-2xl border border-slate-200 z-[9998] flex flex-col transition-all duration-300 overflow-hidden`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-5 flex items-center justify-between">
        {!estReduit && (
          <>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-robot text-xl"></i>
              </div>
              <div>
                <h3 className="font-bold text-lg">Assistant CampusGuide</h3>
                <p className="text-xs text-white/80">Toujours là pour vous aider</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={effacerConversation}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
                title="Effacer la conversation"
              >
                <i className="fa-solid fa-trash text-sm"></i>
              </button>
              <button
                onClick={() => setEstReduit(true)}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
                title="Réduire"
              >
                <i className="fa-solid fa-minus text-sm"></i>
              </button>
              <button
                onClick={() => setEstOuvert(false)}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
                title="Fermer"
              >
                <i className="fa-solid fa-times text-sm"></i>
              </button>
            </div>
          </>
        )}
        {estReduit && (
          <button
            onClick={() => setEstReduit(false)}
            className="w-full h-full flex items-center justify-center"
            title="Agrandir"
          >
            <i className="fa-solid fa-robot text-2xl"></i>
          </button>
        )}
      </div>

      {!estReduit && (
        <>
          {/* Messages */}
          <div
            ref={zoneMessagesRef}
            className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50"
          >
            {historique.length === 0 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-robot text-primary text-3xl"></i>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Bonjour ! 👋</h4>
                <p className="text-sm text-slate-600 mb-6">Je suis l'assistant virtuel de CampusGuide. Comment puis-je vous aider ?</p>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Suggestions :</p>
                  {suggestionsRapides.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setQuestion(suggestion)}
                      className="w-full text-left px-4 py-2.5 bg-white hover:bg-primary/5 border border-slate-200 hover:border-primary rounded-xl text-sm text-slate-700 transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {historique.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.estUtilisateur ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.estUtilisateur
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  {!message.estUtilisateur && (
                    <div className="flex items-center gap-2 mb-1">
                      <i className="fa-solid fa-robot text-primary text-xs"></i>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Assistant</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.contenu}</p>
                  <p className={`text-[10px] mt-1 ${message.estUtilisateur ? 'text-white/70' : 'text-slate-400'}`}>
                    {message.date}
                  </p>
                </div>
              </div>
            ))}

            {enTrainDeTaper && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={envoyerQuestion} className="p-4 bg-white border-t border-slate-200">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Tapez votre question..."
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary focus:outline-none text-sm"
                disabled={enTrainDeTaper}
              />
              <button
                type="submit"
                disabled={!question.trim() || enTrainDeTaper}
                className="px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default AIAssistant;