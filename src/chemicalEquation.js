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

      console.log(this.getElementPositions(eq));
      for (let pos of this.getElementPositions(eq)) {
        let numberPos = pos[1] + offset;
        console.log(numberPos);
        if (isNumeric(eq.charAt(numberPos))) {
          eq = eq.replaceAt(numberPos, eq.charAt(numberPos) * multiplier);
        } else {
          eq =
            eq.slice(0, numberPos) +
            multiplier.toString() +
            eq.slice(numberPos);
          offset += multiplier.toString().length;
        }
      }
      console.log(eq);
    }
  }

  separateElementsFromIons() {}

  getElementPositions(partialEq) {
    let idx = [];
    let currentString = partialEq.charAt(0);
    let offset = 0;
    for (let i = 0; i < partialEq.length; i++) {
      let newChar = partialEq.charAt(i);
      if (i === partialEq.length - 1) {
        currentString = newChar;
      }
      // this tells you that you have reached the end of an element or have reached it coefficeints
      if (
        "0123456789+()".includes(newChar) ||
        newChar === newChar.toUpperCase() ||
        i === partialEq.length - 1
      ) {
        console.log(currentString, newChar);
        if (symbolToData.has(currentString)) {
          if (i === 0) {
            offset = 1;
          }
          idx.push([symbolToData.get(currentString), i + offset]);
        }
        currentString = "";
      }
      if (!"0123456789+()".includes(newChar)) {
        currentString += newChar;
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
    // console.log(this.expandParenthesis(reactants));
    console.log(this.getElementPositions(reactants));
    let elements = reactants.split("+");
    // console.log(elements);
  }
}
