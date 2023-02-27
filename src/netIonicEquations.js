import { balanceEquation } from "./balancer/balancer.js";
import {
  getElementCharge,
  formatCharge,
  formatCoefficient,
} from "./chemicalEquation.js";
import { initBar, predictEquation } from "./constantBar.js";
import { findIonsAcidsElements, findIonsElements } from "./nomenclature.js";
import { AQUEOUS, formatState, getState } from "./solubility.js";
import {
  predictAndBalance,
  HTMLFormatEquation,
  highlightCoefficients,
  colorState,
  isNumeric,
} from "./utils.js";

initBar(() => {
  solve();
});

document.getElementById("reactants").addEventListener("input", () => {
  solve();
});
document.getElementById("products").addEventListener("input", () => {
  solve();
});

let answer = document.createElement("div");
answer.className = "mathSolution";
document.body.appendChild(answer);

const solve = () => {
  answer.innerHTML = "";
  document.getElementById("products").disabled = false;
  if (predictEquation) {
    predictAndBalance();
  }
  let reactants = document.getElementById("reactants").value;
  let products = document.getElementById("products").value;
  //   for (let i of val.split("+")) {
  //     console.log(`${i} - ${format(getState(i))}`);
  //   }
  if (!reactants || !products) {
    answer.innerHTML = "This equation can't be balanced!";
    return;
  }
  // step 1 - predict and balance
  // step 2 - states of matter
  // step 3 - break aqeuous
  // step 4 - states of matter
  // step 5 cross off spectator

  // step 1
  let balancedEquation = balanceEquation(`${reactants}->${products}`);
  if (balancedEquation) {
    let formattedEquation = HTMLFormatEquation(
      highlightCoefficients(balancedEquation)[0]
    );
    answer.innerHTML = `<span class="element">Predict/Balance:</span> ${formattedEquation}`;
  } else {
    answer.innerHTML = "This equation can't be balanced!";
  }

  // step 2 & 3
  const process = (partialEq) => {
    let newEq = "";
    let expandedEq = "";
    for (let i of partialEq.split("+")) {
      let state = getState(i);
      newEq += `${i}${colorState(state)}+`;

      if (state === AQUEOUS) {
        let elements = findIonsElements(i);
        let keys = Array.from(elements.keys());
        // find cation and anion
        let cation = null;
        let anion = null;
        if (getElementCharge(keys[0], i) < 0) {
          anion = [keys[0], elements.get(keys[0])];
          cation = [keys[1], elements.get(keys[1])];
        } else {
          cation = [keys[0], elements.get(keys[0])];
          anion = [keys[1], elements.get(keys[1])];
        }

        expandedEq += `${formatCoefficient(cation[1])}${
          cation[0]["symbol"]
        }<sup>${formatCharge(
          getElementCharge(cation[0], i)
        )}</sup><sub class="state">(aq)</sub>+${formatCoefficient(anion[1])}${
          anion[0]["symbol"]
        }<sup>${formatCharge(
          getElementCharge(anion[0], i)
        )}</sup><sub class="state">(aq)</sub>+`;
      } else {
        expandedEq += `${i}${colorState(state)}+`;
      }
    }
    newEq = newEq.slice(0, -1);
    return [newEq, expandedEq];
  };
  if (!balancedEquation.includes("->")) {
    answer.innerHTML = "This equation can't be balanced!";
    return;
  }
  let newReactants = process(balancedEquation.split("->")[0]);
  let newProducts = process(balancedEquation.split("->")[1]);

  answer.innerHTML += `<br/><br/><span class="element">Assign States:</span> ${newReactants[0]} -> ${newProducts[0]}`;
  answer.innerHTML += `<br/><br/><span class="element">Dissociate:</span> ${newReactants[1].slice(
    0,
    -1
  )} -> ${newProducts[1].slice(0, -1)}`;

  // cross off
  let netIonicEquationReactants = newReactants[1].toString();
  let netIonicEquationProducts = newProducts[1].toString();
  let spectatorIons = [];
  let length = newReactants[1].split("+").length;
  for (let i of newReactants[1].split("+")) {
    if (newProducts[1].split("+").includes(i)) {
      newReactants[1] = newReactants[1].replace(i, `<strike>${i}</strike>`);
      newProducts[1] = newProducts[1].replace(i, `<strike>${i}</strike>`);

      spectatorIons.push(i);
      //   netIonicEquation = netIonicEquation.replaceAll(`+ ${i}`, "");
      netIonicEquationReactants = netIonicEquationReactants.replace(
        `${i}+`,
        ""
      );
      netIonicEquationProducts = netIonicEquationProducts.replace(`${i}+`, "");
    }
  }
  let netIonicEquation = `${netIonicEquationReactants} -> ${netIonicEquationProducts}`;
  //   for (let i = 0; i < 10; i++) {
  //     netIonicEquation = netIonicEquation.replace("++", "+");
  //   }

  answer.innerHTML += `<br/><br/><span class="element">Canceling:</span> ${newReactants[1].slice(
    0,
    -1
  )} -> ${newProducts[1].slice(0, -1)}`;

  console.log(length, spectatorIons.length);
  if (length === spectatorIons.length) {
    answer.innerHTML += `<br/><br/><span class="element">Net Ionic Equation:</span> No Reaction`;
    answer.innerHTML += `<br/><br/><span class="element">Spectator Ions:</span> None`;
  } else {
    answer.innerHTML += `<br/><br/><span class="element">Net Ionic Equation:</span> ${netIonicEquation.slice(
      0,
      -1
    )}`;
  }

  let res = "";
  for (let i of spectatorIons) {
    let val = i;
    while (isNumeric(val.charAt(0))) {
      val = val.slice(1);
    }
    val = val.replace("(aq)", "");
    val = val.replace("(s)", "");
    val = val.replace("(l)", "");
    val = val.replace("(g)", "");
    if (val) {
      res += `${val}, `;
    }
  }
  res = res.slice(0, -2);
  answer.innerHTML += `<br/><br/><span class="element">Spectator Ions:</span> ${res}`;
};
