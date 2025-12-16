import { Person } from './types';

// Simple UUID generator for frontend
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const parseNames = (input: string): Person[] => {
  const lines = input.split(/[\n,]+/).map(line => line.trim()).filter(line => line.length > 0);
  return lines.map(name => ({
    id: generateId(),
    name: name
  }));
};

// Fisher-Yates Shuffle
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};