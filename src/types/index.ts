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

/* types from supabase (in snake case) */

export type RankingData = {
  id: number;
  name: string;
  created_at?: string;
  ranked_utensils: Utensil[];
  type: string;
  combos?: number[][];
  winners_history?: number[];
  associated_set_id?: number;
  //likes: number;
  user_id?: string;
  username?: string;
};

export type SetData = {
  id: number;
  name: string;
  created_at?: string;
  utensils: Utensil[];
  discoverable?: boolean;
  //saves: number;
  user_id?: string;
  username?: string;
};

export type ProfileData = {
  id: string;
  username: string;
  created_at: string;
  owned_rankings: number[];
  owned_sets: number[];
};
