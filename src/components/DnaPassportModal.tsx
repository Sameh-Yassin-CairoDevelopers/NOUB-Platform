import React from 'react';
import { Creature, ResourceItem } from '../types';
import { calculateOverallGeneticScore, RARITY_COLORS, SPECIES_METADATA } from '../utils/genetics';
import { X, Award, Dna, ShieldCheck, Zap, Sparkles, Heart, Activity, ArrowUpRight } from 'lucide-react';
import { playSound } from '../utils/audio';

interface DnaPassportModalProps {
  creature: Creature | null;
  onClose: () => void;
  onOpenBreeding: (creature: Creature) => void;
  availableBoosters: ResourceItem[];
  onApplyBooster: (creatureId: string, resourceId: string) => void;
}

export const DnaPassportModal: React.FC<DnaPassportModalProps> = ({
  creature,
  onClose,
  onOpenBreeding,
  availableBoosters,
  onApplyBooster
}) => {
  if (!creature) return null;

  const score = calculateOverallGeneticScore(creature.dna);
  const rarityStyle = RARITY_COLORS[creature.rarity];
  const speciesMeta = SPECIES_METADATA[creature.species];

  const statList = [
    { key: 'drive', label: 'الدافع والشغف (Drive)', val: creature.dna.drive, icon: '🔥', desc: 'الحافز الميداني والسرعة في الهجوم والمطاردة' },
    { key: 'stature', label: 'الهيكل والتشريح (Stature)', val: creature.dna.stature, icon: '📐', desc: 'زوايا الأطراف والظهر وعرض الصدر المثالي' },
    { key: 'temperament', label: 'المزاج والثبات (Temperament)', val: creature.dna.temperament, icon: '🧠', desc: 'الاتزان العصبي وعدم الخوف تحت الضوضاء' },
    { key: 'coatQuality', label: 'رونق الفراء/المظهر (Coat)', val: creature.dna.coatQuality, icon: '✨', desc: 'كثافة وبريق الفراء والألوان القياسية' },
    { key: 'stamina', label: 'التحمل والقلب (Stamina)', val: creature.dna.stamina, icon: '⚡', desc: 'طاقة الركض لمسافات شاقة دون إجهاد' },
    { key: 'geneticPurity', label: 'نقاء النسب (Purity %)', val: creature.dna.geneticPurity, icon: '🧬', desc: 'مؤشر خلو السلالة من العيوب الوراثية' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-amber-500/50 rounded-2xl shadow-2xl shadow-amber-950/60 overflow-hidden text-slate-100 my-8">
        
        {/* Header / Certificate Banner */}
        <div className="relative bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 p-4 sm:p-6 border-b border-amber-500/30">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 border-2 ${rarityStyle.border} bg-gradient-to-b ${creature.avatarBg} flex items-center justify-center text-4xl sm:text-5xl shadow-xl`}>
              {creature.imageIcon}
            </div>

            <div className="text-center sm:text-right flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${rarityStyle.bg} ${rarityStyle.text} ${rarityStyle.border}`}>
                  {creature.rarity}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs bg-slate-800 text-slate-300 border border-slate-700">
                  {speciesMeta.labelArabic}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                  الجيل #{creature.lineage.generation}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-amber-100 tracking-wide">
                {creature.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                {creature.breedName}
              </p>
              <div className="text-xs text-amber-400/80 mt-1 font-mono">
                كود الأليلات: {creature.dna.genotype.alleles} • {creature.gender === 'M' ? 'ذكر ♂' : creature.gender === 'F' ? 'أنثى ♀' : 'نبات معمر 🌿'}
              </div>
            </div>

            {/* Overall Score Badge */}
            <div className="bg-slate-950/80 border border-amber-500/40 rounded-xl p-3 text-center min-w-[100px]">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">مؤشر الجودة الكلي</div>
              <div className="text-2xl font-black text-amber-300 font-mono">
                {score}<span className="text-xs text-slate-500">/100</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                {score >= 90 ? '⭐⭐⭐⭐⭐ أسطوري' : score >= 80 ? '⭐⭐⭐⭐ نخبوي' : '⭐⭐⭐ معتمد'}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          
          {/* Genetic & Morphological Radar Grid */}
          <div>
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2 mb-3">
              <Dna className="w-4 h-4 text-amber-400" />
              التحليل الجينومي والفسيولوجي (Biometric Radar)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {statList.map((st) => (
                <div key={st.key} className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <span>{st.icon}</span>
                      {st.label}
                    </span>
                    <span className="font-mono font-black text-xs text-amber-300">{st.val}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-1">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        st.val >= 90 ? 'bg-gradient-to-r from-amber-400 to-yellow-300' :
                        st.val >= 75 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                        'bg-gradient-to-r from-blue-500 to-indigo-400'
                      }`}
                      style={{ width: `${st.val}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Genetic Lineage & Parents */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-amber-400" />
              شجرة النسب وسلالة الأصل (Pedigree Tree)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">الأب (Sire)</span>
                <span className="font-bold text-amber-200">{creature.lineage.sire || 'سلالة برية مؤسسة'}</span>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">الأم (Dam)</span>
                <span className="font-bold text-amber-200">{creature.lineage.dam || 'سلالة برية مؤسسة'}</span>
              </div>
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">خط السلالة المعتمد</span>
                <span className="font-bold text-emerald-300">{creature.dna.genotype.lineName}</span>
              </div>
            </div>
          </div>

          {/* Certifications & Mutations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Certs */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                الاعتمادات والفحوصات الطبية
              </div>
              <div className="flex flex-wrap gap-2 text-[11px]">
                {creature.dna.genotype.isCHICVerified && (
                  <span className="px-2 py-1 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    ✓ معتمد CHIC (خالٍ من العيوب الوراثية)
                  </span>
                )}
                {creature.dna.genotype.isFCICertified && (
                  <span className="px-2 py-1 rounded bg-blue-950/60 text-blue-300 border border-blue-500/40 flex items-center gap-1">
                    ✓ جواز سلالة معترف به دولياً (FCI)
                  </span>
                )}
                {creature.titles.map((t, idx) => (
                  <span key={idx} className="px-2 py-1 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    🏆 {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Mutations */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                الطفرات والخصائص النادرة المكتشفة
              </div>
              {creature.dna.mutations.length > 0 ? (
                <div className="space-y-1">
                  {creature.dna.mutations.map((m, idx) => (
                    <div key={idx} className="text-xs text-purple-300 bg-purple-950/40 border border-purple-500/30 px-2.5 py-1 rounded-lg">
                      ✨ {m}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">لا توجد طفرات مكتشفة بعد. استخدم منشط الخصوبة أثناء التزاوج.</p>
              )}
            </div>
          </div>

          {/* Quick Boost Section */}
          {availableBoosters.length > 0 && (
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3.5">
              <div className="text-xs font-bold text-amber-300 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  تطعيم الكائن بالأعلاف والإكسيرات المصنعة
                </span>
                <span className="text-[10px] text-slate-400">انقر لتطبيق التأثير الفوري</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableBoosters.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      playSound('craft');
                      onApplyBooster(creature.id, b.id);
                    }}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-amber-500/40 px-2.5 py-1.5 rounded-lg text-xs transition-all hover:scale-105"
                  >
                    <span>{b.icon}</span>
                    <span className="font-semibold text-slate-200">{b.name}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">({b.count})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            القيمة التقديرية في البورصة: <span className="font-bold text-yellow-400 font-mono">{creature.priceEstimate.toLocaleString()} ذهب</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playSound('click');
                onClose();
                onOpenBreeding(creature);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 transition-all hover:scale-105"
            >
              <Heart className="w-4 h-4 fill-white" />
              اختيار للتزاوج في المختبر
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
            >
              إغلاق الجواز
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
