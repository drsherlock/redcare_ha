export const calculateWeightedScore = (repo: {
  stars: number;
  forks: number;
  daysSinceUpdate: number;
}): number => {
  const STARS_WEIGHT = process.env.STARS_WEIGHT ? parseFloat(process.env.STARS_WEIGHT) : 1;
  const FORKS_WEIGHT = process.env.FORKS_WEIGHT ? parseFloat(process.env.FORKS_WEIGHT) : 1;
  const RECENCY_WEIGHT = process.env.RECENCY_WEIGHT ? parseFloat(process.env.RECENCY_WEIGHT) : 20;
  const HALF_LIFE_DAYS = process.env.HALF_LIFE_DAYS ? parseFloat(process.env.HALF_LIFE_DAYS) : 30;

  const ln = (x: number) => Math.log(1 + Math.max(0, x));
  const decay = Math.exp(-repo.daysSinceUpdate / HALF_LIFE_DAYS);

  const score =
    STARS_WEIGHT * ln(repo.stars) + FORKS_WEIGHT * ln(repo.forks) + RECENCY_WEIGHT * decay;

  return score;
};
