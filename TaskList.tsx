
import React from 'react';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onSelectTask }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold">Available Visit Tasks</h2>
        <p className="text-slate-500">Select a task and follow guidelines. Earnings are in Taka (৳).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => (
          <div 
            key={task.id} 
            className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                Website Visit
              </span>
              <div className="text-emerald-600 font-black text-lg">
                ৳{task.rewardAmount}
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mb-2">
              {task.title}
            </h3>
            <p className="text-slate-500 text-sm mb-6 line-clamp-2">
              {task.description}
            </p>
            
            <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">ID: {task.id}</span>
              <button 
                onClick={() => onSelectTask(task)}
                className="bg-slate-900 text-white hover:bg-emerald-600 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              >
                Submit Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
