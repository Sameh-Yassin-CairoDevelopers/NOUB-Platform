import { Creature, CreatureDNA, CreatureRarity, SpeciesType } from '../types';

export const RARITY_COLORS: Record<CreatureRarity, { bg: string; text: string; border: string; glow: string }> = {
  'Common': { bg: 'bg-slate-800/80', text: 'text-slate-300', border: 'border-slate-700', glow: 'shadow-slate-900/50' },
  'Rare': { bg: 'bg-blue-950/80', text: 'text-blue-400', border: 'border-blue-500/40', glow: 'shadow-blue-500/20' },
  'Epic': { bg: 'bg-purple-950/80', text: 'text-purple-300', border: 'border-purple-500/50', glow: 'shadow-purple-500/30' },
  'Legendary': { bg: 'bg-amber-950/80', text: 'text-amber-300', border: 'border-amber-500/60', glow: 'shadow-amber-500/40' },
  'Royal Masterpiece': { bg: 'bg-gradient-to-br from-amber-900/90 via-emerald-950/90 to-amber-950/90', text: 'text-yellow-200', border: 'border-yellow-400/80', glow: 'shadow-yellow-400/50' }
};

export const SPECIES_METADATA: Record<SpeciesType, {
  labelArabic: string;
  icon: string;
  defaultRarity: CreatureRarity;
  defaultHarvest: { resourceId: string; resourceName: string; icon: string; intervalSec: number; yieldAmount: number };
}> = {
  dog: {
    labelArabic: 'سلالات الكلاب النخبة',
    icon: '🐕',
    defaultRarity: 'Epic',
    defaultHarvest: { resourceId: 'dna_hair_sample', resourceName: 'عينات DNA نقية', icon: '🧬', intervalSec: 15, yieldAmount: 2 }
  },
  horse: {
    labelArabic: 'الخيول العربية الأصيلة',
    icon: '🐎',
    defaultRarity: 'Legendary',
    defaultHarvest: { resourceId: 'pure_manure', resourceName: 'سماد عضوي ملكي', icon: '🌱', intervalSec: 12, yieldAmount: 3 }
  },
  plant: {
    labelArabic: 'مشتل البونساي والأعشاب',
    icon: '🌿',
    defaultRarity: 'Rare',
    defaultHarvest: { resourceId: 'lavender_extract', resourceName: 'أزهار لافندر جبلية', icon: '🪻', intervalSec: 8, yieldAmount: 4 }
  },
  pigeon: {
    labelArabic: 'حمام الزاجل الأولمبي',
    icon: '🕊️',
    defaultRarity: 'Rare',
    defaultHarvest: { resourceId: 'aerodynamic_feather', resourceName: 'ريش ملاحة عالي الكثافة', icon: '🪶', intervalSec: 10, yieldAmount: 2 }
  }
};

const POSSIBLE_MUTATIONS = [
  'طفرة الأليلات الذهبية (زيادة نقاء النسب +15%)',
  'ألياف عضلية سريعة الانقباض (دافع وسرعة +12)',
  'ريش مقاوم للرياح العاتية (ملاحة فائقة +18)',
  'خشب جين أثري متحجر (تناغم بونساي +20)',
  'مفاصل فسيولوجية خالية من التشوهات (CHIC Gold Star)',
  'مزاج حديدي وثبات ميداني تحت الضغط (+15)'
];

export function calculateOverallGeneticScore(dna: CreatureDNA): number {
  const avg = (dna.drive + dna.stature + dna.temperament + dna.coatQuality + dna.stamina + dna.geneticPurity) / 6;
  return Math.round(avg);
}

export function determineRarityFromScore(score: number): CreatureRarity {
  if (score >= 92) return 'Royal Masterpiece';
  if (score >= 82) return 'Legendary';
  if (score >= 70) return 'Epic';
  if (score >= 55) return 'Rare';
  return 'Common';
}

export function estimateCreaturePrice(creature: Creature): number {
  const score = calculateOverallGeneticScore(creature.dna);
  const titlesBonus = creature.titles.length * 1200;
  const winsBonus = creature.stats.wins * 450;
  const rarityMultiplier = {
    'Common': 1.0,
    'Rare': 1.6,
    'Epic': 2.8,
    'Legendary': 5.0,
    'Royal Masterpiece': 10.0
  }[creature.rarity];

  const baseVal = (score * score * 1.8) * rarityMultiplier;
  return Math.round(baseVal + titlesBonus + winsBonus);
}

