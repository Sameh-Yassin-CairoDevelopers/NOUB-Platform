export type SpeciesType = 'dog' | 'horse' | 'plant' | 'pigeon';

export type CreatureRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Royal Masterpiece';

export interface CreatureDNA {
  drive: number; // 1-100 (الدافع والشغف)
  stature: number; // 1-100 (البنية والتشريح)
  temperament: number; // 1-100 (المزاج والثبات الذهني)
  coatQuality: number; // 1-100 (جودة الفراء/الريش/أوراق الشجر)
  stamina: number; // 1-100 (التحمل والسرعة)
  geneticPurity: number; // 1-100 (معامل نقاء السلالة)
  mutations: string[];
  genotype: {
    alleles: string;
    lineName: string;
    isCHICVerified: boolean;
    isFCICertified: boolean;
  };
}

export interface CreatureHarvest {
  resourceId: string;
  resourceName: string;
  icon: string;
  intervalSec: number;
  lastHarvestTimestamp: number;
  yieldAmount: number;
}

export interface Creature {
  id: string;
  name: string;
  species: SpeciesType;
  breedName: string;
  gender: 'M' | 'F' | 'asexual';
  birthRealTimestamp: number; // Real-world creation timestamp
  ageDaysCalculated: number; // In-game days accelerated by 89x
  stage: 'newborn' | 'juvenile' | 'prime' | 'veteran';
  imageIcon: string;
  avatarBg: string;
  rarity: CreatureRarity;
  dna: CreatureDNA;
  harvest: CreatureHarvest;
  titles: string[];
  lineage: {
    sire?: string;
    dam?: string;
    generation: number;
  };
  equippedItemId?: string;
  stats: {
    wins: number;
    podiums: number;
    totalEarnings: number;
  };
  priceEstimate: number;
}

export type ResourceCategory = 'raw' | 'elixir' | 'feed' | 'tack' | 'genomic' | 'token';

export interface ResourceItem {
  id: string;
  name: string;
  category: ResourceCategory;
  icon: string;
  rarity: CreatureRarity;
  count: number;
  basePrice: number;
  description: string;
  boostEffect?: {
    stat: keyof CreatureDNA;
    value: number;
    label: string;
  };
}

export type WorkshopType = 'apothecary' | 'feed_mill' | 'leather_tack' | 'genomics_lab';

export interface WorkshopRecipe {
  id: string;
  name: string;
  workshopType: WorkshopType;
  outputResourceId: string;
  outputCount: number;
  durationSec: number;
  requiredLevel: number;
  inputs: { resourceId: string; amount: number }[];
  description: string;
  icon: string;
}

export interface ActiveProduction {
  recipeId: string;
  startedAt: number;
  durationSec: number;
  endsAt: number;
}

export interface Workshop {
  id: string;
  type: WorkshopType;
  name: string;
  arabicTitle: string;
  level: number; // 1 - 5
  description: string;
  icon: string;
  activeProduction: ActiveProduction | null;
  upgradeCostGold: number;
  upgradeCostStars: number;
  speedMultiplier: number;
  masterworkChance: number; // Chance to double yield
}

export interface ExportContract {
  id: string;
  clientName: string;
  clientTitle: string;
  clientAvatar: string;
  organization: string;
  requirements: {
    type: 'resource' | 'creature';
    resourceId?: string;
    species?: SpeciesType;
    minGeneticPurity?: number;
    amount: number;
    label: string;
    icon: string;
  }[];
  rewardGold: number;
  rewardStars: number;
  rewardXp: number;
  expiresInSec: number;
  isCompleted: boolean;
}

export type TournamentCategory = 'sieger_igp' | 'arabian_cup' | 'bonsai_expo' | 'pigeon_derby';

export interface Tournament {
  id: string;
  category: TournamentCategory;
  title: string;
  subtitle: string;
  icon: string;
  requiredSpecies: SpeciesType;
  minGeneticScore: number;
  entryFeeGold: number;
  prizeGold: number;
  prizeStars: number;
  championshipTitleAward: string;
  rewardItemRewardId?: string;
  difficulty: 'مبتدئ' | 'محترف' | 'بطولة ملكية';
  statFocus: (keyof CreatureDNA)[];
  description: string;
}

export interface PlayerEmpire {
  name: string;
  dynastyTitle: string;
  gold: number;
  stars: number;
  fameLevel: number;
  fameXp: number;
  fameXpMax: number;
  gameSpeed: number; // 89x default
  isSpeedActive: boolean;
  soundEnabled: boolean;
  activeTab: 'sanctuary' | 'workshops' | 'export_board' | 'tournaments' | 'market';
  lastTickTimestamp: number;
}
