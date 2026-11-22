import React from 'react';
import { ListTodo, Clock, CheckCircle2 } from 'lucide-react';
import { useTaskManager } from '../../context/TaskContext';

export const OverviewStats: React.FC = () => {
  const { stats } = useTaskManager();

  const cards = [
    {
      title: 'Total tasks',
      value: stats.total,
      subtitle: 'Across all projects',
      icon: ListTodo,
      iconContainerBg: 'bg-[#EEF2FF]',
      iconColor: 'text-[#4F46E5]',
    },
    {
      title: 'In progress',
      value: stats.inProgress,
      subtitle: 'Keep the momentum',
      icon: Clock,
      iconContainerBg: 'bg-[#E0F2FE]',
      iconColor: 'text-[#0284C7]',
    },
    {
      title: 'Completed',
      value: stats.completed,
      subtitle: `Great work this week (${stats.completionRate}%)`,
      icon: CheckCircle2,
      iconContainerBg: 'bg-[#DCFCE7]',
      iconColor: 'text-[#16A34A]',
    },
  ];

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
      aria-label="Overview Statistics"
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white rounded-2xl border border-[#F3F4F6] p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#6B7280]">
                {card.title}
              </span>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.iconContainerBg} ${card.iconColor}`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-3xl font-bold text-[#111827] tracking-tight">
                {card.value}
              </div>
              <p className="text-xs text-[#9CA3AF] mt-1">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
