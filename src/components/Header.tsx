import React from 'react';
import { PlayerEmpire } from '../types';
import { Sparkles, Volume2, VolumeX, FastForward, Trophy, Coins, Star, Award } from 'lucide-react';
import { playSound } from '../utils/audio';

interface HeaderProps {
  empire: PlayerEmpire;
  onToggleSound: () => void;
  onToggleSpeed: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ empire, onToggleSound, onToggleSpeed, onReset }) => {
  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-amber-500/20 sticky top-0 z-40 px-3 sm:px-6 py-2.5 shadow-xl shadow-black/40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Dynasty Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center text-slate-950 font-bold text-xl">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-wide text-amber-100 flex items-center gap-1.5">
                {empire.name}
              </h1>
              <span className="hidden sm:inline-flex text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
                المستوى {empire.fameLevel}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <span>{empire.dynastyTitle}</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-medium">سجل الأنساب الملكي نشط</span>
            </p>
          </div>
        </div>

        {/* Resources & Status Bar */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
          
          {/* Gold */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-amber-500/30 shadow-inner">
            <Coins className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span className="font-mono font-bold text-amber-200">
              {empire.gold.toLocaleString()}
            </span>
            <span className="text-slate-400 text-[10px]">ذهب</span>
          </div>

          {/* Stars / Reputation */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-yellow-500/30 shadow-inner">
            <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span className="font-mono font-bold text-yellow-200">
              {empire.stars.toLocaleString()}
            </span>
            <span className="text-slate-400 text-[10px]">نجمة</span>
          </div>

          {/* Fame / XP Progress */}
          <div className="hidden md:flex flex-col gap-1 w-28 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-700">
            <div className="flex justify-between text-[10px] text-slate-300">
              <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-purple-400" /> الشهرة</span>
              <span className="font-mono">{empire.fameXp}/{empire.fameXpMax}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-amber-400 transition-all duration-300"
                style={{ width: `${Math.min(100, (empire.fameXp / empire.fameXpMax) * 100)}%` }}
              />
            </div>
          </div>

          {/* 89x Acceleration Indicator */}
          <button
            onClick={() => {
              playSound('click');
              onToggleSpeed();
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-all ${
              empire.isSpeedActive 
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/20' 
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="تسريع محاكاة الزمن الوراثي بـ 89 ضعفاً"
          >
            <FastForward className={`w-3.5 h-3.5 ${empire.isSpeedActive ? 'animate-bounce' : ''}`} />
            <span className="font-mono font-black text-xs">89×</span>
            <span className="hidden xl:inline text-[10px]">تسريع جيني</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              if (!empire.soundEnabled) playSound('click');
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title={empire.soundEnabled ? 'كتم الصوت' : 'تشغيل المؤثرات الصوتية'}
          >
            {empire.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Reset button */}
          <button
            onClick={() => {
              if (window.confirm('هل تريد إعادة تعيين المحمية إلى الحالة الابتدائية؟')) {
                onReset();
              }
            }}
            className="hidden sm:inline-flex text-[11px] text-slate-500 hover:text-rose-400 transition-colors px-1"
            title="إعادة تعيين المحمية"
          >
            إعادة
          </button>

        </div>

      </div>
    </header>
  );
};
