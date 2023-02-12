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

    for (let i = 0; i < partialEq.length; i++) {
      if (partialEq.charAt(i) === ")") {
        locs.push(i);
      }
    }
    for (let parenthesis of locs) {
      let multiplier = Number.parseInt(partialEq.charAt(parenthesis + 1));
      if (multiplier === 0) {
        continue;
      }

      let idx = parenthesis;
      while (partialEq.charAt(idx) !== "(") {
        idx--;
      }
      let eq = partialEq.slice(idx + 1, parenthesis);

      for (let pos of this.getElementPositions(eq)) {
        let numberPos = pos[1] + offset;
        if (isNumeric(eq.charAt(numberPos))) {
          let subscript = eq.charAt(numberPos).toString();
          idx = numberPos + 1;
          // find as many coefficients as possible
          while (isNumeric(eq.charAt(idx))) {
            subscript += eq.charAt(idx);
            idx++;
          }
          let newSubscript = subscript * multiplier;
          eq = eq.replace(
            pos[0].symbol + subscript,
            pos[0].symbol + newSubscript
          );
          offset +=
            newSubscript.toString().length - subscript.toString().length;
        } else {
          eq = eq.replace(pos[0].symbol, pos[0].symbol + multiplier);
          offset += multiplier.toString().length;
        }
      }
      console.log(eq);
    }
  }

  separateElementsFromIons() {}

  getElementPositions(partialEq) {
    let idx = [];
    // 2 letter symbols
    let eq = partialEq.toString();
    for (let i = 0; i < partialEq.length - 1; i++) {
      let pair = partialEq.charAt(i) + partialEq.charAt(i + 1);
      if (symbolToData.has(pair)) {
        idx.push([symbolToData.get(pair), i + 2]);
        eq = eq.replace(pair, "");
      }
    }
    // 1 letter symbols
    for (let i = 0; i < eq.length; i++) {
      if (symbolToData.has(eq.charAt(i))) {
        idx.push([symbolToData.get(eq.charAt(i)), i + 1]);
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
