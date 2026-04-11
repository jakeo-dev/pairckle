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
