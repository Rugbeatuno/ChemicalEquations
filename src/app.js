"use strict";
export const __esModule = true;
import { countSigFigs } from "./utils";
var init = function () {
  var input = document.createElement("input");
  input.className = "input";
  document.body.appendChild(input);
  var displayedEquation = document.createElement("h2");
  displayedEquation.className = "equation";
  document.body.appendChild(displayedEquation);
  input.addEventListener("input", function () {
    displayEquation(input.value, displayedEquation);
  });
};
var displayEquation = function (str, equation) {
  var allowedChars = "abcdefghijklmnopqrstuvwxyz1234567890+=-> ";
  var string = "";
  for (var i = 0; i < str.length; i++) {
    if (allowedChars.indexOf(str.charAt(i).toLowerCase()) > -1) {
      string += str.charAt(i);
    }
  }
  equation.innerHTML = string;
};
init();
console.log((0, countSigFigs)(700));
console.log((0, countSigFigs)(701));
console.log((0, countSigFigs)(777));
console.log((0, countSigFigs)(0.07));
console.log((0, countSigFigs)(0.7));
console.log((0, countSigFigs)(70));
