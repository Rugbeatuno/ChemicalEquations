import { symbolToData, polyatomicIons, acids } from "./elements.js";
import { isNumeric } from "./utils.js";
import {
  COMMON_POSITIVE_IONS,
  GROUP_CHARGES,
  MULTIVALENT_METALS,
} from "./constants.js";

import { findName, findIonsAcidsElements } from "./nomenclature.js";

export const countElements = (partialEq, existingCount) => {
  var count = new Map();
  if (existingCount !== null) {
    count = existingCount;
  }

  let coefficient = partialEq.charAt(0);
  if (isNumeric(coefficient)) {
    coefficient = Number.parseInt(coefficient);
  } else {
    coefficient = 1;
  }

  // find parenthesis subscripts and locations
  let parenthesisLower = 1000;
  let parenthesisHigher = -1000;
  let parenthesisSubscript = 1;
  for (let i = 0; i < partialEq.length; i++) {
    if (partialEq.charAt(i) === ")") {
      let idx = i;
      while (partialEq.charAt(idx) !== "(") {
        idx--;
        if (idx < -1) {
          break;
        }
      }
      parenthesisLower = idx + 1;
      parenthesisHigher = i + 1;
      parenthesisSubscript = Number.parseInt(partialEq.charAt(i + 1));
    }
  }

  // check for subscripts of for each element
  for (let pos of getElementPositions(partialEq)) {
    let subscriptPos = pos[1];
    if (!count.has(pos[0])) {
      count.set(pos[0], 0);
    }
    // check if there is a subscript
    if (isNumeric(partialEq.charAt(subscriptPos))) {
      let subscript = partialEq.charAt(subscriptPos).toString();
      let idx = subscriptPos + 1;
      // find as many subscripts as possible, 2 digit
      while (isNumeric(partialEq.charAt(idx))) {
        subscript += partialEq.charAt(idx);
        idx++;
      }
      // check if element is between parenthesis and multiply by parenthesis subscript
      let newSubscript = subscript * coefficient;
      if (subscriptPos > parenthesisLower && subscriptPos < parenthesisHigher) {
        newSubscript *= parenthesisSubscript;
      }

      count.set(pos[0], count.get(pos[0]) + newSubscript);
    } else {
      // a subscript isnt present but is in parenthesis
      if (subscriptPos > parenthesisLower && subscriptPos < parenthesisHigher) {
        count.set(
          pos[0],
          count.get(pos[0]) + parenthesisSubscript * coefficient
        );
      } else {
        // not in a parenthesis
        count.set(pos[0], count.get(pos[0]) + coefficient);
      }
    }
    count = count;
  }
  return count;
};

export const getElementPositions = (partialEq) => {
  let offset = 0;
  let idx = [];
  let originalEq = partialEq.toString();
  // 2 letter symbols
  let eq = partialEq.toString();
  for (let i = 0; i < partialEq.length - 1; i++) {
    let pair = partialEq.charAt(i) + partialEq.charAt(i + 1);
    if (symbolToData.has(pair)) {
      idx.push([symbolToData.get(pair), i + 2]);
      eq = eq.replace(pair, "");

      offset += 2;
    }
  }
  // 1 letter symbols
  // str = str.slice(0, 3) + str.slice(4);
  for (let i = 0; i < eq.length; i++) {
    if (symbolToData.has(eq.charAt(i))) {
      let searches = 0;
      while (true) {
        if (searches > partialEq.length) {
          break;
        }

        let pos = originalEq.indexOf(eq.charAt(i));
        let nextPos = originalEq.charAt(pos + 1);

        if (
          nextPos === ")" ||
          isNumeric(nextPos) ||
          nextPos === nextPos.toUpperCase()
        ) {
          idx.push([symbolToData.get(eq.charAt(i)), pos + 1]);
          originalEq = originalEq.replace(eq.charAt(i), "");
          break;
        }
        searches++;
      }
    }
  }

  return idx;
};

export const hasPolyatomicIon = (partialEq) => {
  for (let i of polyatomicIons.keys()) {
    if (partialEq.includes(i)) {
      return true;
    }
  }
  return false;
};

export const parseReactants = (reactants) => {
  reactants = reactants.replace(" ", "");
  // console.log(countElements(reactants, null));
  // console.log(getElementPositions(reactants));
  console.log(findName(reactants));
  let elements = reactants.split("+");
  // console.log(elements);
};

export const isPolyatomicIon = (obj) => {
  for (let i of polyatomicIons) {
    if (obj["symbol"] === i[0]) {
      return true;
    }
  }
  return false;
};

export const hasAcid = (partialEq) => {
  for (let i of acids) {
    if (partialEq.includes(i[0])) {
      return true;
    }
  }
  return false;
};

export const isBinaryElement = (obj) => {
  for (let i of symbolToData.keys()) {
    let s = obj["symbol"];
    if (s === i) {
      return true;
    }
  }
  return false;
};
export const isMetal = (obj) => {
  if (isBinaryElement(obj) && obj["category"].includes(" metal")) {
    return true;
  }
  return false;
};

