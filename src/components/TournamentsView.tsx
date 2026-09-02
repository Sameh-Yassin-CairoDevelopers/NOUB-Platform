import React, { useState } from 'react';
import { Creature, Tournament } from '../types';
import { calculateOverallGeneticScore, RARITY_COLORS } from '../utils/genetics';
import { Trophy, Swords, Sparkles, Award, Shield, Coins, Star, CheckCircle2, ChevronRight } from 'lucide-react';
import { playSound } from '../utils/audio';

interface TournamentsViewProps {
  tournaments: Tournament[];
  creatures: Creature[];
  gold: number;
  onEnterTournament: (tournament: Tournament, selectedCreature: Creature) => void;
}

export const TournamentsView: React.FC<TournamentsViewProps> = ({
  tournaments,
  creatures,
  gold,
  onEnterTournament
}) => {
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(tournaments[0] || null);
  const [selectedCreatureId, setSelectedCreatureId] = useState<string>('');

  const activeTourney = selectedTournament || tournaments[0];
  const eligibleCreatures = creatures.filter(c => c.species === activeTourney?.requiredSpecies);
  const chosenCreature = creatures.find(c => c.id === selectedCreatureId);

  const canAfford = activeTourney ? gold >= activeTourney.entryFeeGold : false;

  return (
    <div className="space-y-6">
      
      {/* Tournaments Hub Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                حلبات البطولات العالمية الرسمية
              </span>
              <span className="text-xs text-slate-400">
                • كؤوس Sieger الألمانية والشقب الذهبي
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-100">
              ميادين التنافس وإثبات نقاء وقوة السلالات
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              اختر بطلك الأقوى جينياً ومظهرياً، وجهّزه بمعدات الورش للمنافسة على الألقاب العالمية والجوائز النقدية والنجوم.
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-amber-500/30 text-center">
            <div className="text-[10px] text-amber-400 font-bold uppercase">سجل البطولات المفتوحة</div>
            <div className="text-xl font-black text-yellow-300 font-mono">
              4 حلبات دولية
            </div>
          </div>
        </div>
      </div>

      {/* Arena Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {tournaments.map(t => {
          const isSelected = activeTourney?.id === t.id;

          return (
            <button
              key={t.id}
              onClick={() => {
                playSound('click');
                setSelectedTournament(t);
                setSelectedCreatureId('');
              }}
              className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-950/40 border-amber-400 text-amber-100 shadow-xl shadow-amber-950/50'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-3xl">{t.icon}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[10px] border border-slate-800 font-bold">
                    {t.difficulty}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-black text-slate-100 leading-snug">{t.title}</h3>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{t.subtitle}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-yellow-400 font-bold">+{t.prizeGold} 🪙</span>
                <span className="text-amber-300">+{t.prizeStars}⭐</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Tournament Arena Details & Registration */}
      {activeTourney && (
        <div className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6">
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-4xl">
                {activeTourney.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-amber-100">
                    {activeTourney.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
                    {activeTourney.difficulty}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{activeTourney.description}</p>
              </div>
            </div>

            {/* Prize Card */}
            <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/30 flex items-center gap-4 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">رسوم التسجيل</span>
                <span className="font-bold text-slate-300">{activeTourney.entryFeeGold} ذهب</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">الجائزة المالية</span>
                <span className="font-bold text-yellow-400">+{activeTourney.prizeGold} 🪙</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">النجوم المكتسبة</span>
                <span className="font-bold text-amber-300">+{activeTourney.prizeStars} ⭐</span>
              </div>
            </div>
          </div>

          {/* Candidate Creature Selector */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>اختر مرشح المحمية لخوض المنافسة:</span>
              <span className="text-[10px] text-slate-500">
                المؤهلين: {eligibleCreatures.length} كائنات
              </span>
            </h4>

            {eligibleCreatures.length === 0 ? (
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center text-slate-500 text-xs">
                لا يوجد لديك كائنات من هذه الفئة حالياً في المحمية. استورد أو ولّد كائناً جديداً من تبويب المحمية.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {eligibleCreatures.map(c => {
                  const score = calculateOverallGeneticScore(c.dna);
                  const isSelected = selectedCreatureId === c.id;
                  const rarityStyle = RARITY_COLORS[c.rarity];

                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        playSound('click');
                        setSelectedCreatureId(c.id);
                      }}
                      className={`p-3 rounded-xl border text-right transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-amber-950/60 border-amber-400 text-amber-100 shadow-lg'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl p-1 border ${rarityStyle.border} bg-gradient-to-b ${c.avatarBg} flex items-center justify-center text-2xl`}>
                        {c.imageIcon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-slate-100 truncate">{c.name}</h5>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{c.breedName}</p>
                        <div className="flex items-center gap-2 text-[10px] mt-1 font-mono">
                          <span className="text-amber-400">تقييم: {score}</span>
                          <span className="text-emerald-400">انتصارات: {c.stats.wins}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Launch Bar */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-400">
              {chosenCreature ? (
                <span>
                  المرشح المعتمد: <strong className="text-amber-300">{chosenCreature.name}</strong> (التقييم الجيني: {calculateOverallGeneticScore(chosenCreature.dna)})
                </span>
              ) : (
                <span>يرجى اختيار كائن لخوض غمار المسابقة</span>
              )}
            </div>

            <button
              onClick={() => {
                if (chosenCreature && canAfford) {
                  onEnterTournament(activeTourney, chosenCreature);
                } else {
                  playSound('error');
                }
              }}
              disabled={!chosenCreature || !canAfford}
              className={`px-8 py-3 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                chosenCreature && canAfford
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-xl shadow-amber-500/30 hover:scale-105'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>دخول الحلبة الرسمية ({activeTourney.entryFeeGold} ذهب) ⚔️</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
