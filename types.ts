export interface LogEntry {
  id: string;
  text: string;
  type: 'command' | 'output' | 'error' | 'success' | 'info' | 'warning';
  delay?: number;
}

export type GameMode = 'RPG' | 'HARDWARE' | 'TERMINAL' | 'GAMEOVER' | 'WIN';
export type Language = 'EN' | 'RU';

export interface RPGState {
  currentLocation: string;
  inventory: string[];
  suspicion: number;
  doorUnlocked: boolean;
  guardBypassed: boolean;
  dialogActive: boolean;
  codeFound: boolean;
}

export interface HardwareState {
  leftPorts: string[];  // ['A', 'B', 'C', 'D']
  rightPorts: string[]; // ['1', '2', '3', '4']
  // Maps Port ID to Color string
  colorMap: Record<string, string>; 
  connections: [string, string][]; // Pairs of [Left, Right]
  strikes: number;
}

export interface TerminalState {
  targetIp: string | null;
  exploited: boolean;
  logsCleared: boolean;
}

export interface GameState {
  language: Language;
  mode: GameMode;
  rpg: RPGState;
  hardware: HardwareState | null;
  terminal: TerminalState;
}

export interface LocationDef {
  id: string;
  name: string;
  description: string;
  exits: Record<string, string>; // direction -> locationId
  interactables?: Record<string, string>; // item -> description/action
}

export interface GameContent {
  LOCATIONS: Record<string, LocationDef>;
  MESSAGES: Record<string, string>;
  HINTS: Record<string, string>;
  GUARD_DIALOG: string;
}