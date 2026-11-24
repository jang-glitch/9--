import { GAME_CONFIG } from './config.js';
import { ACTIONS, RECIPES } from './game-data.js';
import { STAGE_DATA } from './stageData.js';

const COLORS = {
  ink: 0x2d2427,
  background: 0xf7f1eb,
  counter: 0xd8b99a,
  card: 0xffffff,
  accent: 0x8b3a52,
  good: 0x49764d,
};

function getStartStageIndex() {
  const stageId = Number(
    new URLSearchParams(window.location.search).get(GAME_CONFIG.startup.stageQueryParameter),
  );
  const stageIndex = STAGE_DATA.findIndex((stage) => stage.id === stageId);
  return stageIndex === GAME_CONFIG.startup.invalidStageIndex
    ? GAME_CONFIG.player.initialStageIndex
    : stageIndex;
}

class BubbleTeaScene extends Phaser.Scene {
  create() {
    this.coins = GAME_CONFIG.player.initialCoins;
    this.xp = GAME_CONFIG.player.initialExperience;
    this.startLevel(getStartStageIndex());
  }

  startLevel(levelIndex) {
    if (this.clock) this.clock.remove(false);
    this.levelIndex = levelIndex;
    this.level = STAGE_DATA[levelIndex];
    this.stageOrders = this.level.recipeKeys.map((recipeKey, index) => ({
      ...RECIPES[recipeKey],
      price: GAME_CONFIG.rewards.orderPrice,
      customerName: `손님 ${index + 1}`,
      appearAtSeconds: this.level.customerAppearAtSeconds[index],
    }));
    this.orders = [];
    this.currentOrderIndex = 0;
    this.sales = GAME_CONFIG.player.initialSales;
    this.satisfaction = GAME_CONFIG.customer.initialSatisfaction;
    this.remainingTime = this.level.timeLimitSeconds;
    this.selectedSteps = [];
    this.feedback = '주문 순서대로 재료를 선택하세요.';
    this.finished = false;
    this.addArrivedOrders();
    this.render();
    this.clock = this.time.addEvent({
      delay: GAME_CONFIG.clock.tickMilliseconds,
      loop: true,
      callback: () => {
        this.remainingTime -= 1;
        this.addArrivedOrders();
        if (this.remainingTime <= 0) {
          this.remainingTime = 0;
          this.finishLevel(false, '시간이 초과되었습니다.');
          return;
        }
        this.render();
      },
    });
  }

  render() {
    this.children.removeAll(true);
    this.add.rectangle(480, 300, 960, 600, COLORS.background);
    this.add.rectangle(480, 468, 960, 264, COLORS.counter);
    this.drawHud();
    this.drawCustomer();
    this.drawOrderCard();
    this.drawQueue();
    this.drawStation();
  }

  drawHud() {
    this.add.text(28, 22, `레벨 ${this.levelIndex + 1}`, this.textStyle(24, '#2d2427', true));
    this.add.text(28, 58, `남은 시간  ${this.remainingTime}초`, this.textStyle(20, '#2d2427'));
    this.add.text(330, 22, `매출  ${this.sales} / ${this.level.targetSales} 코인`, this.textStyle(24, '#2d2427', true));
    this.add.text(330, 58, `코인 ${this.coins}   경험치 ${this.xp}`, this.textStyle(20, '#2d2427'));
    this.add.text(744, 22, `만족도  ${'♥'.repeat(this.satisfaction)}${'♡'.repeat(GAME_CONFIG.customer.initialSatisfaction - this.satisfaction)}`,
      this.textStyle(24, '#8b3a52', true));
  }

  drawCustomer() {
    const order = this.orders[this.currentOrderIndex];
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
    this.add.text(174, 354, order.customerName, this.textStyle(22, '#2d2427', true)).setOrigin(0.5);
    this.add.text(174, 385, '주문을 기다리고 있어요', this.textStyle(15, '#6b5a5e')).setOrigin(0.5);
  }

