// data/portalData.ts
export interface Portal {
  id: number;
  name: string;
  location: { latitude: number; longitude: number };
  level: number;
  owner: string | null;
  faction: string | null;
  energy?: number;
  resonators?: any[];
  mods?: any[];
}

export const initialPortals: Portal[] = [
  {
    id: 1,
    name: '中央公园',
    location: { latitude: 39.9042, longitude: 116.4074 },
    level: 1,
    owner: null,
    faction: null,
    energy: 0,
    resonators: [],
    mods: []
  },
  {
    id: 2,
    name: '科技大厦',
    location: { latitude: 39.9082, longitude: 116.4074 },
    level: 2,
    owner: null,
    faction: null,
    energy: 0,
    resonators: [],
    mods: []
  },
  {
    id: 3,
    name: '历史博物馆',
    location: { latitude: 39.9002, longitude: 116.4074 },
    level: 1,
    owner: null,
    faction: null,
    energy: 0,
    resonators: [],
    mods: []
  },
  {
    id: 4,
    name: '艺术中心',
    location: { latitude: 39.9042, longitude: 116.4114 },
    level: 3,
    owner: null,
    faction: null,
    energy: 0,
    resonators: [],
    mods: []
  }
];