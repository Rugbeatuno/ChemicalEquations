import { initElementData } from "./elements.js";
import { countElements } from "./chemicalEquation.js";
import { init } from "./initSingleInput.js";
import { initBar } from "./constantBar.js";
import { findIonsAcidsElements, findName } from "./nomenclature.js";
import { getState } from "./solubility.js";
import { colorState } from "./utils.js";

initBar();
init("Na Pb HF AgNO3 H2SO4");

let input = document.getElementsByClassName("equationInput")[0];
input.addEventListener("input", () => {
  findElements(input.value);
});

let answer = document.createElement("div");
answer.className = "mathSolution";
document.body.appendChild(answer);

const findElements = (partialEq) => {
  let seenSymbols = [];
  let elements = findIonsAcidsElements(partialEq, null);
  answer.innerHTML = "";

  for (let key of elements.keys()) {
    let state = getState(key["symbol"]);
    if (!seenSymbols.includes(key["symbol"])) {
      seenSymbols.push(key["symbol"]);
      answer.innerHTML += `<span class="element">${key["symbol"]} - ${
        key["name"]
      }</span>${colorState(state)}<br/>`;
    }
  }

  let parts = partialEq.split(" ");
  for (let i of parts) {
    if (!seenSymbols.includes(i)) {
      seenSymbols.push(i);
      let state = getState(i);
      answer.innerHTML += `<span class="element">${i} - ${findName(
        i
      )}</span>${colorState(state)}<br/>`;
    }
  }
};

initElementData();
