import { GAME_CONFIG } from './config.js';
import { ACTIONS, RECIPES } from './game-data.js';
import { buyUpgrade, getMaxSatisfaction, getWageBonus, loadProgress, resetProgress, saveProgress } from './progress.js';
import { STAGE_DATA } from './stageData.js';

const COLORS = { ink: 0x2d2427, background: 0xf7f1eb, counter: 0xd8b99a, card: 0xffffff, accent: 0x8b3a52, good: 0x49764d, bad: 0xb44747 };

function getQueryStageIndex() {
  const id = Number(new URLSearchParams(window.location.search).get(GAME_CONFIG.startup.stageQueryParameter));
  const index = STAGE_DATA.findIndex((stage) => stage.id === id);
  return index === GAME_CONFIG.startup.invalidStageIndex ? null : index;
}

class BubbleTeaScene extends Phaser.Scene {
  create() {
    this.progress = loadProgress();
    this.queryStageIndex = getQueryStageIndex();
    if (this.queryStageIndex === null && this.progress.gameCompleted) {
      this.showGameComplete();
      return;
    }
    this.startLevel(this.queryStageIndex ?? this.progress.currentStageIndex);
  }

  showGameComplete() {
    this.levelIndex = STAGE_DATA.length - 1;
    this.level = STAGE_DATA[this.levelIndex];
    this.remainingTime = 0;
    this.sales = this.level.targetSales;
    this.selectedSteps = [];
    this.orders = [];
    this.selectedOrderId = null;
    this.finished = true;
    this.result = { success: true, message: 'MVP 3개 레벨을 모두 완료했습니다.' };
    this.render();
  }

  startLevel(levelIndex) {
    if (this.clock) this.clock.remove(false);
    this.levelIndex = levelIndex;
    this.level = STAGE_DATA[levelIndex];
    this.remainingTime = this.level.timeLimitSeconds;
    this.sales = GAME_CONFIG.player.initialSales;
    this.selectedSteps = [];
    this.feedback = '주문 순서대로 재료를 선택하세요.';
    this.finished = false;
    this.result = null;
    this.orders = this.level.recipeKeys.map((recipeKey, index) => ({
      id: index,
      ...RECIPES[recipeKey],
      customerName: `손님 ${index + 1}`,
      appearAtSeconds: this.level.customerAppearAtSeconds[index],
      appeared: false,
      served: false,
      waitSeconds: 0,
      maxSatisfaction: getMaxSatisfaction(this.progress),
      satisfaction: getMaxSatisfaction(this.progress),
    }));
    this.selectedOrderId = null;
    this.revealDueOrders();
    this.selectFirstAvailableOrder();
    this.render();
    this.clock = this.time.addEvent({ delay: GAME_CONFIG.clock.tickMilliseconds, loop: true, callback: () => this.tick() });
  }

  tick() {
    this.remainingTime -= 1;
    this.revealDueOrders();
    this.updateWaitingSatisfaction();
    if (this.finished) return;
    if (this.remainingTime <= 0) {
      this.remainingTime = 0;
      this.finishLevel(false, '시간이 초과되었습니다.');
      return;
    }
    this.render();
  }

  revealDueOrders() {
    const elapsed = this.level.timeLimitSeconds - this.remainingTime;
    this.orders.filter((order) => !order.appeared && order.appearAtSeconds <= elapsed)
      .forEach((order) => { order.appeared = true; });
  }

  revealNextOrder() {
    const next = this.orders.find((order) => !order.appeared);
    if (next) next.appeared = true;
  }

  updateWaitingSatisfaction() {
    const active = this.getSelectedOrder();
    this.getAvailableOrders().forEach((order) => {
      if (order.id === active?.id) return;
      order.waitSeconds += 1;
      if (order.waitSeconds % GAME_CONFIG.customer.waitingSatisfactionIntervalSeconds === 0) {
        order.satisfaction -= 1;
        if (order.satisfaction === GAME_CONFIG.customer.failureSatisfaction) {
          this.finishLevel(false, `${order.customerName}의 만족도가 소진되었습니다.`);
        }
      }
    });
  }

