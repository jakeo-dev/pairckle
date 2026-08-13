export type Utensil = {
  title: string;
  score?: number;
  wins?: number;
  losses?: number;
};

export type Ranking = {
  rankingName: string;
  rankingDate: {
    month: number;
    day: number;
    year: number;
  };
  rankingType: string;
  rankedUtensils: Utensil[];
};

export type Set = {
  id: string;
  name: string;
  utensils: Utensil[];
  username?: string;
  sharedAt?: string;
  discoverable?: boolean;
};

export type Profile = {
  username: string;
  created_at: string;
  rankings: Ranking[],
  sets: Set[]
};