  drawOrderCard() {
    const order = this.orders[this.currentOrderIndex];
    if (!order) {
      this.add.rectangle(480, 266, 324, 230, COLORS.card).setStrokeStyle(2, COLORS.ink);
      this.add.text(480, 250, '다음 주문 대기 중', this.textStyle(24, '#6b5a5e', true)).setOrigin(0.5);
      return;
    }
    this.add.rectangle(480, 266, 324, 230, COLORS.card).setStrokeStyle(2, COLORS.ink);
    this.add.text(332, 162, '현재 주문', this.textStyle(22, '#2d2427', true));
    this.add.text(332, 200, order.name, this.textStyle(28, '#8b3a52', true));
    this.add.text(332, 245, `제조 순서: ${order.steps.join(' → ')}`,
      this.textStyle(14, '#2d2427')).setWordWrapWidth(290);
    this.add.text(332, 320, `완성 가격  ${order.price} 코인`, this.textStyle(17, '#49764d', true));
  }

  drawQueue() {
    this.add.text(700, 136, '대기열', this.textStyle(20, '#2d2427', true));
    this.orders.forEach((order, index) => {
      const active = index === this.currentOrderIndex;
      this.add.rectangle(800, 162 + index * 62, 260, 50, active ? 0xf5d8df : 0xfffbf6).setStrokeStyle(2, COLORS.ink);
      this.add.text(682, 148 + index * 62, `${index + 1}. ${order.customerName}`, this.textStyle(16, '#2d2427', active));
      this.add.text(682, 170 + index * 62, order.name, this.textStyle(14, '#6b5a5e'));
    });
  }

  drawStation() {
    this.add.text(32, 425, '제조대', this.textStyle(23, '#2d2427', true));
    const feedbackColor = this.feedback.includes('틀') || this.feedback.includes('초과') ? '#b44747' : '#49764d';
    this.add.text(32, 458, this.feedback, this.textStyle(16, feedbackColor));
    this.add.text(32, 486, `선택한 재료: ${this.selectedSteps.length ? this.selectedSteps.join(' → ') : '아직 없음'}`,
      this.textStyle(15, '#2d2427'));

    ACTIONS.forEach((action, index) => {
      const x = 70 + (index % 4) * 145;
      const y = 530 + Math.floor(index / 4) * 42;
      this.button(x, y, 130, 34, action, () => this.chooseStep(action), this.finished || !this.hasActiveOrder() || this.isDrinkReady());
    });

    this.button(755, 530, 160, 54, this.isDrinkReady() ? '손님에게 전달' : '제조 중',
      () => this.serveOrder(), !this.isDrinkReady() || this.finished, this.isDrinkReady() ? COLORS.good : 0x8c7f79);
  }

  chooseStep(action) {
    if (this.finished || !this.hasActiveOrder() || this.isDrinkReady()) return;
    const order = this.orders[this.currentOrderIndex];
    if (action !== order.steps[this.selectedSteps.length]) {
      this.selectedSteps = [];
      this.satisfaction -= 1;
      this.feedback = '순서가 틀렸습니다. 처음부터 다시 제조하세요. (만족도 -1)';
      if (this.satisfaction === GAME_CONFIG.customer.failureSatisfaction) {
        this.finishLevel(false, '손님 만족도가 모두 소진되었습니다.');
        return;
      }
    } else {
      this.selectedSteps.push(action);
      this.feedback = this.isDrinkReady() ? '음료가 완성되었습니다. 손님에게 전달하세요!' : `${action}을(를) 넣었습니다.`;
    }
    this.render();
  }

  isDrinkReady() {
    const order = this.orders[this.currentOrderIndex];
    return order && this.selectedSteps.length === order.steps.length;
  }

  hasActiveOrder() {
    return this.currentOrderIndex < this.orders.length;
  }

