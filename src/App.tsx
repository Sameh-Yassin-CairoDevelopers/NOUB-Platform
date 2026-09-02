import React, { useState, useEffect, useRef } from 'react';
import {
  Creature,
  ExportContract,
  PlayerEmpire,
  ResourceItem,
  SpeciesType,
  Tournament,
  Workshop,
  WorkshopRecipe
} from './types';
import {
  INITIAL_CREATURES,
  INITIAL_EMPIRE,
  INITIAL_EXPORT_CONTRACTS,
  INITIAL_RESOURCES,
  INITIAL_TOURNAMENTS,
  INITIAL_WORKSHOPS,
  WORKSHOP_RECIPES
} from './data/initialData';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { SanctuaryView } from './components/SanctuaryView';
import { WorkshopsView } from './components/WorkshopsView';
import { ExportBoardView } from './components/ExportBoardView';
import { TournamentsView } from './components/TournamentsView';
import { MarketView } from './components/MarketView';
import { DnaPassportModal } from './components/DnaPassportModal';
import { BreedingModal } from './components/BreedingModal';
import { TournamentMatchModal } from './components/TournamentMatchModal';
import { playSound } from './utils/audio';
import { SPECIES_METADATA } from './utils/genetics';

const STORAGE_KEY = 'dynasty_tycoon_save_v1';

