import { symbolToData } from "./elements.js";
import { isNumeric } from "./utils.js";

export class ChemicalEquation {
  constructor(reactants, products) {
    this.reactants = this.parseReactants(reactants);
    this.products = [];
  }

  expandParenthesis(partialEq) {
    let locs = [];
    let offset = 0;

    let coefficient = partialEq.charAt(0);
    if (isNumeric(coefficient)) {
      coefficient = Number.parseInt(coefficient);
    } else {
      coefficient = 1;
    }
    console.log(coefficient);

    // find parenthesis subscripts
    let parenthesisLower = 1000;
    let parenthesisHigher = -1000;
    let parenthesisSubscript = 1;
    for (let i = 0; i < partialEq.length; i++) {
      if (partialEq.charAt(i) === ")") {
        let idx = i;
        while (partialEq.charAt(idx) !== "(") {
          idx--;
        }
        parenthesisLower = idx + 1;
        parenthesisHigher = i + 1;
        parenthesisSubscript = Number.parseInt(partialEq.charAt(i + 1));
      }
    }

    for (let pos of this.getElementPositions(partialEq)) {
      let subscriptPos = pos[1] + offset;
      if (isNumeric(partialEq.charAt(subscriptPos))) {
        let subscript = partialEq.charAt(subscriptPos).toString();
        let idx = subscriptPos + 1;
        // find as many subscripts as possible, 2 digit
        while (isNumeric(partialEq.charAt(idx))) {
          subscript += partialEq.charAt(idx);
          idx++;
        }
        let newSubscript = subscript * coefficient;
        if (
          subscriptPos > parenthesisLower + offset &&
          subscriptPos < parenthesisHigher + offset
        ) {
          newSubscript *= parenthesisSubscript;
        }
        partialEq = partialEq.replace(
          pos[0].symbol + subscript,
          pos[0].symbol + newSubscript
        );
        offset += newSubscript.toString().length - subscript.toString().length;
      } else {
        if (
          subscriptPos > parenthesisLower + offset &&
          subscriptPos < parenthesisHigher + offset
        ) {
          partialEq = partialEq.replace(
            pos[0].symbol,
            pos[0].symbol + parenthesisSubscript * coefficient
          );
          offset += (parenthesisSubscript * coefficient).toString().length;
        }
      }
    }
    partialEq = partialEq.replace("(", "");
    partialEq = partialEq.replace(`)${parenthesisSubscript}`, "");

    console.log(partialEq);
  }

  separateElementsFromIons() {}

  getElementPositions(partialEq) {
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
  }

  countElements(partialEq) {
    partialEq = partialEq.replace(" ", "");
    let elements = new Map();
    let currentCoefficient = 1;
    // 2Ag(NO)3

    // split on +
    for (let eq of partialEq.split("+")) {
      // expand any parenthesis
      // find all closing parenthesis
      let parenthesisLocs = [];

      for (let i in partialEq.length - 1) {
        let charPair = partialEq.charAt(i) + partialEq.charAt(i + 1);
        if (symbolToData.has(charPair)) {
        }
      }
    }
  }

  parseReactants(reactants) {
    reactants = reactants.replace(" ", "");
    console.log(this.expandParenthesis(reactants));
    // console.log(this.getElementPositions(reactants));
    let elements = reactants.split("+");
    // console.log(elements);
  }
}
