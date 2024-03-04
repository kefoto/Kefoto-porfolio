const paragraphs = document.querySelectorAll(".hoverable-paragraph");

//TODO: there is a issue where other text are blocking the interaction
export const changeHoverletter = () => {
    paragraphs.forEach(function (paragraph) {
      var letters = paragraph.innerText.split("");
  
      paragraph.innerHTML = letters
        .map(function (letter) {
          return '<span class="hoverable-letter">' + letter + "</span>";
        })
        .join("");
  
      paragraph.querySelectorAll(".hoverable-letter").forEach(function (letter) {
        letter.addEventListener("mouseenter", function () {
          var randomStyleNumber = Math.floor(Math.random() * 3) + 1;
  
          if (randomStyleNumber == 1) {
            letter.style.fontFamily = "'Xanh Mono', monospace";
          } else if (randomStyleNumber == 2) {
            letter.style.fontFamily = "'Syne Mono', monospace";
          } else {
            letter.style.fontFamily = "'Space Mono', sans-serif";
          }
          // console.log("Mouse entered the letter: " + letter.innerText);
        });
  
        letter.addEventListener("mouseleave", function () {
          // You can add additional JavaScript logic here if needed
          // console.log("Mouse left the letter: " + letter.innerText);
        });
      });
    });
  }