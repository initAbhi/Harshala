let highestZ = 1;

class Paper {
  holdingPaper = false;
  startX = 0;
  startY = 0;
  moveX = 0;
  moveY = 0;
  prevX = 0;
  prevY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const updateTransform = () => {
      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    };

    const calculateRotation = (x, y) => {
      const dirX = x - this.startX;
      const dirY = y - this.startY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      if (dirLength === 0) return;

      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;
      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      this.rotation = (360 + Math.round(degrees)) % 360;
    };

    const handleMove = (x, y) => {
      if (!this.rotating) {
        this.velX = x - this.prevX;
        this.velY = y - this.prevY;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        } else {
          calculateRotation(x, y);
        }

        this.prevX = x;
        this.prevY = y;

        updateTransform();
      }
    };

    if (isTouch) {
      // TOUCH EVENTS (Mobile)
      paper.addEventListener('touchstart', (e) => {
        if (this.holdingPaper) return;
        this.holdingPaper = true;

        paper.style.zIndex = highestZ++;
        const touch = e.touches[0];

        this.startX = touch.clientX;
        this.startY = touch.clientY;
        this.prevX = this.startX;
        this.prevY = this.startY;
      });

      paper.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        this.moveX = touch.clientX;
        this.moveY = touch.clientY;
        handleMove(this.moveX, this.moveY);
      });

      paper.addEventListener('touchend', () => {
        this.holdingPaper = false;
        this.rotating = false;
      });

      paper.addEventListener('gesturestart', (e) => {
        e.preventDefault();
        this.rotating = true;
      });

      paper.addEventListener('gestureend', () => {
        this.rotating = false;
      });
    } else {
      // MOUSE EVENTS (Desktop)
      document.addEventListener('mousemove', (e) => {
        this.moveX = e.clientX;
        this.moveY = e.clientY;
        handleMove(this.moveX, this.moveY);
      });

      paper.addEventListener('mousedown', (e) => {
        if (this.holdingPaper) return;
        this.holdingPaper = true;

        paper.style.zIndex = highestZ++;
        this.prevX = this.moveX;
        this.prevY = this.moveY;
        this.startX = this.moveX;
        this.startY = this.moveY;

        if (e.button === 2) {
          this.rotating = true;
        }
      });

      window.addEventListener('mouseup', () => {
        this.holdingPaper = false;
        this.rotating = false;
      });
    }
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
