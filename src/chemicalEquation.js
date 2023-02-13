import { symbolToData } from "./elements.js";
import { findName } from "./nomenclature.js";
import { isNumeric } from "./utils.js";

export const countElements = (partialEq, existingCount) => {
  let count = new Map();
  if (existingCount !== null) {
    count = existingCount;
  }

  let coefficient = partialEq.charAt(0);
  if (isNumeric(coefficient)) {
    coefficient = Number.parseInt(coefficient);
  } else {
    coefficient = 1;
  }

  // find parenthesis subscripts
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

  for (let pos of getElementPositions(partialEq)) {
    let subscriptPos = pos[1];
    let key = pos[0].symbol;
    if (!count.has(pos[0])) {
      count.set(pos[0], 0);
    }
    if (isNumeric(partialEq.charAt(subscriptPos))) {
      let subscript = partialEq.charAt(subscriptPos).toString();
      let idx = subscriptPos + 1;
      // find as many subscripts as possible, 2 digit
      while (isNumeric(partialEq.charAt(idx))) {
        subscript += partialEq.charAt(idx);
        idx++;
      }
      let newSubscript = subscript * coefficient;
      if (subscriptPos > parenthesisLower && subscriptPos < parenthesisHigher) {
        newSubscript *= parenthesisSubscript;
      }

      count.set(pos[0], count.get(pos[0]) + newSubscript);
    } else {
      if (subscriptPos > parenthesisLower && subscriptPos < parenthesisHigher) {
        count.set(
          pos[0],
          count.get(pos[0]) + parenthesisSubscript * coefficient
        );
      } else {
        count.set(pos[0], count.get(pos[0]) + coefficient);
      }
    }
  }
  return count;
};

export const getElementPositions = (partialEq) => {
  let offset = 0;
  let idx = [];
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
  for (let i = 0; i < eq.length; i++) {
    if (symbolToData.has(eq.charAt(i))) {
      idx.push([symbolToData.get(eq.charAt(i)), i + 1 + offset]);
    }
  }

  return idx;
};

export const parseReactants = (reactants) => {
  reactants = reactants.replace(" ", "");
  // console.log(this.countElements(reactants, null));
  // console.log(this.getElementPositions(reactants));
  console.log(findName(reactants));
  let elements = reactants.split("+");
  // console.log(elements);
};
