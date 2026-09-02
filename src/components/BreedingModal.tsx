import React, { useState } from 'react';
import { Creature, ResourceItem } from '../types';
import { calculateOverallGeneticScore, RARITY_COLORS, simulateBreeding } from '../utils/genetics';
import { X, Heart, Sparkles, Dna, ArrowLeftRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { playSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface BreedingModalProps {
  initialCreature?: Creature | null;
  allCreatures: Creature[];
  fertilityTonicsCount: number;
  onClose: () => void;
  onOffspringBorn: (newborn: Creature, usedTonic: boolean) => void;
}

export const BreedingModal: React.FC<BreedingModalProps> = ({
  initialCreature,
  allCreatures,
  fertilityTonicsCount,
  onClose,
  onOffspringBorn
}) => {
  const [selectedSire, setSelectedSire] = useState<Creature | null>(
    initialCreature?.gender === 'M' || initialCreature?.gender === 'asexual' ? initialCreature : null
  );
  const [selectedDam, setSelectedDam] = useState<Creature | null>(
    initialCreature?.gender === 'F' ? initialCreature : null
  );
  const [useFertilityTonic, setUseFertilityTonic] = useState(false);
  const [isBreeding, setIsBreeding] = useState(false);

  // Filter possible partners based on species & gender
  const currentSpecies = selectedSire?.species || selectedDam?.species;

  const availableSires = allCreatures.filter(c => 
    (!currentSpecies || c.species === currentSpecies) && 
    (c.gender === 'M' || c.gender === 'asexual') &&
    c.id !== selectedDam?.id
  );

  const availableDams = allCreatures.filter(c => 
    (!currentSpecies || c.species === currentSpecies) && 
    (c.gender === 'F' || c.gender === 'asexual') &&
    c.id !== selectedSire?.id
  );

  const handleStartBreeding = () => {
    if (!selectedSire || !selectedDam) return;

    setIsBreeding(true);
    playSound('breed');

    setTimeout(() => {
      const maxGen = Math.max(selectedSire.lineage.generation, selectedDam.lineage.generation);
      const baby = simulateBreeding(selectedSire, selectedDam, maxGen);

      // If tonic was used, extra boost
      if (useFertilityTonic && fertilityTonicsCount > 0) {
        baby.dna.geneticPurity = Math.min(100, baby.dna.geneticPurity + 4);
        if (baby.dna.mutations.length === 0) {
          baby.dna.mutations.push('طفرة الحيوية المزدوجة (تأثير إكسير الخصوبة)');
        }
      }

      setIsBreeding(false);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
      onOffspringBorn(baby, useFertilityTonic && fertilityTonicsCount > 0);
      onClose();
    }, 1800);
  };

  const isCompatible = selectedSire && selectedDam && selectedSire.species === selectedDam.species;
  const isSameLine = selectedSire && selectedDam && selectedSire.dna.genotype.lineName === selectedDam.dna.genotype.lineName;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-purple-500/50 rounded-2xl shadow-2xl shadow-purple-950/60 overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 p-4 sm:p-5 border-b border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Dna className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-purple-100">
                محطة التزاوج والتحسين الوراثي
              </h2>
              <p className="text-xs text-slate-400">
                محاكاة قوانين مندل الوراثية وتوريث الأليلات المتنحية والسائدة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mating Slots */}
        <div className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
            
            {/* Sire (Father) */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
                  ♂️ الطرف الأول (الأب / الأصل)
                </span>
                {selectedSire && (
                  <button 
                    onClick={() => setSelectedSire(null)}
                    className="text-[10px] text-slate-500 hover:text-rose-400"
                  >
                    تغيير
                  </button>
                )}
              </div>

              {selectedSire ? (
                <div className="text-center py-2 space-y-2">
                  <div className="text-4xl">{selectedSire.imageIcon}</div>
                  <div className="font-black text-sm text-amber-200">{selectedSire.name}</div>
                  <div className="text-[11px] text-slate-400">{selectedSire.breedName}</div>
                  <div className="flex justify-center gap-2 text-[10px] text-slate-300">
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      الجودة: {calculateOverallGeneticScore(selectedSire.dna)}%
                    </span>
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      النقاء: {selectedSire.dna.geneticPurity}%
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 py-3">
                  <p className="text-xs text-slate-500 text-center">اختر الأب من قطيع المحمية:</p>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 scrollbar-none">
                    {availableSires.map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          playSound('click');
                          setSelectedSire(s);
                        }}
                        className="w-full text-right bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 p-2 rounded-lg text-xs flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span>{s.imageIcon}</span>
                          <span className="font-bold text-slate-200">{s.name}</span>
                        </div>
                        <span className="font-mono text-amber-400 text-[10px]">
                          {calculateOverallGeneticScore(s.dna)}%
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dam (Mother) */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-pink-400 flex items-center gap-1">
                  ♀️ الطرف الثاني (الأم / الشتلة)
                </span>
                {selectedDam && (
                  <button 
                    onClick={() => setSelectedDam(null)}
                    className="text-[10px] text-slate-500 hover:text-rose-400"
                  >
                    تغيير
                  </button>
                )}
              </div>

              {selectedDam ? (
                <div className="text-center py-2 space-y-2">
                  <div className="text-4xl">{selectedDam.imageIcon}</div>
                  <div className="font-black text-sm text-pink-200">{selectedDam.name}</div>
                  <div className="text-[11px] text-slate-400">{selectedDam.breedName}</div>
                  <div className="flex justify-center gap-2 text-[10px] text-slate-300">
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      الجودة: {calculateOverallGeneticScore(selectedDam.dna)}%
                    </span>
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      النقاء: {selectedDam.dna.geneticPurity}%
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 py-3">
                  <p className="text-xs text-slate-500 text-center">اختر الأم من قطيع المحمية:</p>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 scrollbar-none">
                    {availableDams.map(d => (
                      <button
                        key={d.id}
                        onClick={() => {
                          playSound('click');
                          setSelectedDam(d);
                        }}
                        className="w-full text-right bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-pink-500/40 p-2 rounded-lg text-xs flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span>{d.imageIcon}</span>
                          <span className="font-bold text-slate-200">{d.name}</span>
                        </div>
                        <span className="font-mono text-amber-400 text-[10px]">
                          {calculateOverallGeneticScore(d.dna)}%
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Genetic Compatibility & COI Indicator */}
          {selectedSire && selectedDam && (
            <div className="bg-slate-950 border border-purple-500/30 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  مؤشر التوافق الجيني وتوقع جودة النسل:
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  {isSameLine ? 'تزاوج خطوط نقية (Inbreeding)' : 'هجين قوة السلالة (Outcrossing)'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                  متوسط الجودة المتوقعة: <span className="font-bold text-amber-300 font-mono">
                    {Math.round((calculateOverallGeneticScore(selectedSire.dna) + calculateOverallGeneticScore(selectedDam.dna)) / 2)}%
                  </span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                  نسبة توارث الطفرات: <span className="font-bold text-purple-300 font-mono">
                    {useFertilityTonic ? '75% (نشط)' : '28%'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Fertility Tonic Add-on */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-500/40 flex items-center justify-center text-base">
                ✨
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200">
                  استخدام منشط الخصوبة والطفرات الوراثية
                </div>
                <div className="text-[10px] text-slate-400">
                  المتوفر في المخزن: <span className="text-amber-400 font-mono font-bold">{fertilityTonicsCount}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (fertilityTonicsCount > 0) {
                  playSound('click');
                  setUseFertilityTonic(!useFertilityTonic);
                }
              }}
              disabled={fertilityTonicsCount === 0}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                useFertilityTonic 
                  ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-900/40' 
                  : fertilityTonicsCount > 0
                    ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
              }`}
            >
              {useFertilityTonic ? 'مفعّل ✓' : 'تفعيل الإكسير'}
            </button>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            إلغاء
          </button>

          <button
            onClick={handleStartBreeding}
            disabled={!isCompatible || isBreeding}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black shadow-lg transition-all ${
              isCompatible && !isBreeding
                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-900/50 hover:scale-105'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {isBreeding ? (
              <>
                <Dna className="w-4 h-4 animate-spin text-amber-300" />
                جاري إنتاج النسل الوراثي...
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 fill-white" />
                بدء التزاوج وتوليد السلالة (مجاني)
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