  getAvailableOrders() { return this.orders.filter((order) => order.appeared && !order.served); }
  getSelectedOrder() { return this.orders.find((order) => order.id === this.selectedOrderId && !order.served); }
  isManufacturingLocked() { return this.selectedSteps.length > 0; }

  selectFirstAvailableOrder() {
    if (!this.getSelectedOrder()) this.selectedOrderId = this.getAvailableOrders()[0]?.id ?? null;
  }

  selectOrder(orderId) {
    if (this.finished || this.isManufacturingLocked()) return;
    this.selectedOrderId = orderId;
    this.render();
  }

  render() {
    this.children.removeAll(true);
    this.add.rectangle(480, 300, GAME_CONFIG.canvas.width, GAME_CONFIG.canvas.height, COLORS.background);
    this.add.rectangle(480, 468, GAME_CONFIG.canvas.width, 264, COLORS.counter);
    this.drawHud();
    this.drawCustomer();
    this.drawOrderCard();
    this.drawQueue();
    this.drawStation();
    if (this.finished) this.drawResult();
  }

  drawHud() {
    this.add.text(28, 20, `레벨 ${this.level.id} · 알바`, this.textStyle(22, '#2d2427', true));
    this.add.text(28, 52, `남은 시간 ${this.remainingTime}초`, this.textStyle(18, '#2d2427'));
    this.add.text(300, 20, `매출 ${this.sales} / ${this.level.targetSales} 코인`, this.textStyle(22, '#2d2427', true));
    this.add.text(300, 52, `보유 돈 ${this.progress.coins} · 경험치 ${this.progress.experience}`, this.textStyle(18, '#2d2427'));
    this.add.text(710, 20, `시급 보너스 +${getWageBonus(this.progress)}코인`, this.textStyle(18, '#49764d', true));
  }

  drawCustomer() {
    const order = this.getSelectedOrder();
    if (!order) {
      this.add.text(174, 290, '다음 손님을\n기다리는 중입니다.', this.textStyle(20, '#6b5a5e', true)).setOrigin(0.5);
      return;
    }
    this.add.rectangle(174, 280, 246, 225, 0xfffbf6, 0.9).setStrokeStyle(2, COLORS.ink);
    this.add.circle(174, 216, 48, 0xf0c7a5);
    this.add.circle(157, 208, 6, COLORS.ink);
    this.add.circle(191, 208, 6, COLORS.ink);
    this.add.arc(174, 228, 20, 0, 180, false).setStrokeStyle(3, COLORS.ink);
    this.add.rectangle(174, 267, 102, 70, COLORS.accent).setOrigin(0.5, 0);
    this.add.text(174, 350, order.customerName, this.textStyle(22, '#2d2427', true)).setOrigin(0.5);
    this.add.text(174, 382, `만족도 ${'♥'.repeat(order.satisfaction)}${'♡'.repeat(order.maxSatisfaction - order.satisfaction)}`, this.textStyle(16, '#8b3a52')).setOrigin(0.5);
  }

  drawOrderCard() {
    const order = this.getSelectedOrder();
    this.add.rectangle(480, 266, 324, 230, COLORS.card).setStrokeStyle(2, COLORS.ink);
    if (!order) {
      this.add.text(480, 250, '다음 주문 대기 중', this.textStyle(24, '#6b5a5e', true)).setOrigin(0.5);
      return;
    }
    this.add.text(332, 162, '현재 주문', this.textStyle(22, '#2d2427', true));
    this.add.text(332, 200, order.name, this.textStyle(28, '#8b3a52', true));
    this.add.text(332, 245, `제조 순서: ${order.steps.join(' → ')}`, this.textStyle(14, '#2d2427')).setWordWrapWidth(290);
    this.add.text(332, 320, `판매가 ${GAME_CONFIG.rewards.orderPrice}코인`, this.textStyle(17, '#49764d', true));
  }

