import React, { useState, useEffect, useRef, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ContexteUtilisateur } from '../contexte/ContexteUtilisateur';

const Messages = () => {
  const { ajouterNotification } = useContext(ContexteUtilisateur);
  const [searchParams] = useSearchParams();
  const mentorId = searchParams.get('contact');
  
  const [activeChatId, setActiveChatId] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState([]);
  const [allMessages, setAllMessages] = useState({});
  const [recherche, setRecherche] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const emojis = ['😊', '😂', '👍', '❤️', '🙏', '🔥', '🤔', '🙌', '✨', '💻', '🚀', '🎯', '📚', '🎓'];

  useEffect(() => {
    chargerDonnees();
    const handleStorageChange = (e) => {
      if (e.key === 'campus_chat_history') {
        chargerDonnees();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [mentorId]);

  const chargerDonnees = () => {
    const mentorsStock = JSON.parse(localStorage.getItem('campus_mentors') || '[]');
    const defaultMentors = [
      { id: 1, nom: 'Jean Dupont', filiere: 'informatique', photo: null },
      { id: 2, nom: 'Marie Kel', filiere: 'medecine', photo: null },
      { id: 3, nom: 'Marc Obiang', filiere: 'droit', photo: null }
    ];
    const tousLesMentors = mentorsStock.length > 0 ? mentorsStock : defaultMentors;
    const messagesStock = JSON.parse(localStorage.getItem('campus_chat_history') || '{}');
    setAllMessages(messagesStock);

    let convs = [];
    const contactIds = Object.keys(messagesStock).map(Number);
    tousLesMentors.forEach(m => {
      if (contactIds.includes(m.id) || (mentorId && Number(mentorId) === m.id)) {
        const lastMsgs = messagesStock[m.id] || [];
        convs.push({
          id: m.id,
          nom: m.nom,
          photo: m.photo,
          dernierMessage: lastMsgs.length > 0 ? formatDernierMessage(lastMsgs[lastMsgs.length - 1]) : "Démarrer la discussion",
          heure: lastMsgs.length > 0 ? lastMsgs[lastMsgs.length - 1].heure : "",
          nonLus: 0,
          enLigne: Math.random() > 0.3
        });
      }
    });
    setConversations(convs);
    if (mentorId) {
      setActiveChatId(Number(mentorId));
    } else if (convs.length > 0 && !activeChatId) {
      setActiveChatId(convs[0].id);
    }
  };

  const formatDernierMessage = (msg) => {
    if (msg.type === 'image') return '📷 Photo';
    if (msg.type === 'audio') return '🎤 Message vocal';
    if (msg.type === 'fichier') return '📄 ' + msg.texte;
    return msg.texte;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages, activeChatId, isTyping]);

  const envoyerMessage = (texte, type = 'texte', metadata = null) => {
    if (!texte.trim() && type === 'texte' && !isRecording) return;
    if (!activeChatId) return;

    const heure = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nouveauMsg = {
      id: Date.now(),
      texte: texte,
      type: type,
      metadata: metadata,
      heure: heure,
      estMoi: true,
      status: 'sent',
      date: new Date().toLocaleDateString()
    };

    const nouveauxMessages = {
      ...allMessages,
      [activeChatId]: [...(allMessages[activeChatId] || []), nouveauMsg]
    };

    setAllMessages(nouveauxMessages);
    localStorage.setItem('campus_chat_history', JSON.stringify(nouveauxMessages));
    setMessageText('');
    setShowEmojis(false);

    setTimeout(() => {
        nouveauMsg.status = 'read';
        localStorage.setItem('campus_chat_history', JSON.stringify(nouveauxMessages));
        setAllMessages({...nouveauxMessages});
    }, 1500);

    if (allMessages[activeChatId]?.length < 5) {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          recevoirMessage("C'est bien noté ! Je reviens vers toi dès que possible.");
        }, 3000);
      }, 2000);
    }
  };

  const recevoirMessage = (texte) => {
    const heure = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgRecu = {
      id: Date.now() + 2,
      texte: texte,
      type: 'texte',
      heure: heure,
      estMoi: false,
      date: new Date().toLocaleDateString()
    };

    const nouveaux = {
      ...allMessages,
      [activeChatId]: [...(allMessages[activeChatId] || []), msgRecu]
    };
    setAllMessages(nouveaux);
    localStorage.setItem('campus_chat_history', JSON.stringify(nouveaux));
    
    // Notification automatique
    const nomChat = conversations.find(c => c.id === activeChatId)?.nom || "Contact";
    ajouterNotification(`Nouveau message de ${nomChat}`, texte, "info", "fa-comment-dots");
  };

  const gererVocal = () => {
    if (isRecording) return;
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      envoyerMessage("0:08", "audio");
    }, 3000);
  };

  const gererFichier = (e) => {
    const fichier = e.target.files[0];
    if (!fichier) return;
    const lecteur = new FileReader();
    lecteur.onload = (event) => {
      const estImage = fichier.type.startsWith('image/');
      envoyerMessage(estImage ? event.target.result : fichier.name, estImage ? 'image' : 'fichier', { nom: fichier.name, taille: (fichier.size / 1024).toFixed(1) + ' KB' });
    };
    lecteur.readAsDataURL(fichier);
  };

  const supprimerMessage = (msgId) => {
    if (!window.confirm("Supprimer ce message ?")) return;
    const nouveauxMsgs = allMessages[activeChatId].filter(m => m.id !== msgId);
    const updated = { ...allMessages, [activeChatId]: nouveauxMsgs };
    setAllMessages(updated);
    localStorage.setItem('campus_chat_history', JSON.stringify(updated));
  };

  const chatActuel = conversations.find(c => c.id === activeChatId);
  const messagesActuels = allMessages[activeChatId] || [];
  const conversationsFiltrees = conversations.filter(c => c.nom.toLowerCase().includes(recherche.toLowerCase()));

  const groups = messagesActuels.reduce((acc, msg) => {
    const date = msg.date || 'Inconnu';
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  return (
    <main className="pt-[80px] md:pt-[100px] h-screen flex flex-col bg-[#f0f2f5] overflow-hidden anime-apparition">
      <div className="flex-1 max-w-[1600px] mx-auto w-full md:p-4 lg:p-6 flex overflow-hidden">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={`w-full md:w-[380px] lg:w-[420px] bg-white border-r border-slate-200 flex flex-col z-20 shadow-xl ${activeChatId && 'hidden md:flex'}`}>
          <div className="p-4 bg-[#f0f2f5] flex items-center justify-between border-b border-slate-200">
             <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-80 transition-all shadow-sm overflow-hidden border-2 border-white"><i className="fa-solid fa-user text-xl"></i></div>
             <div className="flex gap-4 text-slate-500">
                <button className="bg-transparent border-none cursor-pointer hover:bg-slate-200 w-9 h-9 rounded-full flex items-center justify-center transition-all"><i className="fa-solid fa-circle-notch"></i></button>
                <button className="bg-transparent border-none cursor-pointer hover:bg-slate-200 w-9 h-9 rounded-full flex items-center justify-center transition-all"><i className="fa-solid fa-message"></i></button>
                <button className="bg-transparent border-none cursor-pointer hover:bg-slate-200 w-9 h-9 rounded-full flex items-center justify-center transition-all"><i className="fa-solid fa-ellipsis-vertical"></i></button>
             </div>
          </div>
          <div className="p-2 border-b border-slate-100">
             <div className="bg-[#f0f2f5] rounded-lg px-4 py-1.5 flex items-center gap-4 border border-transparent focus-within:bg-white focus-within:border-primary/20 transition-all shadow-sm">
                <i className="fa-solid fa-magnifying-glass text-slate-400 text-xs"></i>
                <input type="text" placeholder="Rechercher ou démarrer une discussion" className="bg-transparent border-none outline-none flex-1 text-[13px] font-inter text-slate-700 h-8" value={recherche} onChange={(e) => setRecherche(e.target.value)} />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
             {conversationsFiltrees.length > 0 ? (
               conversationsFiltrees.map(conv => (
                 <div key={conv.id} onClick={() => setActiveChatId(conv.id)} className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-slate-50 transition-all relative ${activeChatId === conv.id ? 'bg-[#f0f2f5]' : 'hover:bg-[#f5f6f6]'}`}>
                   <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-400 shrink-0 overflow-hidden border border-slate-100 shadow-sm" style={conv.photo ? { backgroundImage: `url(${conv.photo})`, backgroundSize: 'cover' } : {}}>{!conv.photo && conv.nom[0]}</div>
                   <div className="flex-1 min-w-0 pr-2">
                      <div className="flex justify-between items-center mb-0.5">
                         <strong className="text-[15px] font-medium text-slate-900 truncate">{conv.nom}</strong>
                         <span className={`text-[11px] ${conv.nonLus > 0 ? 'text-[#25D366] font-bold' : 'text-slate-400 font-medium'}`}>{conv.heure}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <p className="text-[13.5px] text-slate-500 truncate flex items-center gap-1.5 flex-1 pr-4">{conv.id === activeChatId && <i className="fa-solid fa-check-double text-[#53bdeb] text-[11px]"></i>}{conv.dernierMessage}</p>
                         {conv.nonLus > 0 && <span className="bg-[#25D366] text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-sm">{conv.nonLus}</span>}
                      </div>
                   </div>
                 </div>
               ))
             ) : (
               <div className="p-10 text-center text-slate-400"><i className="fa-solid fa-ghost text-4xl mb-4 block"></i><p className="text-sm">Aucune discussion trouvée</p></div>
             )}
          </div>
        </motion.div>

        <div className={`flex-1 flex flex-col bg-[#efeae2] relative shadow-2xl ${!activeChatId && 'hidden md:flex'}`}>
          {activeChatId ? (
            <>
              <div className="px-4 py-2 bg-[#f0f2f5] border-b border-slate-200 flex items-center justify-between z-30 shadow-sm">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveChatId(null)} className="md:hidden text-slate-600 mr-1 bg-transparent border-none text-lg cursor-pointer p-2"><i className="fa-solid fa-arrow-left"></i></button>
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-400 shrink-0 overflow-hidden border border-white shadow-sm" style={chatActuel?.photo ? { backgroundImage: `url(${chatActuel.photo})`, backgroundSize: 'cover' } : {}}>{!chatActuel?.photo && chatActuel?.nom[0]}</div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-slate-800 leading-tight">{chatActuel?.nom}</h3>
                    <span className="text-[11px] text-slate-500 font-medium">{isTyping ? <span className="text-[#25D366] font-bold italic animate-pulse">en train d'écrire...</span> : (chatActuel?.enLigne ? 'En ligne' : 'Vu récemment')}</span>
                  </div>
                </div>
                <div className="flex gap-5 text-slate-500 pr-2">
                   <button className="bg-transparent border-none cursor-pointer hover:bg-slate-200 w-9 h-9 rounded-full flex items-center justify-center transition-all"><i className="fa-solid fa-magnifying-glass"></i></button>
                   <button className="bg-transparent border-none cursor-pointer hover:bg-slate-200 w-9 h-9 rounded-full flex items-center justify-center transition-all"><i className="fa-solid fa-ellipsis-vertical"></i></button>
                </div>
              </div>
              <div className="absolute inset-0 opacity-[0.4] pointer-events-none z-0" style={{ backgroundImage: "url('https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-dark-pattern-whatsapp-pattern.jpg')", backgroundSize: '400px' }}></div>
              <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-4 relative z-10 custom-scrollbar scroll-smooth">
                 {Object.keys(groups).map(date => (
                   <React.Fragment key={date}>
                      <div className="flex justify-center my-4"><span className="bg-white px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-500 uppercase tracking-widest shadow-sm border border-slate-100">{date === new Date().toLocaleDateString() ? "Aujourd'hui" : date}</span></div>
                      {groups[date].map((msg) => (
                        <motion.div key={msg.id} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={`flex flex-col max-w-[85%] md:max-w-[75%] ${msg.estMoi ? 'self-end' : 'self-start'}`}>
                           <div className={`group p-2.5 rounded-xl shadow-md relative min-w-[80px] ${msg.estMoi ? 'bg-[#dcf8c6] rounded-tr-none' : 'bg-white rounded-tl-none border border-slate-100'}`} onContextMenu={(e) => { e.preventDefault(); supprimerMessage(msg.id); }}>
                              <button onClick={() => supprimerMessage(msg.id)} className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-[8px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg cursor-pointer border-none"><i className="fa-solid fa-x"></i></button>
                              {msg.type === 'image' ? (
                                <div className="flex flex-col gap-1"><img src={msg.texte} alt="attachment" className="rounded-lg max-w-full max-h-[300px] object-cover border border-black/5 shadow-sm" />{msg.metadata?.nom && <p className="text-[12px] font-medium text-slate-700 px-1">{msg.metadata.nom}</p>}</div>
                              ) : msg.type === 'fichier' ? (
                                <div className="flex items-center gap-4 bg-black/5 p-4 rounded-xl border border-black/10 hover:bg-black/10 transition-all cursor-pointer"><div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary text-xl shadow-inner"><i className="fa-solid fa-file-pdf"></i></div><div className="flex-1 min-w-0 pr-4 border-r border-black/10"><p className="text-[13px] font-bold text-slate-800 truncate leading-tight">{msg.texte}</p><p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-wider">{msg.metadata?.taille}</p></div><i className="fa-solid fa-download text-slate-500 hover:text-primary transition-colors"></i></div>
                              ) : msg.type === 'audio' ? (
                                <div className="flex items-center gap-4 py-2 px-1 min-w-[200px]"><div className="w-11 h-11 rounded-full bg-slate-900/10 flex items-center justify-center text-slate-700 cursor-pointer hover:bg-slate-900/20 transition-all shadow-inner"><i className="fa-solid fa-play ml-1 text-lg"></i></div><div className="flex-1 flex flex-col gap-2"><div className="h-4 flex items-end gap-[2px] justify-between px-1">{[...Array(20)].map((_, i) => (<div key={i} className="w-[3px] bg-slate-400/50 rounded-full" style={{ height: `${20 + Math.random() * 80}%` }}></div>))}</div><div className="flex justify-between items-center"><p className="text-[10px] font-black text-slate-500 tracking-tighter uppercase">{msg.texte}</p><i className="fa-solid fa-microphone text-primary text-xs"></i></div></div></div>
                              ) : (
                                <p className="text-[14.5px] text-slate-800 leading-relaxed wrap-break-word whitespace-pre-wrap">{msg.texte}</p>
                              )}
                              <div className="flex items-center justify-end gap-1.5 mt-1.5"><span className="text-[10px] text-slate-500 font-bold">{msg.heure}</span>{msg.estMoi && (<i className={`fa-solid fa-check-double text-[11px] ${msg.status === 'read' ? 'text-[#53bdeb]' : 'text-slate-400'}`}></i>)}</div>
                           </div>
                        </motion.div>
                      ))}
                   </React.Fragment>
                 ))}
                 {isTyping && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="self-start bg-white p-3 rounded-xl rounded-tl-none shadow-sm border border-slate-100 flex gap-1.5"><span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span><span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span><span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span></motion.div>)}
                 <div ref={messagesEndRef} className="h-4" />
              </div>
              <div className="p-3 bg-[#f0f2f5] flex items-center gap-3 z-30 relative border-t border-slate-200">
                 <AnimatePresence>{showEmojis && (<motion.div initial={{ y: 20, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0, scale: 0.9 }} className="absolute bottom-full left-4 bg-white p-4 rounded-2xl shadow-2xl border border-slate-200 grid grid-cols-7 gap-3 mb-3 z-50 shadow-black/10">{emojis.map(e => (<button key={e} onClick={() => setMessageText(prev => prev + e)} className="text-2xl hover:scale-150 transition-transform border-none bg-transparent cursor-pointer p-1.5 leading-none">{e}</button>))}</motion.div>)}</AnimatePresence>
                 <div className="flex gap-2 text-slate-500"><button onClick={() => setShowEmojis(!showEmojis)} className={`bg-transparent border-none cursor-pointer hover:bg-slate-200 w-10 h-10 rounded-full flex items-center justify-center transition-all ${showEmojis ? 'text-primary' : ''}`}><i className="fa-regular fa-face-smile text-2xl"></i></button><button onClick={() => fileInputRef.current.click()} className="bg-transparent border-none cursor-pointer hover:bg-slate-200 w-10 h-10 rounded-full flex items-center justify-center transition-all"><i className="fa-solid fa-plus text-xl"></i></button><input type="file" ref={fileInputRef} className="hidden" onChange={gererFichier} /></div>
                 <div className="flex-1"><input type="text" placeholder={isRecording ? "Enregistrement en cours..." : "Tapez un message"} className={`w-full bg-white border-none rounded-xl px-5 py-3 text-[15px] font-inter outline-none shadow-sm transition-all focus:shadow-md ${isRecording && 'text-red-500 font-bold animate-pulse'}`} value={messageText} onChange={(e) => setMessageText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && envoyerMessage(messageText)} disabled={isRecording} /></div>
                 <button onClick={messageText.trim() ? () => envoyerMessage(messageText) : gererVocal} className={`w-12 h-12 rounded-full text-white border-none flex items-center justify-center text-xl shadow-lg cursor-pointer transition-all active:scale-90 ${isRecording ? 'bg-red-500 animate-bounce' : 'bg-primary hover:bg-primary-dark shadow-primary/20'}`}><i className={messageText.trim() ? "fa-solid fa-paper-plane" : "fa-solid fa-microphone"}></i></button>
              </div>
            </>
          ) : (
            <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-20 bg-[#f8f9fa] border-l border-slate-200"><div className="w-32 h-32 bg-[#25D366]/10 rounded-full flex items-center justify-center text-[#25D366] text-5xl mb-8 shadow-inner"><i className="fa-solid fa-graduation-cap"></i></div><h3 className="text-[32px] font-light text-slate-800 mb-4">CampusGuide Web</h3><p className="text-slate-500 max-w-[460px] text-sm leading-relaxed mb-10">Envoyez et recevez des messages sans laisser votre téléphone allumé. Utilisez CampusGuide sur votre ordinateur pour une expérience plus rapide.</p><div className="h-px w-full max-w-[400px] bg-slate-200 mb-10"></div><div className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-widest bg-white px-6 py-3 rounded-full shadow-sm"><i className="fa-solid fa-lock text-[#25D366]"></i> Chiffrement de bout en bout</div></div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Messages;
