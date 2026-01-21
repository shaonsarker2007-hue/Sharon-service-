
import React, { useState } from 'react';
import { UserRole, User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  existingUsers: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, existingUsers }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [userId, setUserId] = useState('');
  const [fullName, setFullName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'login') {
      // Admin bypass for specific local IDs
      if (isAdmin && (userId.toLowerCase() === 'admin77' || userId.toLowerCase() === 'admin')) {
        onLogin({
          id: 'admin',
          name: 'Super Admin',
          role: UserRole.ADMIN,
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin',
          balance: 0,
          totalEarned: 0,
          joinedDate: new Date().toISOString()
        });
        return;
      }

      // Check if user exists in local storage
      const foundUser = existingUsers.find(u => 
        u.id.toLowerCase() === userId.toLowerCase().trim() || 
        u.name.toLowerCase() === userId.toLowerCase().trim()
      );
      
      if (foundUser) {
        onLogin(foundUser);
      } else {
        alert("ভুল আইডি! আপনি কি নতুন? তাহলে 'Register' বাটনে ক্লিক করে একাউন্ট খুলুন। (কোনো জিমেইল লাগে না)");
      }
    } else {
      if (fullName.trim().length < 3) {
        alert("অনুগ্রহ করে আপনার পূর্ণ নাম দিন (কমপক্ষে ৩ অক্ষর)");
        return;
      }

      const newId = 'S-' + Math.floor(1000 + Math.random() * 9000);
      const newUser: User = {
        id: newId,
        name: fullName,
        role: UserRole.MEMBER,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`,
        balance: 0,
        totalEarned: 0,
        joinedDate: new Date().toISOString()
      };
      
      alert(`একাউন্ট সফলভাবে তৈরি হয়েছে!\n\nআপনার মেম্বার আইডি: ${newId}\n\nএটি সেভ করে রাখুন। লগইন করতে এই আইডি লাগবে। কোনো জিমেইল পাসওয়ার্ড লাগবে না।`);
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/5 rounded-full blur-[120px]"></div>

      <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl p-8 md:p-12 space-y-8 animate-fadeIn relative z-10">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-600/20">
            <i className="fa-solid fa-shield-halved text-white text-2xl"></i>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Shaon IT Service</h2>
          <p className="text-slate-400 font-medium text-[10px] uppercase tracking-[0.2em] mt-2 bg-white/5 inline-block px-3 py-1 rounded-full border border-white/5">
            No Gmail Required • Local ID Login
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
          <button 
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'login' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Log In
          </button>
          <button 
            onClick={() => setMode('signup')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'signup' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {mode === 'login' ? (
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Your Worker ID</label>
              <input 
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Ex: S-1234"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50 text-white font-bold placeholder:text-slate-700"
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Enter Full Name</label>
              <input 
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50 text-white font-bold placeholder:text-slate-700"
              />
            </div>
          )}

          {mode === 'login' && (
             <div className="flex items-center gap-2 px-1">
                <input type="checkbox" id="adm" checked={isAdmin} onChange={e => setIsAdmin(e.target.checked)} className="accent-blue-500 w-4 h-4" />
                <label htmlFor="adm" className="text-[10px] text-slate-500 font-bold uppercase tracking-wider cursor-pointer">Admin Mode</label>
             </div>
          )}

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/20 active:scale-95 transition-all text-xs uppercase tracking-widest">
            {mode === 'login' ? 'Access Wallet' : 'Get Worker ID'}
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => setShowInstallGuide(true)}
            className="text-[9px] font-black text-slate-500 hover:text-emerald-500 uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <i className="fa-solid fa-mobile-screen-button"></i> ফোনে অ্যাপের মতো ব্যবহার করুন
          </button>
        </div>
      </div>

      {/* Trust Badge */}
      <div className="mt-8 flex items-center gap-4 opacity-40">
        <div className="flex items-center gap-1.5">
          <i className="fa-solid fa-lock text-[10px]"></i>
          <span className="text-[10px] font-bold uppercase">Privacy Secured</span>
        </div>
        <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
        <div className="flex items-center gap-1.5">
          <i className="fa-solid fa-server text-[10px]"></i>
          <span className="text-[10px] font-bold uppercase">No Google Account Needed</span>
        </div>
      </div>

      {/* Install Guide Modal */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 w-full max-w-sm rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-fadeInScale">
             <div className="flex justify-between items-start">
               <h3 className="text-lg font-black text-white">ইনস্টল করার নিয়ম</h3>
               <button onClick={() => setShowInstallGuide(false)} className="text-slate-500 hover:text-white p-2"><i className="fa-solid fa-xmark text-lg"></i></button>
             </div>
             
             <div className="space-y-5">
               <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                 <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2">Android (Chrome)</p>
                 <p className="text-slate-300 text-xs leading-relaxed">১. উপরে <b>তিন ডট (⋮)</b> আইকনে ক্লিক করুন।<br/>২. <b>'Install App'</b> বা <b>'Add to Home Screen'</b> ক্লিক করুন।</p>
               </div>
               
               <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                 <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-2">iPhone (Safari)</p>
                 <p className="text-slate-300 text-xs leading-relaxed">১. নিচে মাঝখানে <b>Share</b> আইকনে ক্লিক করুন।<br/>২. স্ক্রোল করে <b>'Add to Home Screen'</b> এ ক্লিক করুন।</p>
               </div>
             </div>

             <button 
               onClick={() => setShowInstallGuide(false)}
               className="w-full py-4 bg-white text-slate-900 font-black rounded-2xl text-xs uppercase tracking-widest active:scale-95 transition-all"
             >
               ঠিক আছে
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
