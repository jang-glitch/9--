export const STAGE_DATA = [
  {
    id: 1,
    timeLimitSeconds: 60,
    targetSales: 10,
    customerCount: 1,
    recipeKeys: ['brownSugar'],
    customerAppearAtSeconds: [0],
  },
  {
    id: 2,
    timeLimitSeconds: 75,
    targetSales: 20,
    customerCount: 2,
    recipeKeys: ['brownSugar', 'milkTea'],
    customerAppearAtSeconds: [0, 15],
  },
  {
    id: 3,
    timeLimitSeconds: 90,
    targetSales: 50,
    customerCount: 5,
    recipeKeys: ['brownSugar', 'milkTea', 'mangoTea', 'brownSugar', 'milkTea'],
    customerAppearAtSeconds: [0, 12, 24, 36, 48],
  },
];
