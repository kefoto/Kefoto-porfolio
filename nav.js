const menu = document.querySelector(".navbar__menu");
const menuLinks = document.querySelector(".navbar__toggle");
const buttons = document.querySelectorAll(".button");

 
nav__expansion();

//random color hover on button
function setBg(button) {
    setTimeout(function () {
      button.style.backgroundColor = bkg__color;
      button.style.color = "#fff";
    }, 3000);
  
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    button.style.backgroundColor = "#" + randomColor;
  
    if (wc_hex_is_light(randomColor)) {
      button.style.color = "#242424";
    }
  }
  
  //whether a hexcode color is bright by average or no
  function wc_hex_is_light(color) {
    const hex = color;
    const c_r = parseInt(hex.substring(0, 0 + 2), 16);
    const c_g = parseInt(hex.substring(2, 2 + 2), 16);
    const c_b = parseInt(hex.substring(4, 4 + 2), 16);
    const brightness = (c_r * 299 + c_g * 587 + c_b * 114) / 1000;
    return brightness > 155;
  }
  
  
  
  //small menu expansion
  function nav__expansion() {
    menuLinks.addEventListener("click", function () {
      menu.classList.toggle("active");
      menuLinks.classList.toggle("is-active");
    });
  
    buttons.forEach((button) => {
      button.addEventListener("mouseenter", () => setBg(button));
    });
  }