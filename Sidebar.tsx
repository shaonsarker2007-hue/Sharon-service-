import React from 'react';
import { UserRole } from '../types';
import { WHATSAPP_NUMBER } from '../constants';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, role }) => {
  const menuItems = [
    { id: 'dashboard', label: 'My Wallet', icon: 'fa-wallet' },
    { id: 'submit', label: 'Submit Work', icon: 'fa-paper-plane' },
    { id: 'reports', label: 'History', icon: 'fa-clock-rotate-left' },
    { id: 'payouts', label: 'Withdrawal', icon: 'fa-money-bill-transfer' },
  ];

  if (role === UserRole.ADMIN) {
    menuItems.push({ id: 'admin', label: 'Admin Panel', icon: 'fa-user-shield' });
  }

  return (
    <div className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col fixed left-0 top-0 shadow-xl z-50">
      <div className="p-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
          <i className="fa-solid fa-chart-line text-white text-lg"></i>
        </div>
        <span className="text-xl font-black text-white tracking-tighter uppercase">TaskFlow<span className="text-emerald-500">.</span></span>
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
          <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-3">Daily Task</p>
          <a 
            href={`https://wa.me/${WHATSAPP_NUMBER}`} 
            target="_blank" 
            className="flex items-center gap-3 group"
          >
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <i className="fa-brands fa-whatsapp"></i>
            </div>
            <span className="text-xs font-bold text-white">Get Links</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
