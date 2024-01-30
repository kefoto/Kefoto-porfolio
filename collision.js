function isTouchDevice() {
    try {
      document.createEvent("TouchEvent");
      deviceType = "touch";
      return true;
    } catch (e) {
      deviceType = "mouse";
      return false;
    }
  }
  
  function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
  
  function getKeysByValue(object, value) {
    return Object.keys(object).filter((key) => object[key] === value);
  }
  
  function hasExactlyOneTrue(hashTable) {
    let trueCount = 0;
  
    for (const key in hashTable) {
      if (hashTable[key] === true) {
        trueCount++;
  
        // If trueCount exceeds 1, no need to continue checking
        if (trueCount > 1) {
          return false;
        }
      }
    }
  
    return trueCount === 1;
  }
  
  function isCircleCollide(x, y) {
    if (
      getDistance(
        x.offsetLeft,
        x.offsetTop,
        y.offsetLeft + y.offsetWidth / 2,
        y.offsetTop + y.offsetHeight / 2
      ) <
      x.offsetWidth / 2 + y.offsetWidth / 2
    ) {
      return true;
    } else {
      return false;
    }
  }
  
  function origin__reset__promise(x) {
    if (!p) {
      p = new Promise(function (resolve, reject) {
        setTimeout(() => {
          if (getKeysByValue(collision__circle, true).length == 0 && !moving) {
            drag__e.style.transition = "all 0.5s ease-in-out";
            drag__e.style.left = origin[0] + "px";
            drag__e.style.top = origin[1] + "px";
            resolve();
          }
          p = null;
          reject();
        }, x);
      });
  
      return p;
    }
  }
  
  
  function buttons__collision() {
    //   debugger;
    button__menu.forEach((b) => {
      var elementId = b.id;
      if (isCircleCollide(drag__e, b)) {
        collision__circle[elementId] = true;
        if (getKeysByValue(collision__circle, true).length == 2) {
          collision__circle[elementId] = false;
          return;
        }
        document.getElementById(classes[elementId]).style.top = "50%";
        document.getElementById(classes[elementId]).style.opacity = "1";
        b.style.backgroundColor = "#242424";
      } else {
        b.style.backgroundColor = "transparent";
        document.getElementById(classes[elementId]).style.opacity = "0";
        document.getElementById(classes[elementId]).style.top = "-1000px";
        collision__circle[elementId] = false;
      }
    });
  }
  
  function container__collision() {
    drag__e.addEventListener(
      events[deviceType].down,
      function (e) {
        moving = true;
        offset = [drag__e.offsetLeft - e.clientX, drag__e.offsetTop - e.clientY];
        drag__e.style.transition = "none";
        //making the spinning drag me disappear
        spinning.style.opacity = "0";
        setTimeout(() => {
          spinning.style.top = "-1000px";
        }, 1020);
      },
      true
    );
  
    document.addEventListener(
      events[deviceType].up,
      function () {
        moving = false;
  
        if (
          getKeysByValue(collision__circle, true).length == 0 &&
          drag__e.offsetLeft != origin[0] &&
          drag__e.offsetTop != origin[1]
        ) {
          origin__reset__promise(4000);
        }
      },
      true
    );
  
    drag__e.addEventListener(events[deviceType].up, (e) => {
      moving = false;
      if (
        getKeysByValue(collision__circle, true).length == 0 &&
        drag__e.offsetLeft != origin[0] &&
        drag__e.offsetTop != origin[1]
      ) {
        origin__reset__promise(4000);
      }
    });
  
    document.addEventListener(
      events[deviceType].move,
      function (event) {
        // event.preventDefault();
        if (moving) {
          //change position and check on boundary collision
          mousePosition = {
            x: !isTouchDevice() ? event.clientX : event.touches[0].clientX,
            y: !isTouchDevice() ? event.clientY : event.touches[0].clientY,
          };
  
          var x_allowed =
            mousePosition.x > outDim.left + drag__e.offsetWidth / 2 &&
            mousePosition.x <= outDim.right - drag__e.offsetWidth / 2;
          var y_allowed =
            mousePosition.y >
              outDim.top + nav__bar.offsetHeight / 2 + drag__e.offsetHeight &&
            mousePosition.y <=
              outDim.bottom + nav__bar.offsetHeight - drag__e.offsetHeight / 2;
          //   debugger;
          if (x_allowed) {
            drag__e.style.left = mousePosition.x + offset[0] + "px";
          } else {
            if (mousePosition.x >= outDim.left + drag__e.offsetWidth / 2) {
              drag__e.style.left = outDim.right - drag__e.offsetWidth / 2 + "px";
            }
            if (mousePosition.x <= outDim.right - drag__e.offsetWidth / 2) {
              drag__e.style.left = outDim.left + drag__e.offsetWidth / 2 + "px";
            }
          }
          //   debugger;
          if (y_allowed) {
            drag__e.style.top = mousePosition.y + offset[1] + "px";
          } else {
            if (
              mousePosition.y >=
              outDim.top + nav__bar.offsetHeight / 2 + drag__e.offsetHeight
            ) {
              drag__e.style.top = outDim.bottom - drag__e.offsetHeight / 2 + "px";
            }
            if (
              mousePosition.y <=
              outDim.bottom + nav__bar.offsetHeight - drag__e.offsetHeight / 2
            ) {
              drag__e.style.top = outDim.top + drag__e.offsetHeight / 2 + "px";
            }
          }
          // debugger;
  
          buttons__collision();
        }
      },
      true
    );
  
    //when the window change in size
    window.addEventListener(
      "resize",
      (e) => {
        //   debugger;
        outDim.left = playground__container.offsetLeft;
        outDim.top = playground__container.offsetTop - nav__bar.offsetHeight;
        outDim.right =
          playground__container.offsetLeft + playground__container.offsetWidth;
        outDim.bottom =
          playground__container.offsetTop +
          playground__container.offsetHeight -
          nav__bar.offsetHeight;
  
        origin = [
          playground__container.offsetWidth / 2,
          playground__container.offsetHeight / 2,
        ];
  
        if (
          getKeysByValue(collision__circle, true).length == 0 &&
          drag__e.offsetLeft != origin[0] &&
          drag__e.offsetTop != origin[1]
        ) {
          origin__reset__promise(500);
        }
        //since the cursor would onnly go outofbound in right or bottom, we put restrictions
        if (drag__e.offsetTop >= outDim.bottom - drag__e.offsetHeight / 2) {
          drag__e.style.top = outDim.bottom - drag__e.offsetHeight / 2 + "px";
        }
  
        if (drag__e.offsetLeft >= outDim.right - drag__e.offsetWidth / 2) {
          drag__e.style.left = outDim.right - drag__e.offsetWidth / 2 + "px";
          //   console.log("colide left", drag__e.offsetLeft, (outDim.left + drag__e.offsetWidth / 2));
        }
  
        buttons__collision();
      },
      true
    );
  }