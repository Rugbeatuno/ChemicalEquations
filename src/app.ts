import { countSigFigs } from "./utils";


const init = () => {
    let input = document.createElement("input");
    input.className = "input";
    document.body.appendChild(input);

    let displayedEquation = document.createElement("h2");
    displayedEquation.className = "equation";
    document.body.appendChild(displayedEquation);

    input.addEventListener('input', () => {
        displayEquation(input.value, displayedEquation)
    })
  };
  
  const displayEquation = (str: string, equation: HTMLHeadingElement) => {
    let allowedChars: string = "abcdefghijklmnopqrstuvwxyz1234567890+=-> "
    let string: string = "";
    for (var i = 0; i < str.length; i++) {
        if (allowedChars.indexOf(str.charAt(i).toLowerCase()) > -1) {
            string += str.charAt(i);
        }
      }

    equation.innerHTML = string;
  };
  
  init();

  console.log(countSigFigs(700))
  console.log(countSigFigs(701))
  console.log(countSigFigs(777))
  console.log(countSigFigs(0.07))
  console.log(countSigFigs(0.70))
  console.log(countSigFigs(70.))
  