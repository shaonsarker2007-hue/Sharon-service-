
import React, { useState } from 'react';
import { Task } from '../types';

interface TaskSubmissionProps {
  activeCampaigns: Task[];
  onCancel: () => void;
  onSubmit: (report: any) => void;
}

const TaskSubmission: React.FC<TaskSubmissionProps> = ({ activeCampaigns, onCancel, onSubmit }) => {
  const [formData, setFormData] = useState({
    workerName: '',
    workLink: '',
    visitCount: 0,
    workDate: new Date().toISOString().split('T')[0],
    taskId: activeCampaigns[0]?.id || '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.taskId) {
      alert("Please select a valid Task ID.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      onSubmit(formData);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Report Work</h2>
          <p className="text-slate-500 font-medium">হোয়াটসঅ্যাপের কাজের বিস্তারিত এখানে জমা দিন।</p>
        </div>
        <button 
          onClick={onCancel}
          className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all shadow-sm"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Work ID / Campaign</label>
            <select 
              required
              value={formData.taskId}
              onChange={(e) => setFormData({...formData, taskId: e.target.value})}
              className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-700"
            >
              <option value="" disabled>Select Task ID</option>
              {activeCampaigns.map(t => <option key={t.id} value={t.id}>{t.title} ({t.id})</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Your Full Name</label>
            <input 
              required
              value={formData.workerName}
              onChange={(e) => setFormData({...formData, workerName: e.target.value})}
              placeholder="e.g. Rohim Uddin"
              className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Website Link (URL)</label>
            <input 
              required
              type="url"
              value={formData.workLink}
              onChange={(e) => setFormData({...formData, workLink: e.target.value})}
              placeholder="https://example.com/..."
              className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Visit Count (সংখ্যা)</label>
            <input 
              required
              type="number"
              min="1"
              value={formData.visitCount || ''}
              onChange={(e) => setFormData({...formData, visitCount: parseInt(e.target.value) || 0})}
              placeholder="50"
              className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-700"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Work Date (তারিখ)</label>
          <input 
            required
            type="date"
            value={formData.workDate}
            onChange={(e) => setFormData({...formData, workDate: e.target.value})}
            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold text-slate-700"
          />
        </div>

        <div className="pt-4">
          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin text-xl"></i> : 'Submit Report'}
          </button>
          <p className="text-center text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest">
            Note: Incorrect data may lead to balance reduction.
          </p>
        </div>
      </form>
    </div>
  );
};

export default TaskSubmission;
