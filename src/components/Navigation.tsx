import React from 'react';
import { PlayerEmpire } from '../types';
import { Dna, Factory, FileCheck, Trophy, Landmark } from 'lucide-react';
import { playSound } from '../utils/audio';

interface NavigationProps {
  activeTab: PlayerEmpire['activeTab'];
  onChangeTab: (tab: PlayerEmpire['activeTab']) => void;
  readyHarvestsCount: number;
  readyCraftsCount: number;
  readyContractsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onChangeTab,
  readyHarvestsCount,
  readyCraftsCount,
  readyContractsCount
}) => {
  const tabs = [
    {
      id: 'sanctuary' as const,
      label: 'المحمية والوراثة',
      englishLabel: 'Sanctuary & DNA',
      icon: Dna,
      badge: readyHarvestsCount,
      badgeColor: 'bg-emerald-500'
    },
    {
      id: 'workshops' as const,
      label: 'مجمع الورش والمصانع',
      englishLabel: 'Workshops & Mills',
      icon: Factory,
      badge: readyCraftsCount,
      badgeColor: 'bg-amber-500'
    },
    {
      id: 'export_board' as const,
      label: 'عقود التصدير الملكية',
      englishLabel: 'Royal Orders',
      icon: FileCheck,
      badge: readyContractsCount,
      badgeColor: 'bg-purple-500'
    },
    {
      id: 'tournaments' as const,
      label: 'حلبات البطولات',
      englishLabel: 'Championships',
      icon: Trophy,
      badge: 0
    },
    {
      id: 'market' as const,
      label: 'البورصة والمزادات',
      englishLabel: 'Market & Exchange',
      icon: Landmark,
      badge: 0
    }
  ];

  return (
    <nav className="w-full bg-slate-900/95 border-b border-slate-800 px-2 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-start gap-1 sm:gap-3 overflow-x-auto py-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                playSound('click');
                onChangeTab(tab.id);
              }}
              className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-600/20 text-amber-200 border border-amber-500/40 shadow-lg shadow-amber-950/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>

              {/* Badge for ready actions */}
              {tab.badge > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] text-white font-mono font-bold animate-pulse ${tab.badgeColor}`}>
                  {tab.badge}
                </span>
              )}

              {isActive && (
                <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
