import {
  DIFFICULTY_LEVELS,
  LEVEL_RANGES,
  OynaGG_EVENTS,
  OynaGG_FEATURES,
  OynaGG_SYSTEMS,
  SERVER_TYPES,
} from '@/lib/helpersConstants'

export type GameTypePreferences = {
  levelRanges?: string[]
  difficultyLevels?: string[]
  serverTypes?: string[]
  systems?: string[]
  features?: string[]
  events?: string[]
  labels?: {
    systems?: string
    features?: string
    events?: string
  }
  required?: {
    levelRange?: boolean
    difficulty?: boolean
    serverType?: boolean
  }
}

export const GAME_TYPE_PREFERENCES: Record<string, GameTypePreferences> = {
  metin2: {
    levelRanges: LEVEL_RANGES,
    difficultyLevels: DIFFICULTY_LEVELS,
    serverTypes: SERVER_TYPES,
    systems: OynaGG_SYSTEMS,
    features: OynaGG_FEATURES,
    events: OynaGG_EVENTS,
  },
  minecraft: {
    serverTypes: [
      'Survival',
      'Skyblock',
      'Factions',
      'Prison',
      'Creative',
      'MiniGames',
      'Modlu',
      'Other',
    ],
    systems: [
      'Ekonomi',
      'Arazi Koruma',
      'Özel Efsunlar',
      'Klanlar',
      'Kits',
      'Kasalar',
      'Açık Artırma',
      'McMMO',
    ],
    features: [
      'Vanilla',
      'Survival',
      'PvP',
      'PvE',
      'Crossplay',
      'Custom Enchants',
      'Market',
      'Boss Eventleri',
    ],
    events: [
      'Drop Party',
      'Build Yarışması',
      'PvP Turnuvası',
      'Treasure Hunt',
      'Sezon Reset',
    ],
    required: {
      serverType: true,
    },
  },
  rust: {
    serverTypes: [
      'Vanilla',
      'Modlu',
      'PvE',
      'PvP',
      'Softcore',
      'Hardcore',
      'Roleplay',
      'Training',
      'Other',
    ],
    systems: [
      'Çarpan (Rate) Ayarları',
      'Klan Sistemi',
      'Kits',
      'VIP',
      'Base Decay',
      'Takım Limitleri',
      'Blueprint Kısıtı',
      'Anti-Cheat',
    ],
    features: [
      'Haftalık Wipe',
      'Aylık Wipe',
      'Harita Boyutu Küçük',
      'Harita Boyutu Büyük',
      'Noob Friendly',
      'Hardcore',
      'Roleplay',
    ],
    events: [
      'Raid Weekend',
      'AirDrop Etkinliği',
      'Heli/Bradley',
      'Cargo Event',
      'Oil Rig Event',
    ],
    required: {
      serverType: true,
    },
  },
}

export const getGameTypePreferences = (gameType?: { gameTypeCode?: string; title?: string }) => {
  if (!gameType) return GAME_TYPE_PREFERENCES.metin2
  const code = (gameType.gameTypeCode || '').toLowerCase()
  if (GAME_TYPE_PREFERENCES[code]) return GAME_TYPE_PREFERENCES[code]
  const title = (gameType.title || '').toLowerCase()
  if (title.includes('metin')) return GAME_TYPE_PREFERENCES.metin2
  if (title.includes('minecraft')) return GAME_TYPE_PREFERENCES.minecraft
  if (title.includes('rust')) return GAME_TYPE_PREFERENCES.rust
  return GAME_TYPE_PREFERENCES.metin2
}
