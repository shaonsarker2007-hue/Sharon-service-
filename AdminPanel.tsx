
import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, Report, PayoutRequest, PayoutStatus, User, UserRole } from '../types';
import { BASE_REWARD_RATE } from '../constants';
import { GoogleGenAI } from "@google/genai";

interface AdminPanelProps {
  tasks: Task[];
  reports: Report[];
  payouts: PayoutRequest[];
  users: User[];
  onAddTask: (task: Task) => void;
  onVerifyReport: (reportId: string, status: TaskStatus, amount?: number) => void;
  onManagePayout: (payoutId: string, status: PayoutStatus) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ tasks, reports, payouts, users, onAddTask, onVerifyReport, onManagePayout }) => {
  const [subTab, setSubTab] = useState<'reports' | 'payouts' | 'members' | 'chat' | 'settings'>('reports');
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(BASE_REWARD_RATE);
  const [copied, setCopied] = useState(false);
  const [appUrl, setAppUrl] = useState('');
  
  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Detect current URL reliably
    const url = window.location.origin + window.location.pathname;
    setAppUrl(url);
  }, []);

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("ম্যানুয়ালি লিংকটি কপি করুন: " + appUrl);
    }
  };

  const shareViaWhatsApp = () => {
    const message = encodeURIComponent(
      `আসসালামু আলাইকুম,\nShaon IT Service-এ কাজ শুরু করুন। এখানে জিমেইল ছাড়াই একাউন্ট খোলা যায়।\n\nলিংক:\n${appUrl}\n\nএকাউন্ট খোলার পর আপনার Worker ID টি সেভ করে রাখুন।`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, {role: 'user', text: userMsg}]);
    setChatInput('');
    setIsTyping(true);

    try {
      // Fix: Initializing GoogleGenAI using process.env.API_KEY directly as per guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Context: Business manager for TaskFlow Pro. Stats: ${users.length} members, ${reports.length} reports. Query: ${userMsg}`,
      });
      // Fix: Using response.text property directly
      setChatMessages(prev => [...prev, {role: 'bot', text: response.text || "No response."}]);
    } catch (err) {
      setChatMessages(prev => [...prev, {role: 'bot', text: "AI Service Error."}]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCreateTask = () => {
    if (!title) return;
    const newTask: Task = {
      id: 'TASK-' + Math.floor(Math.random() * 900 + 100),
      title: title,
      description: `৳${amount.toFixed(2)} per visit.`,
      rewardAmount: amount,
      status: TaskStatus.OPEN,
      createdAt: new Date().toISOString(),
      guidelines: ["Must stay 60s", "WhatsApp proof only", "No duplication"]
    };
    onAddTask(newTask);
    setShowCreate(false);
    setTitle('');
  };

  const pendingReports = reports.filter(r => r.status === TaskStatus.PENDING_VERIFICATION);
  const pendingPayouts = payouts.filter(p => p.status === PayoutStatus.PENDING);
  // Fix: Using UserRole enum for type safety and consistency
  const teamMembers = users.filter(u => u.role !== UserRole.ADMIN);

  return (
    <div className="space-y-6 animate-fadeInScale max-w-6xl mx-auto pb-24">
      {/* Invite & Quick Stats Section */}
      <div className="bg-slate-800 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-black text-white">Admin Control Center</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Management & Invitations</p>
          </div>
          <div className="flex flex-wrap gap-3">
             <button onClick={shareViaWhatsApp} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-6 rounded-2xl flex items-center gap-2 text-xs transition-all shadow-lg shadow-emerald-900/20">
              <i className="fa-brands fa-whatsapp text-lg"></i> Send Invite
            </button>
            <button onClick={() => setShowCreate(true)} className="bg-white hover:bg-slate-100 text-slate-900 font-black py-4 px-6 rounded-2xl text-xs transition-all shadow-lg">
              <i className="fa-solid fa-plus mr-2"></i> Create Task
            </button>
          </div>
        </div>

        {/* Invite Link Display Box */}
        <div className="bg-slate-900/50 rounded-2xl p-4 border border-white/5 flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1 ml-1">Your App Link (Share this with workers)</label>
            <div className="bg-black/20 p-3 rounded-xl border border-white/5 text-xs text-slate-400 font-mono truncate select-all">
              {appUrl}
            </div>
          </div>
          <button 
            onClick={copyInviteLink} 
            className={`w-full md:w-auto px-8 py-3.5 rounded-xl font-black text-xs uppercase transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
          >
            {copied ? <><i className="fa-solid fa-check mr-2"></i> Copied</> : <><i className="fa-solid fa-copy mr-2"></i> Copy Link</>}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-white/5 overflow-x-auto no-scrollbar py-2">
        {[
          { id: 'reports', label: 'Reports', icon: 'fa-file-invoice' },
          { id: 'payouts', label: 'Payouts', icon: 'fa-money-bill-transfer' },
          { id: 'members', label: 'Members', icon: 'fa-users' },
          { id: 'chat', label: 'AI Manager', icon: 'fa-robot' }
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setSubTab(tab.id as any)} 
            className={`flex items-center gap-2 pb-4 px-6 text-[10px] font-black uppercase tracking-widest transition-all relative ${subTab === tab.id ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <i className={`fa-solid ${tab.icon}`}></i>
            {tab.label}
            {subTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500 rounded-full"></div>}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-slate-900/30 backdrop-blur-md rounded-[2.5rem] border border-white/5 min-h-[400px] overflow-hidden">
        {subTab === 'reports' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/5 text-slate-500 text-[9px] uppercase font-black tracking-widest">
                <tr><th className="px-8 py-6">Worker Info</th><th className="px-8 py-6">Submission Details</th><th className="px-8 py-6 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pendingReports.length === 0 ? <tr><td colSpan={3} className="py-24 text-center text-slate-600 font-black uppercase tracking-widest text-xs">No pending reports for review</td></tr> : 
                  pendingReports.map(report => (
                    <tr key={report.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-8 py-6">
                        <div className="text-white font-black text-sm">{report.workerName}</div>
                        <div className="text-[10px] text-slate-500 font-bold">ID: {report.userId}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-emerald-400 font-black text-sm">{report.visitCount} Visits</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[200px]">{report.workLink}</div>
                      </td>
                      <td className="px-8 py-6 text-right space-x-3">
                        <button onClick={() => onVerifyReport(report.id, TaskStatus.COMPLETED)} className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white text-[9px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all">Approve</button>
                        <button onClick={() => onVerifyReport(report.id, TaskStatus.REJECTED)} className="bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white text-[9px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all">Reject</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {subTab === 'payouts' && (
          <div className="p-8 text-center text-slate-500">
             <i className="fa-solid fa-receipt text-4xl mb-4 opacity-20"></i>
             <p className="text-xs font-black uppercase tracking-widest">Payout management module</p>
             <p className="text-[10px] mt-2">Check 'Payouts' data in database.</p>
          </div>
        )}

        {subTab === 'chat' && (
          <div className="flex flex-col h-[500px]">
             <div className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-[10px] text-emerald-500 font-bold uppercase tracking-widest text-center">
                  AI Manager: Business analytics and support active.
                </div>
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-emerald-600 text-white font-bold' : 'bg-white/10 text-slate-300'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && <div className="text-[10px] font-black text-emerald-500 animate-pulse uppercase tracking-[0.2em]">AI is analyzing data...</div>}
             </div>
             <form onSubmit={handleChat} className="p-6 bg-black/20 border-t border-white/5 flex gap-3">
               <input value={chatInput} onChange={e => setChatInput(e.target.value)} className="flex-1 bg-white/5 p-4 rounded-2xl text-white outline-none focus:border-emerald-500/50 border border-transparent transition-all text-sm" placeholder="Ask about member stats, total reports..." />
               <button className="bg-emerald-600 hover:bg-emerald-500 text-white w-14 h-14 rounded-2xl shadow-lg transition-all flex items-center justify-center"><i className="fa-solid fa-paper-plane"></i></button>
             </form>
          </div>
        )}

        {subTab === 'members' && (
          <div className="p-8 space-y-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Active Team ({teamMembers.length})</h4>
            {teamMembers.map(m => (
              <div key={m.id} className="flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                <div>
                   <div className="text-white font-black text-sm">{m.name}</div>
                   <div className="text-[10px] text-slate-500 font-bold uppercase">ID: {m.id}</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-black text-sm">৳{m.balance.toFixed(2)}</div>
                  <div className="text-[9px] text-slate-500 font-bold uppercase">Balance</div>
                </div>
              </div>
            ))}
            {teamMembers.length === 0 && <div className="text-center py-20 text-slate-600 text-xs font-black uppercase tracking-widest">No members registered yet</div>}
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
           <div className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] w-full max-w-md shadow-2xl animate-fadeInScale">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-white">New Work Entry</h3>
                <button onClick={() => setShowCreate(false)} className="text-slate-500 hover:text-white"><i className="fa-solid fa-xmark text-lg"></i></button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-2">Campaign Name</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-emerald-500/50" placeholder="e.g. Website Visit Task" />
                </div>
                
                <div>
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-2">Reward Amount (৳)</label>
                  <input type="number" step="0.01" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-emerald-500/50" />
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button onClick={() => setShowCreate(false)} className="flex-1 text-slate-500 font-black text-xs uppercase tracking-widest">Cancel</button>
                <button onClick={handleCreateTask} className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/20">Create Task</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
