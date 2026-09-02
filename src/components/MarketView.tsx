import React, { useState } from 'react';
import { Creature, ResourceItem, SpeciesType } from '../types';
import { calculateOverallGeneticScore, RARITY_COLORS } from '../utils/genetics';
import { Landmark, Coins, ArrowUpRight, ArrowDownRight, Sparkles, ShoppingCart, Tag, RefreshCw } from 'lucide-react';
import { playSound } from '../utils/audio';

interface MarketViewProps {
  resources: ResourceItem[];
  gold: number;
  onSellResource: (resourceId: string, amount: number) => void;
  onBuyAuctionCreature: (creature: Creature) => void;
}

export const MarketView: React.FC<MarketViewProps> = ({
  resources,
  gold,
  onSellResource,
  onBuyAuctionCreature
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'commodities' | 'auctions'>('commodities');

  // Sample guest auction studs
  const auctionStuds: Creature[] = [
    {
      id: 'auction_dog_hulk',
      name: 'هولك دي سانتروف (Hulk)',
      species: 'dog',
      breedName: 'الراعي الألماني الأسود البوردر (DDR Line)',
      gender: 'M',
      birthRealTimestamp: Date.now() - 1000 * 60 * 60 * 30,
      ageDaysCalculated: 820,
      stage: 'prime',
      imageIcon: '🐕‍🦺',
      avatarBg: 'from-amber-950 to-slate-950',
      rarity: 'Legendary',
      dna: {
        drive: 96,
        stature: 90,
        temperament: 93,
        coatQuality: 92,
        stamina: 94,
        geneticPurity: 96,
        mutations: ['ألياف عضلية سريعة الانقباض'],
        genotype: {
          alleles: 'DDR-BLK-99',
          lineName: 'سلالة خطوط العمل الشرقية DDR',
          isCHICVerified: true,
          isFCICertified: true
        }
      },
      harvest: {
        resourceId: 'dna_hair_sample',
        resourceName: 'عينات DNA نقية',
        icon: '🧬',
        intervalSec: 15,
        lastHarvestTimestamp: 0,
        yieldAmount: 2
      },
      titles: ['بطل ألمانيا للعمل الكثيف', 'شهادة IGP 3 المعتمدة'],
      lineage: {
        generation: 5
      },
      stats: {
        wins: 11,
        podiums: 14,
        totalEarnings: 6500
      },
      priceEstimate: 3200
    },
    {
      id: 'auction_horse_sultan',
      name: 'سلطان الصقلاوية (Sultan)',
      species: 'horse',
      breedName: 'الخيل العربي المصري الصافي (Straight Egyptian)',
      gender: 'M',
      birthRealTimestamp: Date.now() - 1000 * 60 * 60 * 50,
      ageDaysCalculated: 1100,
      stage: 'prime',
      imageIcon: '🐎',
      avatarBg: 'from-emerald-950 to-slate-950',
      rarity: 'Royal Masterpiece',
      dna: {
        drive: 95,
        stature: 98,
        temperament: 97,
        coatQuality: 99,
        stamina: 96,
        geneticPurity: 99,
        mutations: ['التاج الملكي الأموي'],
        genotype: {
          alleles: 'WAHO-EGY-04',
          lineName: 'سلالة الصقلاوي النجدية الأصيلة',
          isCHICVerified: true,
          isFCICertified: true
        }
      },
      harvest: {
        resourceId: 'pure_manure',
        resourceName: 'سماد عضوي ملكي',
        icon: '🌱',
        intervalSec: 12,
        lastHarvestTimestamp: 0,
        yieldAmount: 3
      },
      titles: ['التاج البلاتيني لجمال الخيول بالشرقية'],
      lineage: {
        generation: 7
      },
      stats: {
        wins: 18,
        podiums: 21,
        totalEarnings: 16000
      },
      priceEstimate: 5800
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Market Header */}
      <div className="bg-gradient-to-r from-slate-900 via-yellow-950/30 to-slate-900 border border-yellow-500/30 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-xs font-bold">
                البورصة المركزية ومزادات السلالات
              </span>
              <span className="text-xs text-slate-400">
                • التداول اللحظي وتصريف الفوائض
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-100">
              تداول السلع الخام وشراء عينات الأنساب العالمية
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              قم ببيع المواد والمنتجات الفائضة عن حاجتك للحصول على السيولة النقدية، أو زايد على فحول وأمهات نادرة لتعزيز شجرة عائلتك.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => {
                playSound('click');
                setActiveSubTab('commodities');
              }}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                activeSubTab === 'commodities' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              بورصة المواد والسلع 🪙
            </button>
            <button
              onClick={() => {
                playSound('click');
                setActiveSubTab('auctions');
              }}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                activeSubTab === 'auctions' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              مزاد الفحول النادرة 🏆
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'commodities' ? (
        /* Commodities Market */
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-300 flex items-center justify-between">
            <span>أسعار السلع الفورية المتاحة في المخزن للبيع:</span>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              الطلب العالمي في ارتفاع مستمر
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {resources.map(res => {
              const totalVal = res.count * res.basePrice;

              return (
                <div
                  key={res.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{res.icon}</span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-100">{res.name}</h4>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            السعر الفردي: <strong className="text-amber-300">{res.basePrice}</strong> ذهب
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-300 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                        متاح: ×{res.count}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
                      {res.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-slate-400">
                      الإجمالي: <strong className="text-yellow-400">{totalVal.toLocaleString()}</strong> 🪙
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          playSound('coin');
                          onSellResource(res.id, 1);
                        }}
                        disabled={res.count < 1}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        بيع 1
                      </button>
                      <button
                        onClick={() => {
                          playSound('coin');
                          onSellResource(res.id, res.count);
                        }}
                        disabled={res.count < 1}
                        className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        بيع الكل
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Auction House */
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-300 flex items-center justify-between">
            <span>الفحول المعروضة للتبني المباشر من كبار المربين الدوليين:</span>
            <span className="text-xs text-amber-400 font-mono">سجلات موثقة CHIC / FCI</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {auctionStuds.map(stud => {
              const score = calculateOverallGeneticScore(stud.dna);
              const rarityStyle = RARITY_COLORS[stud.rarity];
              const canBuy = gold >= stud.priceEstimate;

              return (
                <div
                  key={stud.id}
                  className={`bg-slate-900 border-2 ${rarityStyle.border} rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-2xl p-1 border ${rarityStyle.border} bg-gradient-to-b ${stud.avatarBg} flex items-center justify-center text-3xl shadow-inner`}>
                          {stud.imageIcon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${rarityStyle.bg} ${rarityStyle.text} ${rarityStyle.border}`}>
                              {stud.rarity}
                            </span>
                            <span className="text-xs font-mono text-slate-400">الجيل #{stud.lineage.generation}</span>
                          </div>
                          <h4 className="text-sm sm:text-base font-black text-slate-100 mt-0.5">{stud.name}</h4>
                          <p className="text-xs text-slate-400">{stud.breedName}</p>
                        </div>
                      </div>

                      <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-center font-mono">
                        <span className="text-[10px] text-slate-500 block">الجودة</span>
                        <span className="text-base font-black text-amber-300">{score}%</span>
                      </div>
                    </div>

                    {/* Stats preview */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 text-[11px] text-center font-mono">
                      <div>
                        <span className="text-slate-500 block text-[10px]">الدافع</span>
                        <span className="text-amber-400 font-bold">{stud.dna.drive}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">الهيكل</span>
                        <span className="text-blue-400 font-bold">{stud.dna.stature}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">النقاء الوراثي</span>
                        <span className="text-emerald-400 font-bold">{stud.dna.geneticPurity}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Buy / Adopt Action */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block">سعر التبني النهائي</span>
                      <span className="text-base font-black text-yellow-400 font-mono">
                        {stud.priceEstimate.toLocaleString()} ذهب
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (canBuy) {
                          playSound('win');
                          onBuyAuctionCreature(stud);
                        } else {
                          playSound('error');
                        }
                      }}
                      disabled={!canBuy}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                        canBuy
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/30 hover:scale-105'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {canBuy ? 'شراء وضمه للمحمية 🛒' : 'الرصيد غير كافٍ'}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
