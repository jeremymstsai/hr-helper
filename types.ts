export interface Person {
  id: string;
  name: string;
}

export enum AppMode {
  INPUT = 'INPUT',
  DRAW = 'DRAW',
  GROUPS = 'GROUPS',
}

export interface DrawSettings {
  allowRepeats: boolean;
  confetti: boolean;
}

export interface GroupSettings {
  groupSize: number;
}
