import { initElementData } from "./elements.js";
import { countElements } from "./chemicalEquation.js";

let input = document.getElementsByClassName("equationInput")[0];
input.addEventListener("input", () => {
  findElements(input.value);
});

let answer = document.createElement("div");
answer.className = "mathSolution";
document.body.appendChild(answer);

const formatElectronConfig = (str) => {
  let parts = str.split(" ");
  let newStr = "";
  for (let i of parts) {
    for (let n of ["s", "p", "d", "f"]) {
      if (i.includes(n)) {
        let nums = i.split(n);
        newStr += `${nums[0]}${n}<sup>${nums[1]}</sup> `;
      }
    }
    if (i.includes("[")) {
      newStr += i + " ";
    }
  }
  return newStr;
};

const findElements = (partialEq) => {
  partialEq = partialEq.replace(" ", "");
  let elements = countElements(partialEq, null);
  answer.innerHTML = "";

  for (let key of elements.keys()) {
    let fullElectronConfig = formatElectronConfig(
      key["electron_configuration"]
    );
    let simpElectronConfig = formatElectronConfig(
      key["electron_configuration_semantic"]
    );
    answer.innerHTML += `<span class="element">${key["symbol"]} - ${key["name"]}</span><br/>${fullElectronConfig}<br/>${simpElectronConfig}<br/><br/>`;
  }
};

initElementData();
