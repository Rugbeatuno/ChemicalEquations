import { countElements } from "./chemicalEquation.js";
import { initBar, roundAnswer, roundConstant } from "./constantBar.js";
import { initElementData } from "./elements.js";

let input = document.getElementsByClassName("equationInput")[0];
input.addEventListener("input", () => {
  calcPercentComp(input.value);
});

let solution = document.createElement("div");
solution.className = "mathSolution";
document.body.appendChild(solution);

const calcPercentComp = (partialEq) => {
  solution.innerHTML = "";
  partialEq = partialEq.replace(" ", "");
  let individualTotals = new Map();

  let total = 0;
  for (let eq of partialEq.split("+")) {
    let elements = countElements(eq, null);
    for (let key of Array.from(elements.keys())) {
      let sum = elements.get(key) * roundConstant(key["atomic_mass"]);
      total += sum;
      let symbol = key["symbol"];
      individualTotals.set(symbol, sum);

      let line = `<span class="element">${symbol}</span>: ${elements.get(
        key
      )} x ${roundConstant(
        key["atomic_mass"]
      )}g = <span class="mediumAnswer">${sum}g</span><br/>`;
      solution.innerHTML += line;
    }
    solution.innerHTML += "<br/>";
  }
  solution.innerHTML += `Total Mass: <span class="mediumAnswer2">${total}g</span><br/><br/>`;

  for (let key of individualTotals.keys()) {
    solution.innerHTML += `<span class="finalAnswer">${key}: ${roundAnswer(
      (Number.parseFloat(individualTotals.get(key)) / total) * 100
    )}%<br/></span>`;
  }
};

initElementData();
initBar(() => {
  let input = document.getElementsByClassName("equationInput")[0];
  calcPercentComp(input.value);
});
