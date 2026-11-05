import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, CirclePlus, LayoutGrid, User, Wallet, Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import NotificationModal from '../components/NotificationModal';

const CustomerLayout = () => {
  const location = useLocation();
  const { unreadCount } = useNotifications();
  const [showNotifModal, setShowNotifModal] = useState(false);

  const isGame = location.pathname === '/color-game' || location.pathname === '/aviator';

  return (
    <div className={`flex min-h-screen flex-col ${isGame ? 'bg-[#0B0F19]' : 'bg-[#FFFBF9]'}`}>
      {/* Top Header - Hide on Home and Game pages */}
      {location.pathname !== '/' && !isGame && (
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-5 py-3.5 text-[#18181B] border-b border-orange-100/70 shadow-[0_2px_12px_rgba(249,115,22,0.04)]">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-tr from-[#EA580C] via-[#F97316] to-[#EF4444] rounded-xl flex items-center justify-center shadow-md shadow-orange-500/25">
                <Wallet size={19} className="text-white" fill="currentColor" />
              </div>
              <h1 className="text-xl font-black text-[#18181B] tracking-tight">Earn<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EA580C] to-[#EF4444]">Buddy</span></h1>
            </div>
            
            {/* Notification Bell */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowNotifModal(true)}
                className="relative w-9 h-9 rounded-xl bg-orange-50/60 hover:bg-orange-100/60 flex items-center justify-center text-zinc-700 transition cursor-pointer border border-orange-200/50"
                aria-label="Open notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white border-2 border-white shadow-xs animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${isGame || location.pathname === '/' ? '' : 'p-4 pb-32'}`}>
        <div className={isGame ? 'w-full' : 'mx-auto max-w-5xl'}>
          <Outlet />
        </div>
      </main>

      {/* Global Notification Modal */}
      <NotificationModal 
        isOpen={showNotifModal} 
        onClose={() => setShowNotifModal(false)} 
      />

      {/* Bottom Navigation: Modern Floating Pill Island */}
      {location.pathname !== '/color-game' && location.pathname !== '/aviator' && (() => {
        const getActiveIndex = () => {
          const path = location.pathname;
          if (path === '/') return 0;
          if (path.startsWith('/plans')) return 1;
          if (path.startsWith('/add-cash') || path.startsWith('/wallet')) return 2;
          if (path.startsWith('/services')) return 3;
          if (path.startsWith('/profile')) return 4;
          return 0;
        };

        const activeIdx = getActiveIndex();

        const navItems = [
          { name: 'Home', path: '/', icon: Home },
          { name: 'Products', path: '/plans', icon: ShoppingBag },
          { name: 'Add Cash', path: '/add-cash', icon: CirclePlus, isAction: true },
          { name: 'Services', path: '/services', icon: LayoutGrid },
          { name: 'Profile', path: '/profile', icon: User },
        ];

        return (
          <nav className="fixed bottom-3 sm:bottom-4 left-0 right-0 z-50 flex justify-center px-3 sm:px-4 pointer-events-none pb-safe">
            <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl border border-orange-200/70 shadow-[0_12px_36px_rgba(234,88,12,0.18)] rounded-[26px] p-1.5 pointer-events-auto flex items-center justify-between select-none">
              
              {navItems.map((item, idx) => {
                const isActive = idx === activeIdx;
                const Icon = item.icon;

                // Center Highlight "Add Cash" Action Button
                if (item.isAction) {
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="group relative -top-3 flex flex-col items-center justify-center shrink-0 transition-transform active:scale-95"
                    >
                      <div className={`w-13 h-13 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                        isActive
                          ? 'bg-gradient-to-tr from-[#EA580C] via-[#F97316] to-[#EF4444] text-white shadow-orange-500/40 ring-4 ring-white'
                          : 'bg-gradient-to-tr from-[#EA580C] to-[#EF4444] text-white shadow-orange-500/30 group-hover:scale-105'
                      }`}>
                        <Icon size={24} strokeWidth={2.5} />
                      </div>
                      <span className={`text-[10px] font-black tracking-tight mt-1 ${
                        isActive ? 'text-[#EA580C]' : 'text-zinc-600'
                      }`}>
                        {item.name}
                      </span>
                    </Link>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`relative flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 active:scale-95 ${
                      isActive
                        ? 'bg-gradient-to-b from-orange-50 to-orange-100/60 text-[#EA580C]'
                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-orange-50/30'
                    }`}
                  >
                    <div className="relative">
                      <Icon size={21} strokeWidth={isActive ? 2.6 : 2} />
                      {isActive && (
                        <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-ping" />
                      )}
                    </div>
                    <span className={`text-[10px] sm:text-[10.5px] tracking-tight mt-1 leading-none ${
                      isActive ? 'font-black text-[#EA580C]' : 'font-bold'
                    }`}>
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>
        );
      })()}

      {/* Desktop Sidebar (Optional, but keeping it simple for now) */}
    </div>
  );
};

export default CustomerLayout;
