import React, { useState } from 'react';
import { ActiveProduction, ResourceItem, Workshop, WorkshopRecipe } from '../types';
import { Factory, Sparkles, ArrowUpCircle, Play, CheckCircle2, Clock, Package, Zap } from 'lucide-react';
import { playSound } from '../utils/audio';

interface WorkshopsViewProps {
  workshops: Workshop[];
  recipes: WorkshopRecipe[];
  resources: ResourceItem[];
  gold: number;
  stars: number;
  onStartProduction: (workshopId: string, recipeId: string) => void;
  onCollectProduction: (workshopId: string) => void;
  onUpgradeWorkshop: (workshopId: string) => void;
  onUseResource?: (resourceId: string) => void;
}

export const WorkshopsView: React.FC<WorkshopsViewProps> = ({
  workshops,
  recipes,
  resources,
  gold,
  stars,
  onStartProduction,
  onCollectProduction,
  onUpgradeWorkshop,
  onUseResource
}) => {
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>(workshops[0]?.id || '');
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'raw' | 'processed'>('all');

  const selectedWorkshop = workshops.find(w => w.id === selectedWorkshopId) || workshops[0];
  const workshopRecipes = recipes.filter(r => r.workshopType === selectedWorkshop?.type);

  const getResourceCount = (resId: string) => {
    const item = resources.find(r => r.id === resId);
    return item ? item.count : 0;
  };

  const checkCanCraft = (recipe: WorkshopRecipe) => {
    return recipe.inputs.every(inp => getResourceCount(inp.resourceId) >= inp.amount);
  };

  const filteredInventory = resources.filter(r => {
    if (inventoryFilter === 'raw') return r.category === 'raw';
    if (inventoryFilter === 'processed') return r.category !== 'raw';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Tycoon Complex Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/30 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                مجمع الصناعات الحيوية والتراثية
              </span>
              <span className="text-xs text-slate-400">
                • 4 خطوط إنتاج استراتيجية
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-100">
              ورش تصنيع الأعلاف، الصيدلة، والسروج الملكية
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              حوّل المخرجات العضوية للمحمية إلى أدوية، أعلاف أبطال، وسروج مطرزة لتلبية عقود التصدير وتجهيز أبطالك للمنافسات.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div className="text-right">
              <div className="text-[10px] text-slate-400">المخزون الكلي للمواد</div>
              <div className="text-sm font-black text-amber-300 font-mono">
                {resources.reduce((sum, r) => sum + r.count, 0)} وحدة جاهزة
              </div>
            </div>
            <Package className="w-6 h-6 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Workshop Selection Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {workshops.map(ws => {
          const isSelected = selectedWorkshopId === ws.id;
          const isBusy = ws.activeProduction !== null;
          const isDone = isBusy && Date.now() >= ws.activeProduction!.endsAt;

          return (
            <button
              key={ws.id}
              onClick={() => {
                playSound('click');
                setSelectedWorkshopId(ws.id);
              }}
              className={`p-3.5 rounded-2xl border text-right transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-950/40 border-amber-400 text-amber-100 shadow-lg shadow-amber-950/50'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-2xl">{ws.icon}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[10px] font-mono border border-slate-800">
                  المستوى {ws.level}
                </span>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-black truncate">{ws.name}</h3>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  {isDone ? (
                    <span className="text-emerald-400 font-bold animate-pulse">✓ اكتمل الإنتاج!</span>
                  ) : isBusy ? (
                    <span className="text-yellow-400 font-medium">⚙️ قيد التشغيل...</span>
                  ) : (
                    <span className="text-slate-500">جاهز للبدء</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Workshop Working Bench */}
      {selectedWorkshop && (
        <div className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6">
          
          {/* Workshop Header & Upgrade Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl">
                {selectedWorkshop.icon}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-amber-100 flex items-center gap-2">
                  {selectedWorkshop.name}
                  <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Lv. {selectedWorkshop.level}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">{selectedWorkshop.description}</p>
              </div>
            </div>

            {/* Upgrade Workshop Button */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  if (gold >= selectedWorkshop.upgradeCostGold && stars >= selectedWorkshop.upgradeCostStars) {
                    playSound('levelUp');
                    onUpgradeWorkshop(selectedWorkshop.id);
                  } else {
                    playSound('error');
                  }
                }}
                disabled={gold < selectedWorkshop.upgradeCostGold || stars < selectedWorkshop.upgradeCostStars || selectedWorkshop.level >= 5}
                className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                  selectedWorkshop.level >= 5
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : gold >= selectedWorkshop.upgradeCostGold && stars >= selectedWorkshop.upgradeCostStars
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-105'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                <ArrowUpCircle className="w-4 h-4" />
                <span>
                  {selectedWorkshop.level >= 5 ? 'الحد الأقصى (Lv.5)' : `ترقية المصنع (+25% سرعة)`}
                </span>
                {selectedWorkshop.level < 5 && (
                  <span className="text-[10px] font-mono bg-black/30 px-1.5 py-0.5 rounded">
                    {selectedWorkshop.upgradeCostGold}🪙 + {selectedWorkshop.upgradeCostStars}⭐
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active Production Status Card */}
          {selectedWorkshop.activeProduction ? (
            <div className="bg-slate-950 border border-amber-500/40 rounded-2xl p-4 sm:p-5 space-y-3">
              {(() => {
                const activeProd = selectedWorkshop.activeProduction!;
                const activeRecipe = recipes.find(r => r.id === activeProd.recipeId);
                const now = Date.now();
                const isFinished = now >= activeProd.endsAt;
                const totalMs = activeProd.durationSec * 1000;
                const remainingSec = Math.max(0, Math.ceil((activeProd.endsAt - now) / 1000));
                const progressPct = Math.min(100, Math.round(((totalMs - (activeProd.endsAt - now)) / totalMs) * 100));

                return (
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{activeRecipe?.icon}</span>
                        <div>
                          <div className="text-sm font-bold text-amber-200">{activeRecipe?.name}</div>
                          <div className="text-xs text-slate-400">
                            الناتج: <strong className="text-emerald-400 font-mono">+{activeRecipe?.outputCount}</strong> وحدة
                          </div>
                        </div>
                      </div>

                      {isFinished ? (
                        <button
                          onClick={() => {
                            playSound('coin');
                            onCollectProduction(selectedWorkshop.id);
                          }}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-900/40 animate-bounce"
                        >
                          استلام المنتج 📦
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono bg-amber-950/40 border border-amber-500/30 px-3 py-1.5 rounded-lg">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          <span>باقي: {remainingSec} ثانية</span>
                        </div>
                      )}
                    </div>

                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            /* Available Recipes Grid */
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                وصفات الإنتاج المتاحة في هذا المعمل:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {workshopRecipes.map(recipe => {
                  const canCraft = checkCanCraft(recipe);
                  const outputItem = resources.find(r => r.id === recipe.outputResourceId);

                  return (
                    <div
                      key={recipe.id}
                      className={`bg-slate-950/80 border rounded-xl p-4 flex flex-col justify-between transition-all ${
                        canCraft ? 'border-slate-800 hover:border-amber-500/40' : 'border-slate-800/40 opacity-75'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{recipe.icon}</span>
                            <div>
                              <h5 className="text-xs sm:text-sm font-bold text-slate-100">{recipe.name}</h5>
                              <p className="text-[10px] text-slate-400 leading-tight">{recipe.description}</p>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30 whitespace-nowrap">
                            +{recipe.outputCount}
                          </span>
                        </div>

                        {/* Ingredients Checklist */}
                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 my-2 space-y-1">
                          <span className="text-[10px] text-slate-500 block">المواد المطلوبة للتشغيل:</span>
                          <div className="flex flex-wrap gap-2 text-xs">
                            {recipe.inputs.map(inp => {
                              const inputItem = resources.find(r => r.id === inp.resourceId);
                              const available = getResourceCount(inp.resourceId);
                              const hasEnough = available >= inp.amount;

                              return (
                                <span
                                  key={inp.resourceId}
                                  className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 ${
                                    hasEnough 
                                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30' 
                                      : 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                                  }`}
                                >
                                  <span>{inputItem?.icon}</span>
                                  <span>{inputItem?.name}</span>: 
                                  <strong>{available}/{inp.amount}</strong>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Craft Action Button */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {Math.round(recipe.durationSec / selectedWorkshop.speedMultiplier)} ثانية
                        </span>

                        <button
                          onClick={() => {
                            playSound('craft');
                            onStartProduction(selectedWorkshop.id, recipe.id);
                          }}
                          disabled={!canCraft || selectedWorkshop.activeProduction !== null}
                          className={`px-4 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
                            canCraft && selectedWorkshop.activeProduction === null
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          بدء التصنيع
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Facility Storage Inventory */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-400" />
              مستودع السلع والمواد المخزنة
            </h3>
            <p className="text-xs text-slate-400">
              جميع المواد الخام المحصودة والمنتجات المصنعة الجاهزة للاستخدام أو التصدير
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setInventoryFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${inventoryFilter === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
            >
              الكل
            </button>
            <button
              onClick={() => setInventoryFilter('raw')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${inventoryFilter === 'raw' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
            >
              المواد الخام 🌿
            </button>
            <button
              onClick={() => setInventoryFilter('processed')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${inventoryFilter === 'processed' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
            >
              المنتجات المصنعة 🧪
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredInventory.map(item => (
            <div
              key={item.id}
              className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-mono font-black text-xs text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    ×{item.count}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-200 leading-snug">{item.name}</div>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{item.description}</p>
              </div>

              {item.boostEffect && (
                <div className="mt-2 text-[10px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20 text-center font-semibold">
                  {item.boostEffect.label}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
