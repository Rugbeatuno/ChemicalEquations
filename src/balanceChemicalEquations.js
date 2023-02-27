import { balanceEquation } from "./balancer/balancer.js";
import { initBar, predictEquation } from "./constantBar.js";
import { determineReactionType, predict } from "./predictEquation.js";
import {
  HTMLFormatEquation,
  isNumeric,
  predictAndBalance,
  highlightCoefficients,
} from "./utils.js";
import {} from "./tester.js";

document.getElementById("reactants").addEventListener("input", () => {
  balance();
});
document.getElementById("products").addEventListener("input", () => {
  balance();
});
let answer = document.createElement("div");
answer.className = "mathSolution";
document.body.appendChild(answer);

// export const getBalancedEquation

const balance = () => {
  document.getElementById("products").disabled = false;
  if (predictEquation) {
    predictAndBalance();
  }
  let reactants = document.getElementById("reactants").value;
  let products = document.getElementById("products").value;

  let equation = `${reactants}->${products}`;
  equation = equation.replace(" ", "");
  if (!reactants || !products) {
    answer.innerHTML = "This equation can't be balanced!";
    return;
  }

  let balancedEquation = balanceEquation(equation);
  let alreadyBalanced = true;
  if (balancedEquation) {
    let res = highlightCoefficients(balancedEquation);
    alreadyBalanced = res[1];
    answer.innerHTML = HTMLFormatEquation(res[0]);
    if (alreadyBalanced) {
      answer.innerHTML += "<br/><br/>Equation is already balanced!";
    }
  } else {
    answer.innerHTML = "This equation can't be balanced!";
  }
};
initBar(() => {
  balance();
});