  addArrivedOrders() {
    const elapsedSeconds = this.level.timeLimitSeconds - this.remainingTime;
    while (
      this.orders.length < this.stageOrders.length
      && this.stageOrders[this.orders.length].appearAtSeconds <= elapsedSeconds
    ) {
      this.releaseNextOrder();
    }
  }

  releaseNextOrder() {
    if (this.orders.length < this.stageOrders.length) {
      this.orders.push(this.stageOrders[this.orders.length]);
    }
  }

  serveOrder() {
    if (!this.isDrinkReady() || this.finished) return;
    const order = this.orders[this.currentOrderIndex];
    this.sales += order.price;
    this.coins += order.price;
    this.xp += GAME_CONFIG.rewards.experiencePerOrder;
    this.currentOrderIndex += 1;
    this.selectedSteps = [];
    if (this.currentOrderIndex === this.stageOrders.length) {
      this.finishLevel(this.sales >= this.level.targetSales, '모든 주문을 전달했습니다!');
      return;
    }
    if (!this.hasActiveOrder()) this.releaseNextOrder();
    this.feedback = this.hasActiveOrder()
      ? `${order.customerName} 주문 완료! 다음 손님 주문을 확인하세요.`
      : `${order.customerName} 주문 완료! 다음 손님을 기다리는 중입니다.`;
    this.render();
  }

  finishLevel(success, message) {
    if (this.finished) return;
    this.finished = true;
    if (this.clock) this.clock.remove(false);
    this.render();
    this.add.rectangle(480, 300, 960, 600, 0x2d2427, 0.72);
    this.add.text(480, 218, success ? '레벨 성공!' : '레벨 실패', this.textStyle(38, '#ffffff', true)).setOrigin(0.5);
    const detail = success && this.levelIndex === STAGE_DATA.length - 1 ? '모든 프로토타입 레벨을 완료했습니다.' : message;
    this.add.text(480, 276, detail, this.textStyle(20, '#ffffff')).setOrigin(0.5);
    this.add.text(480, 312, `최종 매출 ${this.sales} 코인 · 누적 경험치 ${this.xp}`, this.textStyle(18, '#ffffff')).setOrigin(0.5);
    const label = success && this.levelIndex < STAGE_DATA.length - 1 ? '다음 레벨' : '처음부터 다시 하기';
    this.button(480, 380, 220, 54, label, () => {
      if (success && this.levelIndex < STAGE_DATA.length - 1) this.startLevel(this.levelIndex + 1);
      else {
        this.coins = GAME_CONFIG.player.initialCoins;
        this.xp = GAME_CONFIG.player.initialExperience;
        this.startLevel(GAME_CONFIG.player.initialStageIndex);
      }
    }, false, COLORS.accent);
  }

  button(x, y, width, height, label, handler, disabled, color = COLORS.accent) {
    const rect = this.add.rectangle(x, y, width, height, disabled ? 0xb9aea9 : color).setStrokeStyle(1, COLORS.ink);
    const text = this.add.text(x, y, label, this.textStyle(15, '#ffffff', true)).setOrigin(0.5);
    if (!disabled) {
      rect.setInteractive({ useHandCursor: true });
      rect.on('pointerdown', handler);
      rect.on('pointerover', () => rect.setFillStyle(0x633040));
      rect.on('pointerout', () => rect.setFillStyle(color));
      text.setInteractive({ useHandCursor: true }).on('pointerdown', handler);
    }
  }

  textStyle(size, color, bold = false) {
    return { fontFamily: 'Arial', fontSize: `${size}px`, color, fontStyle: bold ? 'bold' : 'normal' };
  }
}

new Phaser.Game({
  type: Phaser.CANVAS,
  parent: 'game',
  width: GAME_CONFIG.canvas.width,
  height: GAME_CONFIG.canvas.height,
  backgroundColor: '#f7f1eb',
  scene: BubbleTeaScene,
});