  drawQueue() {
    this.add.text(700, 104, '대기열', this.textStyle(20, '#2d2427', true));
    this.getAvailableOrders().forEach((order, index) => {
      const selected = order.id === this.selectedOrderId;
      const y = 140 + index * 78;
      const card = this.add.rectangle(810, y, 270, 66, selected ? 0xf5d8df : 0xfffbf6).setStrokeStyle(2, COLORS.ink);
      this.add.text(680, y - 24, `${order.customerName} · ${order.name}`, this.textStyle(15, '#2d2427', selected));
      this.add.text(680, y, `♥ ${order.satisfaction}/${order.maxSatisfaction} · 대기 ${order.waitSeconds}초`, this.textStyle(14, '#6b5a5e'));
      if (!this.isManufacturingLocked()) {
        card.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.selectOrder(order.id));
      }
    });
  }

  drawStation() {
    const order = this.getSelectedOrder();
    const feedback = this.feedback ?? '주문 순서대로 재료를 선택하세요.';
    this.add.text(32, 425, '제조대', this.textStyle(23, '#2d2427', true));
    this.add.text(32, 458, feedback, this.textStyle(16, feedback.includes('틀') ? '#b44747' : '#49764d'));
    this.add.text(32, 486, `선택한 재료: ${this.selectedSteps.length ? this.selectedSteps.join(' → ') : '아직 없음'}`, this.textStyle(15, '#2d2427'));
    ACTIONS.forEach((action, index) => {
      const x = 70 + (index % 4) * 145;
      const y = 530 + Math.floor(index / 4) * 42;
      this.button(x, y, 130, 34, action, () => this.chooseStep(action), this.finished || !order || this.isDrinkReady());
    });
    this.button(755, 530, 160, 54, this.isDrinkReady() ? '손님에게 전달' : '제조 중', () => this.serveOrder(), !this.isDrinkReady() || this.finished, this.isDrinkReady() ? COLORS.good : 0x8c7f79);
  }

  chooseStep(action) {
    const order = this.getSelectedOrder();
    if (this.finished || !order || this.isDrinkReady()) return;
    if (action !== order.steps[this.selectedSteps.length]) {
      this.selectedSteps = [];
      order.satisfaction -= 1;
      this.feedback = '순서가 틀렸습니다. 현재 음료를 처음부터 다시 만드세요. (만족도 -1)';
      if (order.satisfaction === GAME_CONFIG.customer.failureSatisfaction) {
        this.finishLevel(false, `${order.customerName}의 만족도가 소진되었습니다.`);
        return;
      }
    } else {
      this.selectedSteps.push(action);
      this.feedback = this.isDrinkReady() ? '음료가 완성되었습니다. 손님에게 전달하세요!' : `${action}을(를) 넣었습니다.`;
    }
    this.render();
  }

  isDrinkReady() {
    const order = this.getSelectedOrder();
    return order && this.selectedSteps.length === order.steps.length;
  }

  serveOrder() {
    const order = this.getSelectedOrder();
    if (!order || !this.isDrinkReady() || this.finished) return;
    order.served = true;
    this.sales += GAME_CONFIG.rewards.orderPrice;
    this.progress.coins += GAME_CONFIG.rewards.orderPrice + getWageBonus(this.progress);
    this.progress.experience += GAME_CONFIG.rewards.experiencePerOrder;
    this.selectedSteps = [];
    this.feedback = `${order.customerName} 주문 완료! +${GAME_CONFIG.rewards.orderPrice}코인, 시급 +${getWageBonus(this.progress)}코인, 경험치 +${GAME_CONFIG.rewards.experiencePerOrder}`;
    if (!this.getAvailableOrders().length) this.revealNextOrder();
    this.selectFirstAvailableOrder();
    saveProgress(this.progress);
    if (this.orders.every((item) => item.served)) {
      this.finishLevel(this.sales >= this.level.targetSales, '모든 주문을 전달했습니다!');
      return;
    }
    this.render();
  }

  finishLevel(success, message) {
    if (this.finished) return;
    this.finished = true;
    if (this.clock) this.clock.remove(false);
    this.result = { success, message };
    if (this.queryStageIndex === null && success) {
      this.progress.currentStageIndex = Math.min(this.levelIndex + 1, STAGE_DATA.length - 1);
      if (this.levelIndex === STAGE_DATA.length - 1) this.progress.gameCompleted = true;
    }
    if (this.queryStageIndex === null && !success) this.progress.currentStageIndex = this.levelIndex;
    saveProgress(this.progress);
    this.render();
  }

  drawResult() {
    const { success, message } = this.result;
    this.add.rectangle(480, 300, 960, 600, COLORS.ink, 0.78);
    this.add.text(480, 125, success ? '레벨 성공!' : '레벨 실패', this.textStyle(34, '#ffffff', true)).setOrigin(0.5);
    this.add.text(480, 170, message, this.textStyle(18, '#ffffff')).setOrigin(0.5);
    this.add.text(480, 202, `보유 돈 ${this.progress.coins} · 경험치 ${this.progress.experience}`, this.textStyle(17, '#ffffff')).setOrigin(0.5);
    this.add.text(480, 242, '매장 업그레이드', this.textStyle(20, '#ffffff', true)).setOrigin(0.5);
    GAME_CONFIG.upgrades.forEach((upgrade, index) => {
      const purchased = this.progress.purchasedUpgradeIds.includes(upgrade.id);
      const label = purchased ? `${upgrade.name} · 구매 완료` : `${upgrade.name} · ${upgrade.cost}코인`;
      this.button(480, 282 + index * 44, 280, 34, label, () => this.purchaseUpgrade(upgrade.id), purchased || this.progress.coins < upgrade.cost, purchased ? COLORS.good : COLORS.accent);
    });
    const isLast = this.levelIndex === STAGE_DATA.length - 1;
    const nextLabel = success && !isLast ? '다음 레벨' : success ? '새 게임' : '다시 도전';
    this.button(480, 445, 220, 50, nextLabel, () => this.continueFromResult(success, isLast), false, COLORS.accent);
  }

  purchaseUpgrade(id) {
    if (buyUpgrade(this.progress, id)) this.render();
  }

  continueFromResult(success, isLast) {
    if (success && isLast) {
      this.progress = resetProgress();
      this.queryStageIndex = null;
      this.startLevel(GAME_CONFIG.player.initialStageIndex);
      return;
    }
    this.startLevel(success ? this.levelIndex + 1 : this.levelIndex);
  }

  button(x, y, width, height, label, handler, disabled, color = COLORS.accent) {
    const rect = this.add.rectangle(x, y, width, height, disabled ? 0xb9aea9 : color).setStrokeStyle(1, COLORS.ink);
    const text = this.add.text(x, y, label, this.textStyle(14, '#ffffff', true)).setOrigin(0.5);
    if (!disabled) {
      rect.setInteractive({ useHandCursor: true }).on('pointerdown', handler);
      text.setInteractive({ useHandCursor: true }).on('pointerdown', handler);
    }
  }

  textStyle(size, color, bold = false) { return { fontFamily: 'Arial', fontSize: `${size}px`, color, fontStyle: bold ? 'bold' : 'normal' }; }
}

new Phaser.Game({ type: Phaser.CANVAS, parent: 'game', width: GAME_CONFIG.canvas.width, height: GAME_CONFIG.canvas.height, backgroundColor: '#f7f1eb', scene: BubbleTeaScene });
