import { Vector } from "./Vector.js";
export var balls = [];
import { canvas, ctx } from "../canvas.js";

let friction = 0.04;
const epsilon = 1e-4;

export class Ball {
  constructor(x, y, r, id) {
    this.id = id;
    this.pos = new Vector(x, y);
    this.r = r;
    this.velo = new Vector(0, 0);
    this.acce = new Vector(0, 0);
    this.acceleration = 0.15;
    this.isDragging = false;
    this.isMoving = false;
    this._latest_points = [];
    this._angle_samples = [];
    this.centripetal_acce = new Vector(0, 0);
    this.prev_acce_vector = new Vector(0, 0);
    balls.push(this);
  }

  drawBall() {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
  }

  drawPoints() {
    ctx.beginPath();
    for (const _x_y of this._latest_points) {
      ctx.arc(_x_y[0], _x_y[1], 10, 0, 2 * Math.PI);
    }
    ctx.strokeStyle = "orange";
    ctx.stroke();
    ctx.closePath();
  }

  display() {
    this.velo.drawVec(550, 400, 10, "green");
    this.acce.unit().drawVec(550, 400, 50, "blue");

    ctx.beginPath();
    ctx.arc(550, 400, 50, 0, 2 * Math.PI);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();
  }

  addPosition(MouseX, MouseY) {
    if (this._latest_points.length > 7) {
      this._latest_points.shift();
    }
    this._latest_points.push([MouseX, MouseY]);
  }

  addAngle(angle) {
    if (this._angle_samples.length > 10) {
      this._angle_samples.shift();
    }

    this._angle_samples.push(angle);
  }

  updatePhysics() {
    if (this.isDragging) {
      const temp = calculateDifferencesAndMean(this._latest_points);
      if (Math.abs(temp.deltaX) < epsilon && Math.abs(temp.deltaY) < epsilon) {
        this.acce.x = this.acce.y = 0;
        this.centripetal_acce = new Vector(0, 0);
        this.velo = this.velo.mult(1 - friction).mult(0.8);
      } else {
        this.acce.x = temp.deltaX * this.acceleration;
        this.acce.y = temp.deltaY * this.acceleration;
        // console.log(cal_Angle_V(this.prev_acce_vector, this.acce));

        this.addAngle(cal_Angle_V(this.prev_acce_vector, this.acce));

        // console.log(calculateMeanAngle(this._angle_samples), this._angle_samples);
        // console.log(calculateMeanAngle(this._angle_samples),cal_Angle_V(this.prev_acce_vector, this.acce));

        this.prev_acce_vector = this.acce.copy();

        // this.velo = this.velo.add(this.acce).add(delta_degree).mult(1 - friction);

        this.velo = this.velo.add(this.acce);
        this.velo = rotateVector(this.velo, cal_Angle_V(this.velo, this.acce));
        this.velo = this.velo.mult(1 - friction).mult(0.95);

        this.centripetal_acce = rotateVector(
          this.velo,
          calculateMeanAngle(this._angle_samples) * 3
        ).subtr(this.velo);
        // this.centripetal_acce = this.centripetal_acce.mult(1-friction);
        // console.log(this.centripetal_acce);
        // this.velo = this.velo.add(centripetal_acce.mult(1 - friction));
      }

      // console.log(this.acce, this.velo, temp);
    } else {
      if (this.centripetal_acce.mag() !== 0 && this.velo.mag() !== 0) {
        this.velo = this.velo.add(this.centripetal_acce);
        this.centripetal_acce = new Vector(0, 0);
      }
      this.velo = this.velo.mult(1 - friction);

      if (this.velo.mag() <= epsilon) {
        this.velo = new Vector(0, 0);
      } else {
        this.pos = this.pos.add(this.velo);
      }

      // Check for collision with canvas borders
      this.handleWallCollision();
      // this.updateHtmlPosition();

      // Check for collision with other balls
      for (const otherBall of balls) {
        if (this !== otherBall) {
          this.handleBallCollision(otherBall);
          // this.updateHtmlPosition();
        }
      }
    }
  }

