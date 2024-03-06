//reference: https://www.youtube.com/watch?v=GcPT4kd9JSo&ab_channel=danielstuts
import { Ball, balls, Vector} from "./2dPhysics/Ball.js";
import { isRendering } from "./container_collision.js";
import { deviceType, events, isTouchDevice } from "./device.js";
// export const canvas = document.getElementById("physicsCanvas");
// export const ctx = canvas.getContext("2d");
// const playground__container = document.getElementById("container");

// const _c_width = playground__container.offsetWidth * 0.45;
// const _c_height = playground__container.offsetHeight;
// canvas.width = _c_width;
// canvas.height = _c_height;

export const pc_container = document.getElementById("physicCircleContainer");
const icons = document.querySelectorAll(".physicCircle");
let mouseForce = 0.6;

//for throttling
let startTime;
let timeLapse = 0;

let isRecording = false;

//TODO: don't know why frame rate 60 does not work
const targetFrameRate = 75; // Set your target frame rate
const frameInterval = 1000 / targetFrameRate; // Calculate the interval between frames
let lastFrameTime = 0;

// import {isRendering} from './app.js';
console.log(pc_container.getBoundingClientRect().left,pc_container.getBoundingClientRect().top);
// console.log(canvas.getBoundingClientRect().left,canvas.getBoundingClientRect().top);
console.log(pc_container.offsetWidth,pc_container.offsetHeight);
// console.log(canvas.width,canvas.height);


//TODO: change this into touchctrl too
function mousectrl() {

  pc_container.addEventListener(events[deviceType].down, function (event) {
    // console.log("Mouse down event");
    const target = event.target;
    // console.log(target);
    if (target.classList.contains("in")) {
      const ballId = target.id;
      console.log(ballId);
      const ball = balls.find(ball => ball.id === ballId);
      // const mousePos = new Vector(mouseX, mouseY);


      ball.isDragging = true;
      ball.addPosition(ball.pos.x, ball.pos.y);
      if (!isRecording) {
        isRecording = true;
        startTime = Date.now();
        requestAnimationFrame(mainloop);
      }
    }
    // const mouseX = event.clientX - pc_container.getBoundingClientRect().left;
    // const mouseY = event.clientY - pc_container.getBoundingClientRect().top;

    // for (const ball of balls) {
    //   const distance = Math.sqrt(
    //     (mouseX - ball.pos.x) ** 2 + (mouseY - ball.pos.y) ** 2
    //   );
    //   if (distance < ball.r) {
    //     ball.isDragging = true;
    //     ball.addPosition(ball.pos.x, ball.pos.y);
    //     if (!isRecording) {
    //       isRecording = true;
    //       startTime = Date.now();
    //       requestAnimationFrame(mainloop);
    //     }

    //     break;
    //   }
    // }
  });

  pc_container.addEventListener(events[deviceType].move, function (event) {
    ball_move(event);
    // console.log()

    // if (balls.some((ball) => ball.isMoving || ball.isDragging)) {
    //   timer = requestAnimationFrame(mainloop);
    // }
  });

  pc_container.addEventListener(events[deviceType].up, function (event) {
    // Release all dragged balls when the mouse is up
    ball_up();
  });
}

