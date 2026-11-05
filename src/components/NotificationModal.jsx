import React, { useEffect, useRef } from 'react';
import { 
  X, 
  Bell, 
  Gift, 
  CheckCircle2, 
  Coins, 
  Check, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Inbox
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const NotificationModal = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAllRead, markOneRead } = useNotifications();
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Background Dim Dismiss */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Card */}
      <div 
        ref={modalRef}
        className="relative z-10 w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom duration-200"
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
              <Bell size={18} className="text-amber-400 fill-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Notifications</h3>
              <p className="text-[11px] text-slate-300">
                {unreadCount > 0 ? `${unreadCount} new alert${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-white/10 px-2.5 py-1 rounded-lg transition cursor-pointer"
              >
                Mark all read
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-gray-50">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <Inbox size={36} className="mx-auto mb-2 text-gray-300 stroke-1" />
              <p className="text-sm font-extrabold text-[#0F172A]">No Notifications Yet</p>
              <p className="text-xs text-gray-400 mt-1 max-w-[260px] mx-auto">
                When an admin approves your referral bonus or deposit, alerts appear here.
              </p>
            </div>
          ) : (
            notifications.map((n) => {
              const isReferral = n.type === 'referral_approved';
              const isDeposit = n.type === 'deposit_approved';

              return (
                <div
                  key={n._id}
                  onClick={() => !n.isRead && markOneRead(n._id)}
                  className={`pt-3 first:pt-0 p-3 rounded-2xl transition cursor-pointer flex items-start gap-3.5 ${
                    n.isRead 
                      ? 'bg-gray-50/60 hover:bg-gray-100/60' 
                      : 'bg-indigo-50/70 border border-indigo-100/80 shadow-xs'
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                    isReferral 
                      ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white'
                      : isDeposit
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                        : 'bg-gradient-to-br from-[#4A3AFF] to-indigo-600 text-white'
                  }`}>
                    {isReferral ? <Gift size={20} /> : isDeposit ? <Coins size={20} /> : <Sparkles size={20} />}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-extrabold text-xs text-[#0F172A] truncate">
                        {n.title}
                      </span>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#4A3AFF] shrink-0" />
                      )}
                    </div>
                    <p className="text-[12px] text-gray-600 mt-0.5 leading-snug font-medium">
                      {n.message}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-100/60 text-[10px] text-gray-400">
                      <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} &bull; {new Date(n.createdAt).toLocaleDateString()}</span>
                      {n.amount > 0 && (
                        <span className="font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          +₹{(n.amount / 100).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-gray-50 border-t border-gray-100 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;

