
import React, { useState, useEffect } from 'react';
import { Task, Report, User, TaskStatus } from '../types';
import { WHATSAPP_NUMBER } from '../constants';

interface DashboardProps {
  tasks: Task[];
  reports: Report[];
  user: User;
  onNavigateToSubmit: () => void;
  onNavigateToWithdraw: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, reports, user, onNavigateToSubmit, onNavigateToWithdraw }) => {
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const pendingCount = reports.filter(r => r.status === TaskStatus.PENDING_VERIFICATION).length;
  const completedReports = reports.filter(r => r.status === TaskStatus.COMPLETED);

  const copyId = () => {
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareApp = async () => {
    const url = window.location.origin + window.location.pathname;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Shaon IT Service',
          text: 'Join our team and earn money!',
          url: url
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }
    } catch (err) {
      console.log('Share failed', err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      <header className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Hi, {user.name} 👋</h1>
          <p className="text-slate-500 text-sm font-medium">Your account is active & ready.</p>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={shareApp}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${shareCopied ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'}`}
          >
            <i className={`fa-solid ${shareCopied ? 'fa-check' : 'fa-share-nodes'}`}></i> {shareCopied ? 'Link Copied' : 'Share App'}
          </button>
          <div 
            onClick={copyId}
            className={`flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border-2 transition-all cursor-pointer group ${copied ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-slate-300'}`}
          >
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">My Member ID</span>
              <span className={`text-sm font-black ${copied ? 'text-emerald-600' : 'text-slate-700'}`}>{user.id}</span>
            </div>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
              <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallet Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-900/30 relative overflow-hidden flex flex-col justify-between min-h-[260px]">
          <div className="relative z-10">
            <p className="text-blue-100/80 font-bold uppercase tracking-[0.2em] text-[10px] mb-1">Available Balance</p>
            <h3 className="text-6xl font-black tracking-tighter">৳{user.balance.toFixed(2)}</h3>
          </div>
          
          <div className="relative z-10 grid grid-cols-2 gap-3 mt-8">
            <button 
              onClick={onNavigateToSubmit}
              className="bg-white text-blue-900 font-black py-4 rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 text-xs shadow-xl"
            >
              <i className="fa-solid fa-plus-circle"></i> Submit Report
            </button>
            <button 
              onClick={onNavigateToWithdraw}
              className="bg-blue-500/30 backdrop-blur-md border border-white/20 text-white font-black py-4 rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 text-xs"
            >
              <i className="fa-solid fa-money-bill-transfer"></i> Withdraw
            </button>
          </div>
          
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 text-sm">
                <i className="fa-solid fa-clock"></i>
              </div>
              <h4 className="font-black text-slate-400 uppercase text-[9px] tracking-widest">Pending</h4>
            </div>
            <p className="text-2xl font-black text-slate-900">{pendingCount}</p>
          </div>
          
          <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 text-sm">
                <i className="fa-solid fa-check"></i>
              </div>
              <h4 className="font-black text-slate-400 uppercase text-[9px] tracking-widest">Success</h4>
            </div>
            <p className="text-2xl font-black text-slate-900">{completedReports.length}</p>
          </div>
        </div>
      </div>

      {/* WhatsApp Help Section */}
      <div className="bg-white p-6 rounded-[2rem] border border-blue-100 shadow-xl shadow-blue-900/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
          <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-3xl text-white shadow-lg shadow-green-200 animate-pulse">
            <i className="fa-brands fa-whatsapp"></i>
          </div>
          <div>
            <h4 className="text-lg font-black text-slate-900">Need Help?</h4>
            <p className="text-slate-500 text-xs font-medium">Message admin for tasks or payment support.</p>
            <p className="text-blue-600 text-[10px] font-black mt-1">Admin: +{WHATSAPP_NUMBER}</p>
          </div>
        </div>
        <a 
          href={`https://wa.me/${WHATSAPP_NUMBER}`} 
          target="_blank" 
          className="w-full md:w-auto bg-slate-900 hover:bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 text-center"
        >
          Message Now
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
