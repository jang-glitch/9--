const ORDER = {
  customerName: '손님 1',
  drink: '흑당 버블티',
  ice: '얼음 보통',
  sugar: '당도 50%',
};

class OrderScene extends Phaser.Scene {
  constructor() {
    super('order');
  }

  create() {
    this.add.rectangle(480, 270, 960, 540, 0xf7f1eb);
    this.add.rectangle(480, 410, 960, 260, 0xd8b99a);
    this.add.rectangle(190, 325, 210, 150, 0xfffbf6, 0x95);

    this.add.text(32, 28, '주문 접수', {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: '#2d2427',
      fontStyle: 'bold',
    });

    this.drawCustomer();
    this.drawOrderCard();
  }

  drawCustomer() {
    this.add.circle(190, 215, 58, 0xf0c7a5);
    this.add.circle(168, 202, 8, 0x2d2427);
    this.add.circle(212, 202, 8, 0x2d2427);
    this.add.arc(190, 225, 26, 0, 180, false, 0x2d2427).setLineWidth(4);
    this.add.rectangle(190, 365, 118, 95, 0x8b5e5e).setOrigin(0.5, 0);
    this.add.text(190, 478, ORDER.customerName, {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#2d2427',
      fontStyle: 'bold',
    }).setOrigin(0.5);
  }

  drawOrderCard() {
    this.add.rectangle(650, 292, 410, 336, 0xffffff).setStrokeStyle(3, 0x2d2427);
    this.add.text(475, 145, '주문서', {
      fontFamily: 'Arial',
      fontSize: '30px',
      color: '#2d2427',
      fontStyle: 'bold',
    });
    this.add.text(475, 205, ORDER.customerName, {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#6b5a5e',
    });
    this.add.line(475, 240, 825, 240, 0x2d2427);
    this.add.text(475, 265, ORDER.drink, {
      fontFamily: 'Arial',
      fontSize: '32px',
      color: '#8b3a52',
      fontStyle: 'bold',
    });
    this.add.text(475, 323, ORDER.ice, {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#2d2427',
    });
    this.add.text(475, 365, ORDER.sugar, {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#2d2427',
    });
    this.add.text(475, 432, '제조 기능은 다음 작업에서 추가합니다.', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#6b5a5e',
    });
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 960,
  height: 540,
  backgroundColor: '#f7f1eb',
  scene: OrderScene,
});
