import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  count: number;
  percentage: number;
  icon: LucideIcon;
  colorClass: { bg: string; text: string };
}

export const StatCard: React.FC<StatCardProps> = ({ title, count, percentage, icon: Icon, colorClass }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between transition-transform hover:scale-[1.02]">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${colorClass.bg}`}>
          <Icon className={`w-6 h-6 ${colorClass.text}`} />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800">{count}</h3>
        </div>
      </div>
      <div className="text-right">
        <span className={`text-lg font-bold ${colorClass.text}`}>{percentage}%</span>
      </div>
    </div>
  );
};