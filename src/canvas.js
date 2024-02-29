//reference: https://www.youtube.com/watch?v=GcPT4kd9JSo&ab_channel=danielstuts
import {Ball, balls} from "./2dPhysics/Ball.js";
import {Vector} from "./2dPhysics/Vector.js";
import {isRendering} from "./container_collision.js";
export const canvas = document.getElementById("physicsCanvas");
export const ctx = canvas.getContext("2d");
const playground__container = document.getElementById("container");

const _c_width = playground__container.offsetWidth * 0.45;
const _c_height = playground__container.offsetHeight;
canvas.width = _c_width;
canvas.height = _c_height;

const icons = document.querySelectorAll(".physicCircle");
let mouseForce = 0.3;



let startTime;
let timeLapse = 0;

let isRecording = false;

const targetFrameRate = 90; // Set your target frame rate
const frameInterval = 1000 / targetFrameRate; // Calculate the interval between frames
let lastFrameTime = 0;

// import {isRendering} from './app.js';




function mousectrl() {

  // cancelAnimationFrame()
  canvas.addEventListener("mousedown", function (event) {
    // console.log("Mouse down event");
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    for (const ball of balls) {
      const distance = Math.sqrt(
        (mouseX - ball.pos.x) ** 2 + (mouseY - ball.pos.y) ** 2
      );
      if (distance < ball.r) {
        ball.isDragging = true;
        ball.addPosition(ball.pos.x, ball.pos.y);
        if (!isRecording) {
          isRecording = true;
          startTime = Date.now();
          requestAnimationFrame(mainloop);
        }

        break;
      }
    }

  });

  canvas.addEventListener(
    "mousemove",
    function (event) {
      // console.log()
      const mouseX = event.clientX - canvas.getBoundingClientRect().left;
      const mouseY = event.clientY - canvas.getBoundingClientRect().top;

      const mousePos = new Vector(mouseX, mouseY);

      for (const ball of balls) {
        if (ball.isDragging) {
          // Update the position of the dragged ball
          // ball.pos.x = mouseX;
          // ball.pos.y = mouseY;
          const force = mousePos.subtr(ball.pos).unit().mult(mouseForce);
          ball.pos.x += force.x;
          ball.pos.y += force.y;
          
          //check the boarders
          if (ball.pos.x < ball.r) {
            ball.pos.x = ball.r;
          } else if (ball.pos.x > canvas.width - ball.r) {
            ball.pos.x = canvas.width - ball.r;
          }
          if (ball.pos.y < ball.r) {
            ball.pos.y = ball.r;
          } else if (ball.pos.y > canvas.height - ball.r) {
            ball.pos.y = canvas.height - ball.r;
          }
        }
      }
      // if (balls.some((ball) => ball.isMoving || ball.isDragging)) {
      //   timer = requestAnimationFrame(mainloop);
      // }
    }
  );
  
  canvas.addEventListener("mouseup", function (event) {
    // Release all dragged balls when the mouse is up

    ball_up();
  });

}

export const ball_up = () => {
  for (const ball of balls) {
    ball.isDragging = false;
  }
  isRecording = false;
}

//TODO: buggy
export const canvas_resize = () => {
  canvas.width = playground__container.offsetWidth * 0.45;
  canvas.height = playground__container.offsetHeight;

  for (const ball of balls) {
    ball.handleWallCollision();

    for(const other of balls){
      if(ball !== other){
        ball.handleBallCollision(other);
      }
    }

    ball.updateHtmlPosition();
  }
  
}

function mirrorVector(originalVector, mirrorVector) {
  // Calculate the angle between the two vectors
  const angleBetween = cal_Angle_V(originalVector, mirrorVector);
  // Double the angle to determine the mirroring angle
  const mirroringAngle = 2 * angleBetween;
  // Use the rotateVector function to mirror the vector
  const mirroredVector = rotateVector(originalVector, mirroringAngle);

  return mirroredVector;
}

function isAnyBallMoving(){
  var result = false;
  for (const ball of balls) {
    result = result || ball.isMoving;
  }
  return result;
}

function isAnyBallDragging(){
  var result = false;
  for (const ball of balls) {
    result = result || ball.isDragging;
  }
  return result;
}


export const mainloop = (currentTime) => {
  console.log(isRendering);
  // Stop rendering if the flag is set to false
  if(!isRendering){
    return;
  }
  const elapsedTime = currentTime - lastFrameTime;
  
  // console.log( canvas.width, canvas.height);
  // Check if enough time has passed to proceed to the next frame
  //throttling
  if (elapsedTime > frameInterval) {
    mousectrl();
    // Your animation/update logic goes here
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const ball of balls) {
      ball.updatePhysics();
      // ball.drawBall();
      ball.drawPoints();
      // ball.display();

      if (ball.isDragging) {
        ball.addPosition(ball.pos.x, ball.pos.y);
        timeLapse = Date.now() - startTime;
        // console.log("yea");
      }
      ball.isBallMoving();
      ball.updateHtmlPosition();
    }

    if(!isAnyBallMoving() && !isAnyBallDragging()){
      return;
    }
  

    // Update the last frame time
    lastFrameTime = currentTime;
    requestAnimationFrame(mainloop);
  }
}

//TODO: still laggy, make requestion animation only there exist moving
//TODO: resize

// console.log(icons);


//initiate the physical icons 

function getRandomPosition(icon) {
  const containerWidth = _c_width;
  const containerHeight = _c_height;

  const iconRadius = icon.offsetWidth / 2; // Replace with the radius of your circle

  // Calculate random left and top positions within the container
  const randomLeft = Math.random() * (containerWidth - 2 * iconRadius) + iconRadius;
  const randomTop = Math.random() * (containerHeight - 2 * iconRadius) + iconRadius;

  return new Vector(randomLeft, randomTop);
}

function checkOverLap(icon, position) {

  for (const otherIcon of icons) {
    if (otherIcon !== icon) {
      const otherRect_position = new Vector(otherIcon.offsetLeft, otherIcon.offsetTop);
      const distance = position.subtr(otherRect_position).mag();
      if (
        distance <= ( icon.offsetWidth / 2 + otherIcon.offsetWidth / 2 )
      ) {
        // Overlap detected, adjust the position and check again
        position = checkOverLap(icon, getRandomPosition(icon));
      }
    }
  }
  
  return position;
}

//initiate the icons
icons.forEach((icon) => {

  const position = getRandomPosition(icon);
  const adjustedPosition = checkOverLap(icon, position);

  icon.style.left = `${adjustedPosition.x}px`;
  icon.style.top = `${adjustedPosition.y}px`;

  const left = icon.offsetLeft;
  const top = icon.offsetTop;
  const width = icon.offsetWidth;

  const id = icon.id;

  new Ball(left, top, width/2, id);
  // console.log(`Icon ID: ${id}, Left: ${left}px, Top: ${top}px, Width: ${width}px`);
});





// requestAnimationFrame(mainloop);



