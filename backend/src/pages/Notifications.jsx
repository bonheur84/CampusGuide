import React, { useContext } from 'react';
import { ContexteUtilisateur } from '../contexte/ContexteUtilisateur';
import { motion, AnimatePresence } from 'framer-motion';

const Notifications = () => {
  const { notifications, marquerLue, effacerNotification, toutMarquerLu } = useContext(ContexteUtilisateur);

  const getCouleur = (type) => {
    switch(type) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-amber-500';
      case 'error': return 'bg-red-500';
      case 'info': return 'bg-primary';
      default: return 'bg-slate-500';
    }
  };

  const getBg = (lue) => lue ? 'bg-white' : 'bg-sky-50/50 border-sky-100 shadow-sm';

  const nonLues = notifications.filter(n => !n.lue).length;

  return (
    <main className="pt-[100px] md:pt-[140px] px-4 md:px-[5%] pb-16 anime-apparition min-h-screen bg-[#f8f9fa]">
      <section className="flex flex-col items-center text-center max-w-[1200px] mx-auto mb-10">
        <span className="bg-white text-primary px-4 py-2 rounded-full text-[10px] md:text-xs border border-primary font-bold tracking-wider inline-flex items-center gap-2 shadow-sm">
          <i className="fa-solid fa-bell animate-swing"></i> NOTIFICATIONS
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-[66px] font-bold my-6 text-slate-900 leading-tight md:leading-none max-w-[800px]">
          Centre d'<span className="text-primary">Alertes</span>
        </h1>
        <p className="text-slate-500 text-lg md:text-[22px] max-w-[800px]">
          Suivez l'activité de votre compte et restez informé des nouveautés.
        </p>
      </section>

      <section className="max-w-[800px] mx-auto pb-20 px-4">
        <div className="flex items-center justify-between mb-8">
           <div>
              <span className="text-sm font-bold text-slate-900">{notifications.length} notifications</span>
              {nonLues > 0 && <span className="ml-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full">{nonLues} nouvelles</span>}
           </div>
           {notifications.length > 0 && (
             <button 
               onClick={toutMarquerLu}
               className="text-xs font-bold text-primary hover:text-primary-dark transition-colors border-none bg-transparent cursor-pointer flex items-center gap-2"
             >
               <i className="fa-solid fa-check-double"></i> Tout marquer comme lu
             </button>
           )}
        </div>

        <div className="flex flex-col gap-4">
           <AnimatePresence mode="popLayout">
             {notifications.length > 0 ? (
               notifications.map((notif) => (
                 <motion.div 
                   key={notif.id}
                   layout
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className={`p-5 rounded-2xl border border-slate-100 flex items-start gap-5 transition-all relative group ${getBg(notif.lue)}`}
                 >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg ${getCouleur(notif.type)}`}>
                       <i className={`fa-solid ${notif.icone || 'fa-bell'} text-xl`}></i>
                    </div>
                    
                    <div className="flex-1 min-w-0" onClick={() => marquerLue(notif.id)}>
                       <div className="flex justify-between items-start mb-1">
                          <strong className="text-base font-bold text-slate-900">{notif.titre}</strong>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{notif.date} • {notif.heure}</span>
                       </div>
                       <p className="text-[14px] text-slate-600 leading-relaxed">{notif.message}</p>
                       
                       {!notif.lue && (
                         <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span> Nouveau
                         </span>
                       )}
                    </div>

                    <button 
                      onClick={() => effacerNotification(notif.id)}
                      className="opacity-0 group-hover:opacity-100 absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all border-none flex items-center justify-center cursor-pointer"
                    >
                       <i className="fa-solid fa-trash-can text-sm"></i>
                    </button>
                 </motion.div>
               ))
             ) : (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200"
               >
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-6">
                     <i className="fa-solid fa-bell-slash text-3xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Aucune notification</h3>
                  <p className="text-slate-500">Vous êtes à jour ! Revenez plus tard pour voir les nouvelles alertes.</p>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </section>
    </main>
  );
};

export default Notifications;
