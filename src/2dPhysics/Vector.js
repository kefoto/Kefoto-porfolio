export class Vector {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  
    add(v) {
      return new Vector(this.x + v.x, this.y + v.y);
    }
  
    subtr(v) {
      return new Vector(this.x - v.x, this.y - v.y);
    }
  
    mag() {
      return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
  
    mult(n) {
      return new Vector(this.x * n, this.y * n);
    }
  
    normal() {
      return new Vector(-this.y, this.x).unit();
    }
  
    copy() {
      return new Vector(this.x, this.y);
    }
  
    unit() {
      if (this.mag() === 0) {
        return new Vector(0, 0);
      } else {
        return new Vector(this.x / this.mag(), this.y / this.mag());
      }
    }
  
    drawVec(start_x, start_y, n, color) {
      ctx.beginPath();
      ctx.moveTo(start_x, start_y);
      ctx.lineTo(start_x + this.x * n, start_y + this.y * n);
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.closePath();
    }
  
    dot(v1) {
      return this.x * v1.x + this.y * v1.y;
    }
  }