export function simulateBreeding(sire: Creature, dam: Creature, generation: number): Creature {
  // Mendelian trait inheritance with variance and mutation chance
  const blend = (valA: number, valB: number) => {
    const mean = (valA + valB) / 2;
    // Hybrid vigor or slight regression variance (-4 to +8)
    const variance = (Math.random() * 12) - 4;
    return Math.min(100, Math.max(15, Math.round(mean + variance)));
  };

  const inheritedDrive = blend(sire.dna.drive, dam.dna.drive);
  const inheritedStature = blend(sire.dna.stature, dam.dna.stature);
  const inheritedTemperament = blend(sire.dna.temperament, dam.dna.temperament);
  const inheritedCoat = blend(sire.dna.coatQuality, dam.dna.coatQuality);
  const inheritedStamina = blend(sire.dna.stamina, dam.dna.stamina);
  
  // Genetic purity / Inbreeding calculation
  const isSameLine = sire.dna.genotype.lineName === dam.dna.genotype.lineName;
  const purityBase = (sire.dna.geneticPurity + dam.dna.geneticPurity) / 2;
  const purityVal = isSameLine 
    ? Math.min(100, Math.round(purityBase + (Math.random() * 6 - 2)))
    : Math.min(100, Math.round(purityBase + 5)); // Outcross hybrid vigor

  // Mutation roll (25% chance)
  const mutations: string[] = [];
  if (Math.random() < 0.28) {
    const randomMutation = POSSIBLE_MUTATIONS[Math.floor(Math.random() * POSSIBLE_MUTATIONS.length)];
    mutations.push(randomMutation);
  }

  const newDNA: CreatureDNA = {
    drive: inheritedDrive,
    stature: inheritedStature,
    temperament: inheritedTemperament,
    coatQuality: inheritedCoat,
    stamina: inheritedStamina,
    geneticPurity: purityVal,
    mutations,
    genotype: {
      alleles: `${sire.dna.genotype.alleles.slice(0, 3)}-${dam.dna.genotype.alleles.slice(0, 3)}`,
      lineName: isSameLine ? sire.dna.genotype.lineName : `${sire.dna.genotype.lineName} × ${dam.dna.genotype.lineName}`,
      isCHICVerified: purityVal > 78,
      isFCICertified: purityVal > 75 && (inheritedStature + inheritedTemperament) > 140
    }
  };

  const score = calculateOverallGeneticScore(newDNA);
  const rarity = determineRarityFromScore(score);

  const maleNames = ['عزّام', 'صخر', 'بركان', 'شاهين', 'رعد', 'سلطان', 'تاج', 'كايزر', 'فيلو', 'ظبيان'];
  const femaleNames = ['نجلاء', 'درّة', 'شهباء', 'نجمة', 'ياقوتة', 'بشرى', 'كليوباترا', 'أورا', 'هيبة', 'سحابة'];
  const gender = Math.random() > 0.5 ? 'M' : 'F';
  const namePool = gender === 'M' ? maleNames : femaleNames;
  const chosenName = namePool[Math.floor(Math.random() * namePool.length)] + ` سليل ${sire.name.split(' ')[0]}`;

  const defaultMeta = SPECIES_METADATA[sire.species];

  const baby: Creature = {
    id: 'crit_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    name: chosenName,
    species: sire.species,
    breedName: sire.breedName,
    gender,
    birthRealTimestamp: Date.now(),
    ageDaysCalculated: 1,
    stage: 'newborn',
    imageIcon: sire.imageIcon,
    avatarBg: sire.avatarBg,
    rarity,
    dna: newDNA,
    harvest: {
      ...defaultMeta.defaultHarvest,
      lastHarvestTimestamp: Date.now()
    },
    titles: score >= 85 ? ['موهبة وراثية واعدة'] : [],
    lineage: {
      sire: sire.name,
      dam: dam.name,
      generation: generation + 1
    },
    stats: {
      wins: 0,
      podiums: 0,
      totalEarnings: 0
    },
    priceEstimate: 0
  };

  baby.priceEstimate = estimateCreaturePrice(baby);
  return baby;
}
