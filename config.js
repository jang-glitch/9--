export const GAME_CONFIG = {
  canvas: {
    width: 960,
    height: 600,
  },
  clock: {
    tickMilliseconds: 1000,
  },
  player: {
    initialStageIndex: 0,
    initialCoins: 0,
    initialExperience: 0,
    initialSales: 0,
  },
  startup: {
    stageQueryParameter: 'stage',
    invalidStageIndex: -1,
  },
  customer: {
    initialSatisfaction: 3,
    failureSatisfaction: 0,
    waitingSatisfactionIntervalSeconds: 20,
  },
  rewards: {
    orderPrice: 10,
    experiencePerOrder: 5,
    initialWageBonus: 1,
  },
  storage: {
    progressKey: 'bubble-tea-store-progress',
  },
  upgrades: [
    { id: 'teaBase', name: '티 베이스 추출기', cost: 15, wageBonus: 1 },
    { id: 'seating', name: '대기석 확장', cost: 30, satisfactionBonus: 1 },
    { id: 'renewal', name: '매장 리뉴얼', cost: 50, wageBonus: 2 },
  ],
};