  handleWallCollision() {
    if (this.pos.x < this.r) {
      this.pos.x = this.r;
    } else if (this.pos.x > canvas.width - this.r) {
      this.pos.x = canvas.width - this.r;
    }
    if (this.pos.y < this.r) {
      this.pos.y = this.r;
    } else if (this.pos.y > canvas.height - this.r) {
      this.pos.y = canvas.height - this.r;
    }

    if (this.pos.x <= this.r || this.pos.x >= canvas.width - this.r) {
      this.velo.x *= -1; // Reverse velocity on collision with horizontal borders
      this.velo.x *= 0.9;
    }
    if (this.pos.y <= this.r || this.pos.y >= canvas.height - this.r) {
      this.velo.y *= -1; // Reverse velocity on collision with vertical borders
      this.velo.y *= 0.9;
    }
  }

  handleBallCollision(otherBall) {
    const distance = this.pos.subtr(otherBall.pos).mag();

    if (distance <= this.r + otherBall.r) {
      // Collission detected, update velocities for both balls
      this.penetration_resolution(otherBall);
      this.collision_resolution(otherBall);
      otherBall.handleWallCollision();

      // otherBall.updateHtmlPosition();
    }
  }

  penetration_resolution(otherBall) {
    let dist = this.pos.subtr(otherBall.pos);
    let pen_depth = this.r + otherBall.r - dist.mag();
    let pen_res = dist.unit().mult(pen_depth / 2);
    this.pos = this.pos.add(pen_res);
    otherBall.pos = otherBall.pos.add(pen_res.mult(-1));
  }

  collision_resolution(otherBall) {
    let normal = this.pos.subtr(otherBall.pos).unit();
    let relvel = this.velo.subtr(otherBall.velo);
    let sepvel = relvel.dot(normal);
    let new_sepvel = -sepvel;
    let sepvelvec = normal.mult(new_sepvel);

    this.velo = this.velo.add(sepvelvec);
    otherBall.velo = otherBall.velo.add(sepvelvec.mult(-1));
  }

  updateHtmlPosition() {
    const htmlEle = document.getElementById(this.id);

    if (this.isMoving) {
      htmlEle.style.left = this.pos.x + "px";
      htmlEle.style.top = this.pos.y + "px";
    }
  }

  isBallMoving() {
    if (this.velo.mag() <= epsilon * 10) {
      this.isMoving = false;
      this.velo = new Vector(0, 0);
    } else {
      this.isMoving = true;
    }
  }
}

function calculateDifferencesAndMean(points) {
  const differences = [];

  // Calculate differences between consecutive points
  for (let i = 1; i < points.length; i++) {
    const deltaX = points[i][0] - points[i - 1][0];
    const deltaY = points[i][1] - points[i - 1][1];

    differences.push({
      deltaX,
      deltaY,
    });
  }

  // Calculate the mean of differences
  const meanDifference = differences.reduce(
    (sum, diff) => {
      sum.deltaX += diff.deltaX;
      sum.deltaY += diff.deltaY;
      return sum;
    },
    { deltaX: 0, deltaY: 0 }
  );

  // Divide by the number of differences to get the mean
  const numDifferences = differences.length || 1; // Avoid division by zero
  meanDifference.deltaX /= numDifferences;
  meanDifference.deltaY /= numDifferences;

  return meanDifference;
}

function cal_Angle_V(vx, vy) {
    const dot = vx.dot(vy);
    const magx = vx.mag();
    const magy = vy.mag();
  
    if (magx === 0 || magy === 0) {
      return 0;
    }
  
    const crossProduct = vx.x * vy.y - vx.y * vy.x;
    const sign = crossProduct >= 0 ? 1 : -1;
    const cosTheta = dot / (magx * magy);
    const theta = Math.acos(cosTheta);
  
    if (isNaN(theta)) {
      return 0;
    }
  
    return sign * (theta * 180) / Math.PI;
  }

  function rotateVector(v, angleDegrees) {
    // Convert Cartesian coordinates to polar coordinates
    const magnitude = Math.sqrt(v.x ** 2 + v.y ** 2);
    let angleRadians = Math.atan2(v.y, v.x);
  
    // Add the desired angle (in degrees)
    angleRadians += (angleDegrees * Math.PI) / 180;
  
    // Convert back to Cartesian coordinates
    const newX = magnitude * Math.cos(angleRadians);
    const newY = magnitude * Math.sin(angleRadians);
  
    // Return the new vector components
    return new Vector(newX, newY);
  }

  function calculateMeanAngle(angles){
    var sum = 0;
    for (let i = 1; i < angles.length; i++) {
      sum += angles[i];
    }
    // console.log(sum);
    if(angles.length == 0){
      return 0;
    }
    return sum/angles.length;
  }