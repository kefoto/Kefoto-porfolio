import { getKeysByValue, collision__circle } from "./container_collision.js";
import {
  updateBottomDateCircle,
  presentDateCircle,
  repeatedString,
} from "./bottomCircle.js";

const enter = document.getElementById("enter");
const arrow = document.getElementById("arrow");
export var isArrowHovered = false;

export const arrow_move = (e) => {
  const X_distance =
    e.clientX - (enter.offsetLeft + arrow.offsetLeft + arrow.offsetWidth / 2);
  const Y_distance =
    e.clientY - (enter.offsetTop + arrow.offsetTop + arrow.offsetHeight / 2);
  const angle = Math.atan2(Y_distance, X_distance);

  const rotation = 45 + angle * (180 / Math.PI);

  if (getKeysByValue(collision__circle, true).length == 1) {
    const norm_distance_opacity = distance_to_opacity(X_distance, Y_distance);
    arrow.style.transform = ` translate(-50%,0%) scale(0.8) rotate(${rotation}deg)`;
    // console.log(norm_distance_opacity);
    enter.style.opacity = norm_distance_opacity.toString();
    enter.style.bottom = "8px";
  } else if (getKeysByValue(collision__circle, true).length == 0) {
    enter.style.bottom = "-1000px";
    enter.style.opacity = "0";
  }
};


export const arrow_interaction = () => {
  arrow.addEventListener("mouseenter", function () {
    if (getKeysByValue(collision__circle, true).length == 1) {
      isArrowHovered = true;
      presentDateCircle(repeatedString("More ", 9));
      // enter.style.opacity = "";
      arrow.classList.add("active");
    }

    // Set other variables or perform actions as needed
  });

  arrow.addEventListener("mouseleave", function () {
    isArrowHovered = false;
    updateBottomDateCircle();
    arrow.classList.remove("active");

    // Reset other variables or perform actions as needed
  });
};

function distance_to_opacity(x, y) {
  const bias = 0.4;
  let norm_distance_opacity =
    1 - Math.sqrt((x / window.innerWidth) ** 2 + (y / window.innerHeight) ** 2);

  norm_distance_opacity -= bias;

  // norm_distance_opacity = norm_distance_opacity - 0.2;

  if (norm_distance_opacity <= 0) {
    return 0;
  } else {
    return norm_distance_opacity;
  }
}
