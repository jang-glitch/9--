import { GAME_CONFIG } from './config.js';

export function createDefaultProgress() {
  return {
    coins: GAME_CONFIG.player.initialCoins,
    experience: GAME_CONFIG.player.initialExperience,
    currentStageIndex: GAME_CONFIG.player.initialStageIndex,
    gameCompleted: false,
    purchasedUpgradeIds: [],
  };
}

export function loadProgress() {
  try {
    const saved = localStorage.getItem(GAME_CONFIG.storage.progressKey);
    return saved ? { ...createDefaultProgress(), ...JSON.parse(saved) } : createDefaultProgress();
  } catch {
    return createDefaultProgress();
  }
}

export function saveProgress(progress) {
  localStorage.setItem(GAME_CONFIG.storage.progressKey, JSON.stringify(progress));
}

export function resetProgress() {
  const progress = createDefaultProgress();
  saveProgress(progress);
  return progress;
}

export function getWageBonus(progress) {
  return GAME_CONFIG.rewards.initialWageBonus + GAME_CONFIG.upgrades
    .filter((upgrade) => progress.purchasedUpgradeIds.includes(upgrade.id))
    .reduce((total, upgrade) => total + (upgrade.wageBonus ?? 0), 0);
}

export function getMaxSatisfaction(progress) {
  return GAME_CONFIG.customer.initialSatisfaction + GAME_CONFIG.upgrades
    .filter((upgrade) => progress.purchasedUpgradeIds.includes(upgrade.id))
    .reduce((total, upgrade) => total + (upgrade.satisfactionBonus ?? 0), 0);
}

export function buyUpgrade(progress, upgradeId) {
  const upgrade = GAME_CONFIG.upgrades.find((item) => item.id === upgradeId);
  if (!upgrade || progress.purchasedUpgradeIds.includes(upgrade.id) || progress.coins < upgrade.cost) {
    return false;
  }
  progress.coins -= upgrade.cost;
  progress.purchasedUpgradeIds.push(upgrade.id);
  saveProgress(progress);
  return true;
}
