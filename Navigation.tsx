
import React from 'react';
import { UserRole } from '../types';
import { WHATSAPP_NUMBER } from '../constants';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, role }) => {
  // Common items for everyone
  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: 'fa-house' },
    { id: 'submit', label: 'Submit', icon: 'fa-plus-circle' },
    { id: 'reports', label: 'History', icon: 'fa-clock-rotate-left' },
    { id: 'payouts', label: 'Cash', icon: 'fa-wallet' },
  ];

  // Admin specific item - strictly conditional
  if (role === UserRole.ADMIN) {
    menuItems.push({ id: 'admin', label: 'Admin', icon: 'fa-user-shield' });
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 h-screen bg-slate-900 text-slate-300 flex-col fixed left-0 top-0 shadow-xl z-50">
        <div className="p-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-bolt text-white text-lg"></i>
          </div>
          <span className="text-xl font-black text-white tracking-tighter uppercase">TASKFLOW<span className="text-emerald-500">.</span></span>
        </div>

        <nav className="flex-1 mt-2 px-6 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group ${
                activeTab === item.id
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5 text-center transition-transform group-hover:scale-110`}></i>
              <span className="font-bold text-[13px] uppercase tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-8">
          <div className="bg-slate-800/50 p-5 rounded-3xl border border-slate-700/50">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-3">Support</p>
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}`} 
              target="_blank" 
              className="flex items-center gap-3 group"
            >
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <i className="fa-brands fa-whatsapp"></i>
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] block font-bold text-white truncate">WhatsApp Admin</span>
                <span className="text-[8px] text-slate-500 block">Online Support</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-[100] pb-safe shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-20 px-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative ${
                activeTab === item.id ? 'text-emerald-600 scale-110' : 'text-slate-400'
              }`}
            >
              <div className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-all ${
                activeTab === item.id ? 'bg-emerald-50' : 'bg-transparent'
              }`}>
                <i className={`fa-solid ${item.icon} text-lg`}></i>
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
              {activeTab === item.id && (
                <div className="absolute -top-2 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;
