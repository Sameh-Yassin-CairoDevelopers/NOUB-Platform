import React from 'react';
import { ExportContract, ResourceItem } from '../types';
import { FileCheck, Star, Coins, Sparkles, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';
import { playSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface ExportBoardViewProps {
  contracts: ExportContract[];
  resources: ResourceItem[];
  onCompleteContract: (contractId: string) => void;
}

export const ExportBoardView: React.FC<ExportBoardViewProps> = ({
  contracts,
  resources,
  onCompleteContract
}) => {
  const getResourceCount = (resId: string) => {
    const item = resources.find(r => r.id === resId);
    return item ? item.count : 0;
  };

  const checkCanFulfill = (contract: ExportContract) => {
    return contract.requirements.every(req => {
      if (req.type === 'resource' && req.resourceId) {
        return getResourceCount(req.resourceId) >= req.amount;
      }
      return true;
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Export Board Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/30 to-slate-900 border border-purple-500/30 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                لوحة التجارة الدولية والتصدير الملكي
              </span>
              <span className="text-xs text-slate-400">
                • عقود أندية وسفارات السباقات العالمية
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-100">
              شحنات التصدير والطلبيات المعتمدة
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              وفّر الشحنات المجمعة من الأعلاف المركزة، السروج، وأنابيب الـ DNA الموثقة لكسب أطنان من النجوم (⭐) ورفع مكانة محميتك عالمياً.
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-purple-500/30 text-center">
            <div className="text-[10px] text-purple-300 font-bold uppercase">العقود النشطة</div>
            <div className="text-xl font-black text-amber-300 font-mono">
              {contracts.filter(c => !c.isCompleted).length} طلبات دولية
            </div>
          </div>
        </div>
      </div>

      {/* Contracts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {contracts.map(contract => {
          const canFulfill = checkCanFulfill(contract);

          return (
            <div
              key={contract.id}
              className={`bg-slate-900/90 border-2 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all ${
                contract.isCompleted
                  ? 'border-emerald-500/40 opacity-75'
                  : canFulfill
                    ? 'border-purple-500/60 hover:border-purple-400 shadow-purple-950/40'
                    : 'border-slate-800'
              }`}
            >
              <div>
                
                {/* Client / Organization Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl shadow-inner">
                      {contract.clientAvatar}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-slate-100">{contract.clientName}</h3>
                      <p className="text-xs text-purple-300/90 font-medium">{contract.clientTitle}</p>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3" />
                        {contract.organization}
                      </span>
                    </div>
                  </div>

                  {contract.isCompleted ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      تم الشحن
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-mono">
                      عقد رسمي مفتوح
                    </span>
                  )}
                </div>

                {/* Required Items Checklist */}
                <div className="space-y-2 mb-4">
                  <span className="text-xs font-bold text-slate-400 block">المواد والشهادات المطلوبة للشحنة:</span>
                  <div className="space-y-1.5">
                    {contract.requirements.map((req, idx) => {
                      const available = req.resourceId ? getResourceCount(req.resourceId) : 0;
                      const hasEnough = available >= req.amount;

                      return (
                        <div
                          key={idx}
                          className={`p-2 rounded-xl text-xs flex items-center justify-between border ${
                            hasEnough
                              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{req.icon}</span>
                            <span className="font-semibold">{req.label}</span>
                          </div>

                          <div className="flex items-center gap-2 font-mono text-xs">
                            <span className={hasEnough ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                              {available} / {req.amount}
                            </span>
                            {hasEnough ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-slate-600" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Rewards & Fulfill Action */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 font-mono font-bold text-amber-300">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    +{contract.rewardGold.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 font-mono font-bold text-yellow-300">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    +{contract.rewardStars}⭐
                  </div>
                  <div className="text-[10px] text-purple-400 font-mono">
                    +{contract.rewardXp} XP
                  </div>
                </div>

                {!contract.isCompleted && (
                  <button
                    onClick={() => {
                      if (canFulfill) {
                        playSound('win');
                        try {
                          confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
                        } catch {
                          // Ignore
                        }
                        onCompleteContract(contract.id);
                      } else {
                        playSound('error');
                      }
                    }}
                    disabled={!canFulfill}
                    className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
                      canFulfill
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/50 hover:scale-105'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    {canFulfill ? 'تسليم وتصدير الشحنة 🚀' : 'المخزون غير كافٍ'}
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
