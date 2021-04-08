class Platform {
  constructor(y, width, number, type) {
    this.x =
      type === 1
        ? Math.floor(
            Math.random() * (canvas.width - platformWidth - slime.width * 2.4) +
              slime.width * 1.2
          )
        : Math.floor(
            Math.random() * (canvas.width - platformWidth - slime.width * 1) +
              slime.width * 0.5
          );
    this.y = y;
    this.width = width;
    this.number = number;
    this.type = type;
    this.broken = false;
  }
}
