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
  associatedSetID?: number;
  //likes: number;
  userID?: string;
  username?: string;
};

export type Set = {
  id: number;
  name: string;
  createdAt?: string;
  utensils: Utensil[];
  discoverable?: boolean;
  //saves: number;
  userID?: string;
  username?: string;
};

export type Profile = {
  id: string;
  username: string;
  createdAt: string;
  ownedRankings: number[];
  ownedSets: number[];
};