export default function App() {
  // Load state from localStorage or fallback to initial data
  const [empire, setEmpire] = useState<PlayerEmpire>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_empire');
      return saved ? JSON.parse(saved) : INITIAL_EMPIRE;
    } catch {
      return INITIAL_EMPIRE;
    }
  });

  const [creatures, setCreatures] = useState<Creature[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_creatures');
      return saved ? JSON.parse(saved) : INITIAL_CREATURES;
    } catch {
      return INITIAL_CREATURES;
    }
  });

  const [resources, setResources] = useState<ResourceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_resources');
      return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
    } catch {
      return INITIAL_RESOURCES;
    }
  });

  const [workshops, setWorkshops] = useState<Workshop[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_workshops');
      return saved ? JSON.parse(saved) : INITIAL_WORKSHOPS;
    } catch {
      return INITIAL_WORKSHOPS;
    }
  });

  const [contracts, setContracts] = useState<ExportContract[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_contracts');
      return saved ? JSON.parse(saved) : INITIAL_EXPORT_CONTRACTS;
    } catch {
      return INITIAL_EXPORT_CONTRACTS;
    }
  });

  const [tournaments] = useState<Tournament[]>(INITIAL_TOURNAMENTS);

  // Modals state
  const [passportCreature, setPassportCreature] = useState<Creature | null>(null);
  const [breedingInitialCreature, setBreedingInitialCreature] = useState<Creature | null>(null);
  const [isBreedingModalOpen, setIsBreedingModalOpen] = useState(false);
  const [activeTournamentMatch, setActiveTournamentMatch] = useState<{
    tournament: Tournament;
    creature: Creature;
  } | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Save to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_empire', JSON.stringify(empire));
      localStorage.setItem(STORAGE_KEY + '_creatures', JSON.stringify(creatures));
      localStorage.setItem(STORAGE_KEY + '_resources', JSON.stringify(resources));
      localStorage.setItem(STORAGE_KEY + '_workshops', JSON.stringify(workshops));
      localStorage.setItem(STORAGE_KEY + '_contracts', JSON.stringify(contracts));
    } catch {
      // Ignore storage quota errors
    }
  }, [empire, creatures, resources, workshops, contracts]);

  // Main 89x Acceleration Game Loop Timer (Ticks every 1 second)
  useEffect(() => {
    const interval = setInterval(() => {
      // Advance workshop productions
      setWorkshops(prevWorkshops => {
        return prevWorkshops.map(ws => {
          if (!ws.activeProduction) return ws;
          // Progress is naturally measured by timestamps
          return ws;
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handlers: Harvesting from Sanctuary creatures
  const handleHarvestCreature = (creatureId: string) => {
    const targetCreature = creatures.find(c => c.id === creatureId);
    if (!targetCreature) return;

    const resId = targetCreature.harvest.resourceId;
    const yieldAmt = targetCreature.harvest.yieldAmount;

    // Add resource to inventory
    setResources(prevRes =>
      prevRes.map(r => {
        if (r.id === resId) {
          return { ...r, count: r.count + yieldAmt };
        }
        return r;
      })
    );

    // Reset creature harvest timestamp
    setCreatures(prevCreatures =>
      prevCreatures.map(c => {
        if (c.id === creatureId) {
          return {
            ...c,
            harvest: {
              ...c.harvest,
              lastHarvestTimestamp: Date.now()
            }
          };
        }
        return c;
      })
    );

    showToast(`✨ تم حصاد +${yieldAmt} من ${targetCreature.harvest.resourceName}!`);
  };

  // Adopting a new creature/plant
  const handleAdoptNewCreature = (species: SpeciesType) => {
    const costs: Record<SpeciesType, number> = {
      dog: 500,
      horse: 800,
      plant: 350,
      pigeon: 400
    };

    const cost = costs[species];
    if (empire.gold < cost) {
      playSound('error');
      showToast('⚠️ لا يوجد رصيد ذهب كافٍ للاستيراد!');
      return;
    }

    setEmpire(prev => ({ ...prev, gold: prev.gold - cost }));

    const meta = SPECIES_METADATA[species];
    const newId = 'crit_' + Date.now();
    const names = {
      dog: ['رعد الأطلس', 'بركان بافاريا', 'ظبيان الصحراء'],
      horse: ['شقران الخالدية', 'عساف الشقب', 'دهماء الجزيرة'],
      plant: ['عرعر جبال الألب', 'سيكويا الأخشاب الحمراء', 'أرز جبال طروادة'],
      pigeon: ['نسر الأفق السريع', 'سفير المسافات الطويلة', 'شهاب بلجيكا']
    }[species];

    const randomName = names[Math.floor(Math.random() * names.length)];

    const newCrit: Creature = {
      id: newId,
      name: randomName,
      species,
      breedName: meta.labelArabic,
      gender: species === 'plant' ? 'asexual' : Math.random() > 0.5 ? 'M' : 'F',
      birthRealTimestamp: Date.now(),
      ageDaysCalculated: 120,
      stage: 'juvenile',
      imageIcon: meta.icon,
      avatarBg: 'from-amber-950/40 to-slate-900',
      rarity: meta.defaultRarity,
      dna: {
        drive: Math.floor(Math.random() * 20 + 75),
        stature: Math.floor(Math.random() * 20 + 75),
        temperament: Math.floor(Math.random() * 20 + 75),
        coatQuality: Math.floor(Math.random() * 20 + 75),
        stamina: Math.floor(Math.random() * 20 + 75),
        geneticPurity: Math.floor(Math.random() * 15 + 80),
        mutations: [],
        genotype: {
          alleles: `IMP-${species.toUpperCase()}-01`,
          lineName: 'سلالة برية مستوردة',
          isCHICVerified: true,
          isFCICertified: true
        }
      },
      harvest: {
        ...meta.defaultHarvest,
        lastHarvestTimestamp: Date.now()
      },
      titles: ['سلالة أساسية مستوردة'],
      lineage: {
        generation: 1
      },
      stats: {
        wins: 0,
        podiums: 0,
        totalEarnings: 0
      },
      priceEstimate: cost * 1.5
    };

    setCreatures(prev => [newCrit, ...prev]);
    playSound('coin');
    showToast(`🎉 تم استيراد "${newCrit.name}" بنجاح وانضمامه للمحمية!`);
  };

  // Start workshop production
  const handleStartProduction = (workshopId: string, recipeId: string) => {
    const ws = workshops.find(w => w.id === workshopId);
    const rcp = WORKSHOP_RECIPES.find(r => r.id === recipeId);
    if (!ws || !rcp) return;

    // Deduct inputs from resources
    setResources(prevRes => {
      const nextRes = [...prevRes];
      rcp.inputs.forEach(inp => {
        const itemIdx = nextRes.findIndex(r => r.id === inp.resourceId);
        if (itemIdx >= 0) {
          nextRes[itemIdx] = {
            ...nextRes[itemIdx],
            count: Math.max(0, nextRes[itemIdx].count - inp.amount)
          };
        }
      });
      return nextRes;
    });

    const durationSec = Math.round(rcp.durationSec / ws.speedMultiplier);
    const now = Date.now();

    setWorkshops(prevWorkshops =>
      prevWorkshops.map(w => {
        if (w.id === workshopId) {
          return {
            ...w,
            activeProduction: {
              recipeId,
              startedAt: now,
              durationSec,
              endsAt: now + durationSec * 1000
            }
          };
        }
        return w;
      })
    );

    showToast(`⚙️ بدأ خط الإنتاج في "${ws.name}" (${rcp.name})!`);
  };

  // Collect finished workshop production
  const handleCollectProduction = (workshopId: string) => {
    const ws = workshops.find(w => w.id === workshopId);
    if (!ws || !ws.activeProduction) return;

    const rcp = WORKSHOP_RECIPES.find(r => r.id === ws.activeProduction!.recipeId);
    if (!rcp) return;

    // Check masterwork double yield roll
    const isMasterwork = Math.random() < ws.masterworkChance;
    const finalYield = isMasterwork ? rcp.outputCount * 2 : rcp.outputCount;

    setResources(prevRes =>
      prevRes.map(r => {
        if (r.id === rcp.outputResourceId) {
          return { ...r, count: r.count + finalYield };
        }
        return r;
      })
    );

    // Clear production in workshop
    setWorkshops(prevWorkshops =>
      prevWorkshops.map(w => {
        if (w.id === workshopId) {
          return { ...w, activeProduction: null };
        }
        return w;
      })
    );

    if (isMasterwork) {
      showToast(`🌟 إنتاج أسطوري مضاعف! استلمت +${finalYield} من ${rcp.name}!`);
    } else {
      showToast(`📦 تم استلام +${finalYield} من ${rcp.name} وإضافتها للمستودع!`);
    }
  };

  // Upgrade workshop
  const handleUpgradeWorkshop = (workshopId: string) => {
    const ws = workshops.find(w => w.id === workshopId);
    if (!ws) return;

    if (empire.gold < ws.upgradeCostGold || empire.stars < ws.upgradeCostStars) return;

    setEmpire(prev => ({
      ...prev,
      gold: prev.gold - ws.upgradeCostGold,
      stars: prev.stars - ws.upgradeCostStars
    }));

    setWorkshops(prevWorkshops =>
      prevWorkshops.map(w => {
        if (w.id === workshopId) {
          return {
            ...w,
            level: w.level + 1,
            speedMultiplier: Number((w.speedMultiplier + 0.25).toFixed(2)),
            upgradeCostGold: Math.round(w.upgradeCostGold * 1.8),
            upgradeCostStars: Math.round(w.upgradeCostStars * 1.5),
            masterworkChance: Number((w.masterworkChance + 0.05).toFixed(2))
          };
        }
        return w;
      })
    );

    showToast(`🚀 تم ترقية "${ws.name}" إلى المستوى ${ws.level + 1}!`);
  };

  // Complete export contract
  const handleCompleteContract = (contractId: string) => {
    const contract = contracts.find(c => c.id === contractId);
    if (!contract || contract.isCompleted) return;

    // Deduct required resources
    setResources(prevRes => {
      const next = [...prevRes];
      contract.requirements.forEach(req => {
        if (req.type === 'resource' && req.resourceId) {
          const idx = next.findIndex(r => r.id === req.resourceId);
          if (idx >= 0) {
            next[idx] = {
              ...next[idx],
              count: Math.max(0, next[idx].count - req.amount)
            };
          }
        }
      });
      return next;
    });

    // Reward Empire
    setEmpire(prev => {
      const newXp = prev.fameXp + contract.rewardXp;
      const leveledUp = newXp >= prev.fameXpMax;
      const nextLevel = leveledUp ? prev.fameLevel + 1 : prev.fameLevel;
      const nextXp = leveledUp ? newXp - prev.fameXpMax : newXp;
      const nextMaxXp = leveledUp ? Math.round(prev.fameXpMax * 1.5) : prev.fameXpMax;

      if (leveledUp) {
        playSound('levelUp');
      }

      return {
        ...prev,
        gold: prev.gold + contract.rewardGold,
        stars: prev.stars + contract.rewardStars,
        fameLevel: nextLevel,
        fameXp: nextXp,
        fameXpMax: nextMaxXp
      };
    });

    // Mark completed
    setContracts(prev =>
      prev.map(c => (c.id === contractId ? { ...c, isCompleted: true } : c))
    );

    showToast(`🚢 تم تصدير الشحنة الدولية! حصدت +${contract.rewardGold} ذهب و +${contract.rewardStars}⭐ نجمة!`);
  };

  // Apply booster to creature
  const handleApplyBooster = (creatureId: string, resourceId: string) => {
    const item = resources.find(r => r.id === resourceId);
    if (!item || item.count <= 0 || !item.boostEffect) return;

    // Deduct 1 item
    setResources(prev =>
      prev.map(r => (r.id === resourceId ? { ...r, count: r.count - 1 } : r))
    );

    // Boost creature DNA stat
    setCreatures(prev =>
      prev.map(c => {
        if (c.id === creatureId) {
          const currentVal = c.dna[item.boostEffect!.stat] as number;
          const newVal = Math.min(100, currentVal + item.boostEffect!.value);
          return {
            ...c,
            dna: {
              ...c.dna,
              [item.boostEffect!.stat]: newVal
            }
          };
        }
        return c;
      })
    );

    showToast(`✨ تم تعزيز الكائن بـ "${item.name}" (${item.boostEffect.label})!`);
  };

  // Handle Offspring born from breeding modal
  const handleOffspringBorn = (newborn: Creature, usedTonic: boolean) => {
    if (usedTonic) {
      setResources(prev =>
        prev.map(r => (r.id === 'fertility_tonic' ? { ...r, count: Math.max(0, r.count - 1) } : r))
      );
    }

    setCreatures(prev => [newborn, ...prev]);
    showToast(`🎉 وُلد سليل جديد في المحمية: "${newborn.name}" بالجيل #${newborn.lineage.generation}!`);
  };

  // Match finished in tournament modal
  const handleMatchFinished = (
    isWinner: boolean,
    prizeGold: number,
    prizeStars: number,
    titleAward: string
  ) => {
    if (!activeTournamentMatch) return;

    if (isWinner) {
      // Award player
      setEmpire(prev => ({
        ...prev,
        gold: prev.gold + prizeGold,
        stars: prev.stars + prizeStars
      }));

      // Add title & win stat to creature
      setCreatures(prev =>
        prev.map(c => {
          if (c.id === activeTournamentMatch.creature.id) {
            return {
              ...c,
              titles: [titleAward, ...c.titles],
              stats: {
                ...c.stats,
                wins: c.stats.wins + 1,
                totalEarnings: c.stats.totalEarnings + prizeGold
              }
            };
          }
          return c;
        })
      );

      showToast(`🏆 تتويج ملكي! فاز بطلنا بالجائزة الكبرى +${prizeGold} ذهب و +${prizeStars}⭐!`);
    } else {
      // Participation reward
      setEmpire(prev => ({
        ...prev,
        gold: prev.gold + Math.round(prizeGold * 0.15)
      }));
    }
  };

  // Sell commodity in market
  const handleSellResource = (resourceId: string, amount: number) => {
    const item = resources.find(r => r.id === resourceId);
    if (!item || item.count < amount) return;

    const earnedGold = item.basePrice * amount;

    setResources(prev =>
      prev.map(r => (r.id === resourceId ? { ...r, count: r.count - amount } : r))
    );

    setEmpire(prev => ({
      ...prev,
      gold: prev.gold + earnedGold
    }));

    showToast(`🪙 تم بيع ×${amount} من "${item.name}" مقابل +${earnedGold.toLocaleString()} ذهب!`);
  };

  // Buy auction creature
  const handleBuyAuctionCreature = (stud: Creature) => {
    if (empire.gold < stud.priceEstimate) return;

    setEmpire(prev => ({
      ...prev,
      gold: prev.gold - stud.priceEstimate
    }));

    const newCreature: Creature = {
      ...stud,
      id: 'crit_auction_' + Date.now()
    };

    setCreatures(prev => [newCreature, ...prev]);
    showToast(`👑 تم ضم الفحل الأسطوري "${stud.name}" إلى محميتك بنجاح!`);
  };

  // Reset save
  const handleReset = () => {
    localStorage.clear();
    setEmpire(INITIAL_EMPIRE);
    setCreatures(INITIAL_CREATURES);
    setResources(INITIAL_RESOURCES);
    setWorkshops(INITIAL_WORKSHOPS);
    setContracts(INITIAL_EXPORT_CONTRACTS);
    playSound('coin');
    showToast('🔄 تمت إعادة تعيين المحمية والمصانع إلى الحالة الأولى!');
  };

  // Ready badge counts for Navigation
  const readyHarvestsCount = creatures.filter(c => {
    const elapsed = (Date.now() - c.harvest.lastHarvestTimestamp) / 1000;
    return elapsed >= c.harvest.intervalSec;
  }).length;

  const readyCraftsCount = workshops.filter(w => {
    return w.activeProduction !== null && Date.now() >= w.activeProduction.endsAt;
  }).length;

  const readyContractsCount = contracts.filter(c => {
    if (c.isCompleted) return false;
    return c.requirements.every(req => {
      if (req.type === 'resource' && req.resourceId) {
        const item = resources.find(r => r.id === req.resourceId);
        return item ? item.count >= req.amount : false;
      }
      return true;
    });
  }).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 pb-16">
      
      {/* Top Header */}
      <Header
        empire={empire}
        onToggleSound={() => setEmpire(p => ({ ...p, soundEnabled: !p.soundEnabled }))}
        onToggleSpeed={() => setEmpire(p => ({ ...p, isSpeedActive: !p.isSpeedActive }))}
        onReset={handleReset}
      />

      {/* Primary Tab Navigation */}
      <Navigation
        activeTab={empire.activeTab}
        onChangeTab={tab => setEmpire(p => ({ ...p, activeTab: tab }))}
        readyHarvestsCount={readyHarvestsCount}
        readyCraftsCount={readyCraftsCount}
        readyContractsCount={readyContractsCount}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-6 flex-1">
        {empire.activeTab === 'sanctuary' && (
          <SanctuaryView
            creatures={creatures}
            onOpenPassport={c => setPassportCreature(c)}
            onOpenBreeding={c => {
              setBreedingInitialCreature(c || null);
              setIsBreedingModalOpen(true);
            }}
            onHarvestCreature={handleHarvestCreature}
            onAdoptNewCreature={handleAdoptNewCreature}
            gold={empire.gold}
          />
        )}

        {empire.activeTab === 'workshops' && (
          <WorkshopsView
            workshops={workshops}
            recipes={WORKSHOP_RECIPES}
            resources={resources}
            gold={empire.gold}
            stars={empire.stars}
            onStartProduction={handleStartProduction}
            onCollectProduction={handleCollectProduction}
            onUpgradeWorkshop={handleUpgradeWorkshop}
          />
        )}

        {empire.activeTab === 'export_board' && (
          <ExportBoardView
            contracts={contracts}
            resources={resources}
            onCompleteContract={handleCompleteContract}
          />
        )}

        {empire.activeTab === 'tournaments' && (
          <TournamentsView
            tournaments={tournaments}
            creatures={creatures}
            gold={empire.gold}
            onEnterTournament={(t, c) => {
              // Deduct fee
              setEmpire(prev => ({ ...prev, gold: prev.gold - t.entryFeeGold }));
              setActiveTournamentMatch({ tournament: t, creature: c });
            }}
          />
        )}

        {empire.activeTab === 'market' && (
          <MarketView
            resources={resources}
            gold={empire.gold}
            onSellResource={handleSellResource}
            onBuyAuctionCreature={handleBuyAuctionCreature}
          />
        )}
      </main>

      {/* DNA Passport Modal */}
      {passportCreature && (
        <DnaPassportModal
          creature={passportCreature}
          onClose={() => setPassportCreature(null)}
          onOpenBreeding={c => {
            setPassportCreature(null);
            setBreedingInitialCreature(c);
            setIsBreedingModalOpen(true);
          }}
          availableBoosters={resources.filter(r => r.count > 0 && r.boostEffect)}
          onApplyBooster={handleApplyBooster}
        />
      )}

      {/* Breeding Lab Modal */}
      {isBreedingModalOpen && (
        <BreedingModal
          initialCreature={breedingInitialCreature}
          allCreatures={creatures}
          fertilityTonicsCount={resources.find(r => r.id === 'fertility_tonic')?.count || 0}
          onClose={() => {
            setIsBreedingModalOpen(false);
            setBreedingInitialCreature(null);
          }}
          onOffspringBorn={handleOffspringBorn}
        />
      )}

      {/* Active Tournament Match Simulator Modal */}
      {activeTournamentMatch && (
        <TournamentMatchModal
          tournament={activeTournamentMatch.tournament}
          creature={activeTournamentMatch.creature}
          onClose={() => setActiveTournamentMatch(null)}
          onMatchFinished={handleMatchFinished}
        />
      )}

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 border border-amber-500/50 text-amber-100 px-4 py-2.5 rounded-2xl shadow-2xl shadow-amber-950/80 text-xs sm:text-sm font-bold animate-in slide-in-from-bottom-5 duration-300 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