export const isNonmetal = (obj) => {
  if (isBinaryElement(obj) && obj["category"].includes("nonmetal")) {
    return true;
  }
  return false;
};

export const hasMetal = (elements) => {
  for (let i of elements.keys()) {
    if (isMetal(i)) {
      return true;
    }
  }
  return false;
};

export const getMetal = (elements) => {
  for (let i of elements.keys()) {
    if (isMetal(i)) {
      return i;
    }
  }
  return false;
};

export const hasNonmetal = (elements) => {
  for (let i of elements.keys()) {
    if (isNonmetal(i)) {
      return true;
    }
  }
  return false;
};

export const hasHalide = (elements) => {
  for (let i of elements.keys()) {
    if (["F", "Cl", "Br", "I", "At"].includes(i["symbol"])) {
      return true;
    }
  }
  return false;
};

export const isWater = (elements) => {
  if (elements.size !== 2) {
    return false;
  }
  if (elements.has(symbolToData.get("H"))) {
    let hydrogens = elements.get(symbolToData.get("H"));
    if (elements.has(symbolToData.get("O"))) {
      let oxygens = elements.get(symbolToData.get("O"));
      if (oxygens * 2 === hydrogens) {
        return true;
      }
    }
  }
  return false;
};

export const isActiveMetal = (element) => {
  return ["Li", "Na", "K", "Rb", "Cs", "Ca", "Sr", "Ba"].includes(
    element["symbol"]
  );
};

export const crissCross = (
  [element1, element1Charge],
  [element2, element2Charge]
) => {
  // order elements, cation + anion
  let cation = null;
  let anion = null;
  if (element1Charge > 0) {
    // cation
    cation = [element1, element1Charge];
    anion = [element2, element2Charge];
  } else {
    // anion
    anion = [element2, element2Charge];
    cation = [element1, element1Charge];
  }

  // reduce
  if (anion[1] % cation[1] === 0) {
    anion[1] /= cation[1];
    cation[1] = 1;
  }
  if (cation[1] % anion[1] === 0) {
    cation[1] /= anion[1];
    anion[1] = 1;
  }

  if (Math.abs(anion[1]) === 1) {
    anion[1] = "";
  } else {
    anion[1] = Math.abs(anion[1]);
  }
  if (Math.abs(cation[1]) === 1) {
    cation[1] = "";
  } else {
    cation[1] = Math.abs(cation[1]);
  }

  // criss cross
  return `${cation[0]["symbol"]}${anion[1]}${anion[0]["symbol"]}${cation[1]}`;
};

export const getElementCharge = (element, partialEq) => {
  if (partialEq === null) {
    partialEq = "";
  }

  if (GROUP_CHARGES.has(element["group"])) {
    return GROUP_CHARGES.get(element["group"]);
  }

  // always known charges for ions
  if (COMMON_POSITIVE_IONS.has(element["symbol"])) {
    return COMMON_POSITIVE_IONS.get(element["symbol"]);
  }
  // multivalent metals
  // first look for another element, or if elements == 2
  // otherwise, find the charge of the polyatomic ion and work backwards
  if (MULTIVALENT_METALS.has(element["symbol"])) {
    let otherMetal = null;
    let multivalentMetal = null;
    for (let i of countElements(partialEq, null).keys()) {
      if (i["symbol"] !== element["symbol"]) {
        otherMetal = i;
        break;
      } else {
        multivalentMetal = i;
      }
    }
    if (!hasPolyatomicIon(partialEq)) {
      for (let charge of MULTIVALENT_METALS.get(element["symbol"])) {
        let crissCrossed = crissCross(
          [multivalentMetal, charge],
          [otherMetal, getElementCharge(otherMetal, partialEq)]
        );
        if (crissCrossed === partialEq) {
          return charge;
        }
      }
    } else {
      for (let i of findIonsAcidsElements(partialEq, null).keys()) {
        if (i["symbol"] !== element["symbol"]) {
          otherMetal = i;
          break;
        } else {
          multivalentMetal = i;
        }
      }
      for (let charge of MULTIVALENT_METALS.get(element["symbol"])) {
        let crissCrossed = crissCross(
          [multivalentMetal, charge],
          [otherMetal, parseCharge(otherMetal["charge"])]
        );
        // console.log(crissCrossed, partialEq);
        partialEq = partialEq.replace("(", "");
        partialEq = partialEq.replace(")", "");
        // partialEq += parseCharge(Math.abs(otherMetal["charge"]));
        if (crissCrossed === partialEq) {
          return charge;
        }
      }
    }
  }
};

const parseCharge = (strCharge) => {
  if (strCharge === "-") {
    return -1;
  }
  if (strCharge === "+") {
    return 1;
  }
  return Number.parseInt(strCharge);
};
