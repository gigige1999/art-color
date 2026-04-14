
export interface ColorInfo {
  name: string;
  hex: string;
  rgb: string;
  cmyk: string;
}

export interface PaletteResult {
  moodTitle: string;
  colors: ColorInfo[];
}

export interface HistoryItem {
  id: string;
  image: string;
  moodTitle: string;
  colors: ColorInfo[];
  timestamp: number;
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}
