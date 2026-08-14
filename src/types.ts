export type Utensil = {
  title: string;
  score?: number;
  wins?: number;
  losses?: number;
};

export type Ranking = {
  id: number;
  name: string;
  createdAt?: string;
  rankedUtensils: Utensil[];
  type: string;
  combos?: number[][];
  winnersHistory?: number[];
  userID?: string;
  username?: string;
};

export type Set = {
  id: string;
  name: string;
  createdAt?: string;
  utensils: Utensil[];
  discoverable?: boolean;
  userID?: string;
  username?: string;
};

export type Profile = {
  username: string;
  createdAt: string;
  rankings: Ranking[];
  sets: Set[];
};
