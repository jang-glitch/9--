export const ACTIONS = [
  '홍차', '우유', '타피오카 펄', '흑당 시럽',
  '망고 시럽', '얼음 보통', '당도 50%', '당도 100%',
];

export const RECIPES = {
  brownSugar: {
    name: '흑당 버블티',
    steps: ['홍차', '타피오카 펄', '흑당 시럽', '얼음 보통', '당도 50%'],
    price: 10,
  },
  milkTea: {
    name: '밀크티',
    steps: ['홍차', '우유', '타피오카 펄', '얼음 보통', '당도 100%'],
    price: 10,
  },
  mangoTea: {
    name: '망고티',
    steps: ['홍차', '망고 시럽', '얼음 보통', '당도 50%'],
    price: 10,
  },
};

export const LEVELS = [
  { time: 45, target: 10, recipes: ['brownSugar'] },
  { time: 75, target: 30, recipes: ['brownSugar', 'milkTea', 'mangoTea'] },
];
