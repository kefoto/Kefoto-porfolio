export var deviceType = "";

export const events = {
  mouse: {
    down: "mousedown",
    move: "mousemove",
    up: "mouseup",
  },

  touch: {
    down: "touchstart",
    move: "touchmove",
    up: "touchend",
  },
};

export const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};
