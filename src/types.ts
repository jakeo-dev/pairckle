export type Utensil = {
  title: string;
  score: number;
  wins: number;
  losses: number;
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
  setName: string;
  utensils: string[];
  username?: string;
  sharedAt?: string;
};

export interface SharedSetData {
  id: string;
  shared_at: string;
  name: string;
  username: string;
  utensils: string[];
}
