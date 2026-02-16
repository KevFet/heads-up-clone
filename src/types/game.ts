
export type Language = 'en' | 'fr' | 'es-MX';

export interface ThemeItem {
  id: string;
  translations: Record<Language, string>;
}

export interface Theme {
  id: string;
  icon: string;
  name: Record<Language, string>;
  items: ThemeItem[];
}

export type GameState = 'LOBBY' | 'INSTRUCTIONS' | 'PLAYING' | 'RESULTS';

export interface ScoreEntry {
  word: string;
  status: 'correct' | 'pass';
}
