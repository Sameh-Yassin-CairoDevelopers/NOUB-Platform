import React, { useState } from 'react';
import { Creature, ResourceItem, SpeciesType } from '../types';
import { calculateOverallGeneticScore, RARITY_COLORS, SPECIES_METADATA } from '../utils/genetics';
import { Dna, Plus, Heart, Sparkles, Award, ShieldCheck, Leaf, Clock, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { playSound } from '../utils/audio';

interface SanctuaryViewProps {
  creatures: Creature[];
  onOpenPassport: (creature: Creature) => void;
  onOpenBreeding: (creature?: Creature) => void;
  onHarvestCreature: (creatureId: string) => void;
  onAdoptNewCreature: (species: SpeciesType) => void;
  gold: number;
}

export const SanctuaryView: React.FC<SanctuaryViewProps> = ({
  creatures,
  onOpenPassport,
  onOpenBreeding,
  onHarvestCreature,
  onAdoptNewCreature,
  gold
}) => {
  const [activeSpeciesFilter, setActiveSpeciesFilter] = useState<'all' | SpeciesType>('all');

  const filteredCreatures = activeSpeciesFilter === 'all'
    ? creatures
    : creatures.filter(c => c.species === activeSpeciesFilter);

  const speciesTabs: { id: 'all' | SpeciesType; label: string; icon: string }[] = [
    { id: 'all', label: 'كافة الكائنات والأشجار', icon: '🐾' },
    { id: 'dog', label: 'الكلاب النخبة', icon: '🐕' },
    { id: 'horse', label: 'الخيول الأصيلة', icon: '🐎' },
    { id: 'plant', label: 'البونساي والأعشاب', icon: '🌿' },
    { id: 'pigeon', label: 'الزاجل الأولمبي', icon: '🕊️' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                محرك تسريع النمو 89× نشط
              </span>
              <span className="text-xs text-slate-400">
                • إجمالي الكائنات: <strong className="text-amber-300 font-mono">{creatures.length}</strong>
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-100">
              مأوى السلالات الملكية وبنك الجينات
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              تنتج كائناتك موارد بيولوجية نقية (عينات DNA، أسمدة، أزهار لافندر، ريش ملاحة) تُستخدم في ورش التايكون وصناعة الأعلاف الفاخرة.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                playSound('click');
                onOpenBreeding();
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition-all hover:scale-105"
            >
              <Heart className="w-4 h-4 fill-white" />
              مختبر التزاوج الوراثي
            </button>

            {/* Adopt Dropdown/Button */}
            <div className="relative group">
              <button
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all"
              >
                <Plus className="w-4 h-4" />
                استيراد سلالة جديدة (500 ذهب)
              </button>
              
              {/* Dropdown Options */}
              <div className="absolute left-0 mt-1 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 hidden group-hover:block z-30">
                <button
                  onClick={() => onAdoptNewCreature('dog')}
                  className="w-full text-right px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center justify-between"
                >
                  <span>🐕 جرو راعي ألماني</span>
                  <span className="font-mono text-amber-400 text-[10px]">500 🪙</span>
                </button>
                <button
                  onClick={() => onAdoptNewCreature('horse')}
                  className="w-full text-right px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center justify-between"
                >
                  <span>🐎 مهر عربي أصيل</span>
                  <span className="font-mono text-amber-400 text-[10px]">800 🪙</span>
                </button>
                <button
                  onClick={() => onAdoptNewCreature('plant')}
                  className="w-full text-right px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center justify-between"
                >
                  <span>🌿 شتلة بونساي معمرة</span>
                  <span className="font-mono text-amber-400 text-[10px]">350 🪙</span>
                </button>
                <button
                  onClick={() => onAdoptNewCreature('pigeon')}
                  className="w-full text-right px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center justify-between"
                >
                  <span>🕊️ فرخ زاجل أولمبي</span>
                  <span className="font-mono text-amber-400 text-[10px]">400 🪙</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {speciesTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              playSound('click');
              setActiveSpeciesFilter(tab.id);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSpeciesFilter === tab.id
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/50 shadow-md shadow-amber-950/40'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Creatures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCreatures.map((c) => {
          const score = calculateOverallGeneticScore(c.dna);
          const rarityStyle = RARITY_COLORS[c.rarity];
          const now = Date.now();
          const elapsedSec = (now - c.harvest.lastHarvestTimestamp) / 1000;
          const isHarvestReady = elapsedSec >= c.harvest.intervalSec;
          const harvestProgress = Math.min(100, (elapsedSec / c.harvest.intervalSec) * 100);

          return (
            <div
              key={c.id}
              className={`bg-slate-900/90 border-2 ${rarityStyle.border} rounded-2xl p-4 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-amber-400/60 transition-all`}
            >
              {/* Top Row: Tag & Gender & Rarity */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${rarityStyle.bg} ${rarityStyle.text} ${rarityStyle.border}`}>
                    {c.rarity}
                  </span>

                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-slate-400 font-mono">الجيل #{c.lineage.generation}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-300 font-bold">
                      {c.gender === 'M' ? 'ذكر ♂' : c.gender === 'F' ? 'أنثى ♀' : 'نبات 🌿'}
                    </span>
                  </div>
                </div>

                {/* Creature Avatar & Main Info */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-16 h-16 rounded-2xl p-1 border ${rarityStyle.border} bg-gradient-to-b ${c.avatarBg} flex items-center justify-center text-3xl shadow-inner`}>
                    {c.imageIcon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-black text-slate-100 truncate group-hover:text-amber-200 transition-colors">
                      {c.name}
                    </h3>
                    <p className="text-xs text-slate-400 truncate">
                      {c.breedName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                        <Dna className="w-3 h-3" />
                        نقاء {c.dna.geneticPurity}%
                      </span>
                      <span className="text-[10px] text-amber-300 font-mono font-bold">
                        ⭐ التقييم: {score}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mini Stat Bars */}
                <div className="grid grid-cols-3 gap-1.5 bg-slate-950/70 p-2 rounded-xl border border-slate-800/80 mb-3 text-[10px]">
                  <div className="text-center">
                    <span className="text-slate-500 block">الدافع</span>
                    <span className="font-mono font-bold text-amber-300">{c.dna.drive}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-slate-500 block">الهيكل</span>
                    <span className="font-mono font-bold text-blue-300">{c.dna.stature}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-slate-500 block">التحمل</span>
                    <span className="font-mono font-bold text-emerald-300">{c.dna.stamina}</span>
                  </div>
                </div>

                {/* Titles snippet */}
                {c.titles.length > 0 && (
                  <div className="mb-3">
                    <span className="text-[10px] text-amber-400/90 font-bold flex items-center gap-1">
                      <Award className="w-3 h-3 text-yellow-400" />
                      {c.titles[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Harvest & Actions Bar */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                
                {/* Harvest countdown bar & trigger */}
                <div className="bg-slate-950/90 p-2 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-slate-400 flex items-center gap-1">
                        <span>{c.harvest.icon}</span>
                        {c.harvest.resourceName}
                      </span>
                      <span className="font-mono text-emerald-400 font-bold">+{c.harvest.yieldAmount}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                        style={{ width: `${harvestProgress}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playSound('harvest');
                      onHarvestCreature(c.id);
                    }}
                    disabled={!isHarvestReady}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isHarvestReady
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 animate-pulse'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed text-[10px]'
                    }`}
                  >
                    {isHarvestReady ? 'حصاد ✨' : 'جاري النمو'}
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      playSound('click');
                      onOpenPassport(c);
                    }}
                    className="w-full py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-amber-200 border border-amber-500/30 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    جواز النسب
                  </button>

                  <button
                    onClick={() => {
                      playSound('click');
                      onOpenBreeding(c);
                    }}
                    className="w-full py-1.5 px-2 bg-purple-950/60 hover:bg-purple-900/80 text-purple-200 border border-purple-500/30 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 text-pink-400" />
                    تزاوج وراثي
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
