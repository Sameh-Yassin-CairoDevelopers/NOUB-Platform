import React, { useState } from 'react';
import { TOMBS_CATALOG } from '../data/tombsData';
import { TombCipherModal } from './TombCipherModal';
import { 
  Search, 
  Sparkles, 
  Lock, 
  Unlock, 
  Trophy, 
  Coins, 
  Star, 
  CheckCircle2, 
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { playSound } from '../utils/audio';

interface TombsViewProps {
  unlockedTombs: number[];
  gold: number;
  stars: number;
  onUnlockTomb: (kvNumber: number, rewardGold: number, rewardStars: number) => void;
}

export const TombsView: React.FC<TombsViewProps> = ({
  unlockedTombs,
  gold,
  stars,
  onUnlockTomb
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDynasty, setSelectedDynasty] = useState<string>('all');
  const [activeModalTomb, setActiveModalTomb] = useState<(typeof TOMBS_CATALOG)[0] | null>(null);

  const unlockedSet = new Set(unlockedTombs);
  const totalTombs = TOMBS_CATALOG.length;
  const unlockedCount = unlockedTombs.filter(kv => TOMBS_CATALOG.some(t => t.kv_number === kv)).length;
  const progressPercent = Math.round((unlockedCount / totalTombs) * 100);

  // Calculate total rewards collected from unlocked tombs
  const totalLootedGold = TOMBS_CATALOG.filter(t => unlockedSet.has(t.kv_number)).reduce((acc, t) => acc + t.rewardGold, 0);
  const totalLootedStars = TOMBS_CATALOG.filter(t => unlockedSet.has(t.kv_number)).reduce((acc, t) => acc + t.rewardStars, 0);

  // Filtered tombs
  const filteredTombs = TOMBS_CATALOG.filter(tomb => {
    // Search query
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = 
      !q || 
      tomb.name_ar.toLowerCase().includes(q) || 
      tomb.historicalFact.toLowerCase().includes(q) ||
      `kv${tomb.kv_number}`.includes(q) ||
      tomb.kv_number.toString() === q;

    if (!matchesSearch) return false;

    // Dynasty filter
    if (selectedDynasty === 'all') return true;
    if (selectedDynasty === 'unlocked') return unlockedSet.has(tomb.kv_number);
    if (selectedDynasty === 'locked') return !unlockedSet.has(tomb.kv_number);
    return tomb.dynasty.includes(selectedDynasty);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner: Valley of the Kings Overview */}
      <div className="relative bg-gradient-to-r from-amber-950/50 via-slate-900 to-amber-950/40 rounded-2xl border border-amber-500/30 p-5 sm:p-6 shadow-xl shadow-black/40 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                سِجِل وادي الملوك الجنائزي
              </span>
              <span className="text-xs text-slate-400 font-medium">62 مقبرة ملكية خالدة</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-amber-100 flex items-center gap-2">
              <span>مقابر وادي الملوك الـ 62 ولعبة فك الشفرات</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              استكشف مقابر فراعنة وملكات مصر القديمة من الأسرة 18 إلى الأسرة 20. حل ألغاز الشفرات الملكية المستندة للأحداث التاريخية لفتح الخراطيش ونهب الكنوز والذهب الملكي!
            </p>
          </div>

          {/* Progress & Stats Card */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-950/80 p-3.5 sm:p-4 rounded-xl border border-amber-500/30 shadow-inner">
            <div className="text-center sm:text-right pr-2">
              <div className="text-[11px] text-slate-400 font-bold mb-1">المقابر المحررة</div>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-xl sm:text-2xl font-black text-amber-300">
                  {unlockedCount}
                </span>
                <span className="text-xs text-slate-500 font-bold">/ 62</span>
                <span className="text-xs font-mono text-emerald-400 font-bold mr-2">
                  ({progressPercent}%)
                </span>
              </div>
            </div>

            <div className="h-9 w-px bg-slate-800 hidden sm:block" />

            <div className="flex flex-col gap-1 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-amber-300">
                <Coins className="w-3.5 h-3.5 text-yellow-400" />
                <span>+{totalLootedGold.toLocaleString()} ذهب محرر</span>
              </div>
              <div className="flex items-center gap-1.5 text-yellow-300">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span>+{totalLootedStars} نجمة ملكية</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-3">
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 transition-all duration-500 shadow-md shadow-amber-500/50"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-amber-300 whitespace-nowrap">
            {progressPercent}% مكتمل
          </span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث باسم الفرعون (توت عنخ آمون، رمسيس، حتشبسوت) أو رقم المقبرة (KV62)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg pr-9 pl-3 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs font-bold">
          {[
            { id: 'all', label: 'الجميع (62)' },
            { id: 'الأسرة 18', label: 'الأسرة 18' },
            { id: 'الأسرة 19', label: 'الأسرة 19' },
            { id: 'الأسرة 20', label: 'الأسرة 20' },
            { id: 'unlocked', label: `المحررة (${unlockedCount})` },
            { id: 'locked', label: `المغلقة (${62 - unlockedCount})` }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => {
                playSound('click');
                setSelectedDynasty(f.id);
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                selectedDynasty === f.id
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tombs Grid */}
      {filteredTombs.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-2">
          <Compass className="w-10 h-10 mx-auto text-slate-600 animate-pulse" />
          <p className="text-sm font-bold">لا توجد مقابر مطابقة للبحث أو التصفية الحالية.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDynasty('all');
            }}
            className="text-xs text-amber-400 underline font-semibold mt-2"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTombs.map(tomb => {
            const isUnlocked = unlockedSet.has(tomb.kv_number);

            return (
              <div
                key={tomb.kv_number}
                onClick={() => {
                  playSound('click');
                  setActiveModalTomb(tomb);
                }}
                className={`group relative rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-amber-950/20 via-slate-900/90 to-slate-900 border-amber-500/40 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-950/30'
                    : 'bg-slate-900/70 border-slate-800/80 hover:border-amber-500/30 hover:bg-slate-900 hover:shadow-lg'
                }`}
              >
                <div>
                  {/* Top Bar: KV Badge & Dynasty */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className={`px-2.5 py-1 rounded-lg font-mono font-black text-xs border ${
                      isUnlocked
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}>
                      KV #{tomb.kv_number}
                    </span>

                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded-full border border-slate-800/60">
                      {tomb.dynasty}
                    </span>
                  </div>

                  {/* Tomb Name */}
                  <h3 className="text-sm sm:text-base font-black text-slate-100 group-hover:text-amber-200 transition-colors line-clamp-1 mb-1.5">
                    {tomb.name_ar}
                  </h3>

                  {/* Fact preview or unlocked treasure */}
                  {isUnlocked ? (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 mt-2 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-bold">
                        <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                        <span>تم تحرير الكنز:</span>
                      </div>
                      <p className="text-xs text-amber-100 font-bold truncate">
                        ✨ {tomb.treasureName}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {tomb.historicalFact}
                    </p>
                  )}
                </div>

                {/* Footer Status & Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  {isUnlocked ? (
                    <div className="flex items-center justify-between w-full">
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        مستكشفة ومفتوحة
                      </span>
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300">
                        <span>+{tomb.rewardGold.toLocaleString()}🪙</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <span className="inline-flex items-center gap-1 text-xs text-amber-400/90 font-bold">
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        شفرة {tomb.code_length} أرقام
                      </span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          playSound('click');
                          setActiveModalTomb(tomb);
                        }}
                        className="px-3 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors"
                      >
                        فك الشفرة
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tomb Cipher / Inspection Modal */}
      {activeModalTomb && (
        <TombCipherModal
          tomb={activeModalTomb}
          isUnlocked={unlockedSet.has(activeModalTomb.kv_number)}
          onClose={() => setActiveModalTomb(null)}
          onUnlockTomb={onUnlockTomb}
        />
      )}

    </div>
  );
};