export const ball_move = (event) => {
  if (isAnyBallDragging()) {
    //TODO: if there exist a dragging element
    const mouseX = !isTouchDevice() ? event.clientX - pc_container.getBoundingClientRect().left : event.touches[0].clientX - pc_container.getBoundingClientRect().left;
    const mouseY = !isTouchDevice() ? event.clientY - pc_container.getBoundingClientRect().top : event.touches[0].clientY - pc_container.getBoundingClientRect().top;
    // const mouseY = event.clientY - pc_container.getBoundingClientRect().top;
    // console.log(mouseX, mouseY);
    const mousePos = new Vector(mouseX, mouseY);

    for (const ball of balls) {
      if (ball.isDragging) {
        // Update the position of the dragged ball
        // ball.pos.x = mouseX;
        // ball.pos.y = mouseY;
        const force = mousePos.subtr(ball.pos).unit().mult(mouseForce);
        ball.pos.x += force.x;
        ball.pos.y += force.y;

        const x_allowed = ball.pos.x >= ball.r && ball.pos.x <= pc_container.offsetWidth - ball.r;
        const y_allowed = ball.pos.y >= ball.r && ball.pos.y <= pc_container.offsetHeight - ball.r;
        //check the boarders
        if (ball.pos.x < ball.r) {
          ball.pos.x = ball.r;
        } else if (ball.pos.x > pc_container.offsetWidth - ball.r) {
          ball.pos.x = pc_container.offsetWidth - ball.r;
        }
        if (ball.pos.y < ball.r) {
          ball.pos.y = ball.r;
        } else if (ball.pos.y > pc_container.offsetHeight - ball.r) {
          ball.pos.y = pc_container.offsetHeight - ball.r;
        }
      }
    }
  }
}

export const ball_up = () => {
  for (const ball of balls) {
    ball.isDragging = false;
  }
  isRecording = false;
};

//TODO: not buggy, but when resize, check and update size
export const canvas_resize = () => {
  for (const ball of balls) {
    // if collide with wall, a quick release of velocity
    ball.handleWallCollision_addVelo();
  }

  requestAnimationFrame(mainloop);
};

function isAnyBallMoving() {
  var result = false;
  for (const ball of balls) {
    result = result || ball.isMoving;
  }
  return result;
}

function isAnyBallDragging() {
  var result = false;
  for (const ball of balls) {
    result = result || ball.isDragging;
  }
  return result;
}

export const mainloop = (currentTime) => {
  // console.log("yeps");
  // Stop rendering if the flag is set to false
  if (!isRendering) {
    return;
  }
  const elapsedTime = currentTime - lastFrameTime;

  // console.log( canvas.width, canvas.height);
  // Check if enough time has passed to proceed to the next frame
  //throttling
  if (elapsedTime > frameInterval) {
    mousectrl();
    // Your animation/update logic goes here
    for (const ball of balls) {
      ball.updatePhysics();


      if (ball.isDragging) {
        ball.addPosition(ball.pos.x, ball.pos.y);
        timeLapse = Date.now() - startTime;
        // console.log("yea");
      }
      ball.isBallMoving();
      ball.updateHtmlPosition();
    }

    if (!isAnyBallMoving() && !isAnyBallDragging()) {
      return;
    }

    // Update the last frame time
    lastFrameTime = currentTime;
    requestAnimationFrame(mainloop);
  }
};

//TODO: still laggy, make requestion animation only there exist moving
//TODO: resize

// console.log(icons);

//initiate the physical icons

function getRandomPosition(icon) {
  // const containerWidth = _c_width;
  // const containerHeight = _c_height;

  const iconRadius = icon.offsetWidth / 2; // Replace with the radius of your circle

  // Calculate random left and top positions within the container
  const randomLeft =
    Math.random() * (pc_container.offsetWidth - 2 * iconRadius) + iconRadius;
  const randomTop =
    Math.random() * (pc_container.offsetHeight - 2 * iconRadius) + iconRadius;

  return new Vector(randomLeft, randomTop);
}

function checkOverLap(icon, position) {
  for (const otherIcon of icons) {
    if (otherIcon !== icon) {
      const otherRect_position = new Vector(
        otherIcon.offsetLeft,
        otherIcon.offsetTop
      );
      const distance = position.subtr(otherRect_position).mag();
      if (distance <= icon.offsetWidth / 2 + otherIcon.offsetWidth / 2) {
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
  new Ball(left, top, width / 2, id);
  // console.log(`Icon ID: ${id}, Left: ${left}px, Top: ${top}px, Width: ${width}px`);
});

// requestAnimationFrame(mainloop);
