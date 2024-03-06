import {getKeysByValue, collision__circle, classes} from './container_collision.js';

//TODO: this lags when the website first loads
const text = document.querySelector(".text");

export const updateBottomDateCircle = () => {
    if (getKeysByValue(collision__circle, true).length == 0) {
      var temp = new Date();
      const dateString =`TODAY'S DATE: ${
        temp.getMonth() + 1
      }/${temp.getDate()}/${temp.getFullYear()} `;

      presentDateCircle(
       repeatedString(dateString, 3)
      );
    } else {
      
      const temp = getKeysByValue(collision__circle, true);
      const stringtemp = classes[temp] + " ";
      
      presentDateCircle(repeatedString(stringtemp, 9));
      // text.classList.add('loaded');
    }
  }

export const presentDateCircle = (input) =>{
    const formattedInput = input.replace(/ /g, "\u00A0");
  
    text.innerText = formattedInput;
  
    var letters = text.innerText.split("");
  
    const angle = 360 / letters.length;
  
    text.innerHTML = letters
      .map(
        (letter, i) =>
          `<span style="transform: rotate(${i * angle}deg)">${letter}</span>`
      )
      .join("");
  }


  export const repeatedString = (str, times) => {
    return `${str.repeat(times)}`;
  };