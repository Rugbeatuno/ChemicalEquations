import { acids, polyatomicIons, symbolToData } from "./elements.js";
import { countElements } from "./chemicalEquation.js";
import { isNumeric } from "./utils.js";
import { PREFIXES, VOWELS } from "./constants.js";

const findIonsAcidsElements = (partialEq) => {
  let count = new Map();

  for (let ion of new Map([...acids, ...polyatomicIons])) {
    let symbol = ion[0];
    let symbol2 = symbol;
    let number = symbol.charAt(symbol.length - 1);
    if (isNumeric(number)) {
      symbol2 = `(${symbol.slice(0, -1)})${number}`;
    }

    if (partialEq.includes(symbol)) {
      partialEq = partialEq.replace(symbol, "");
      count.set(ion[1], 1);
    }
    if (partialEq.includes(symbol2)) {
      partialEq = partialEq.replace(symbol2, "");
      count.set(ion[1], 1);
    }
  }
  countElements(partialEq, count);
  return count;
};

export const isPolyatomicIon = (obj) => {
  for (let i of polyatomicIons) {
    if (obj["symbol"] === i[0]) {
      return true;
    }
  }
  return false;
};

export const isAcid = (obj) => {
  for (let i of acids) {
    if (obj["symbol"] === i[0]) {
      return true;
    }
  }
  return false;
};

export const isBinaryElement = (obj) => {
  for (let i of symbolToData) {
    if (obj["symbol"] === i[0]) {
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

export const orderElements = (elements, partialEq) => {
  let keys = Array.from(elements.keys());
  let element1IsMetal = isMetal(keys[0]);
  let element2IsMetal = isMetal(keys[1]);
  if (element1IsMetal && !element2IsMetal) {
    return [keys[0], keys[1]];
  }
  if (!element1IsMetal && element2IsMetal) {
    return [keys[1], keys[0]];
  }
  if (!element1IsMetal && !element2IsMetal) {
    let element1Pos = partialEq.indexOf(keys[0]["symbol"]);
    let element2Pos = partialEq.indexOf(keys[1]["symbol"]);
    if (element1Pos < element2Pos) {
      return [keys[0], keys[1]];
    }
    return [keys[1], keys[0]];
  }
  return [keys[0], keys[1]];
};

const combinePrefix = (prefix, str) => {
  if (
    prefix &&
    VOWELS.includes(str.charAt(0).toLowerCase()) &&
    ["a", "o"].includes(prefix.charAt(prefix.length - 1).toLowerCase())
  ) {
    prefix = prefix.slice(0, -1);
  }
  return (prefix + str).toLowerCase();
};

const convertToIde = (str) => {
  let seenVowels = 0;
  for (let i = str.length - 1; i > 0; i--) {
    if (VOWELS.includes(str.charAt(i).toLowerCase())) {
      seenVowels++;
    }
    if (seenVowels == 2) {
      let suffix = str.slice(i);
      return str.replace(suffix, "ide");
    }
  }
};

const molecularFormula = (elements, partialEq) => {
  let [part1, part2] = orderElements(elements, partialEq);
  let part1Prefix = "";
  let part2Prefix = "";
  if (elements.get(part1) > 1) {
    part1Prefix = PREFIXES[elements.get(part1) - 1];
  }
  part2Prefix = PREFIXES[elements.get(part2) - 1];

  let part1Text = combinePrefix(part1Prefix, part1["name"]);
  let part2Text = combinePrefix(part2Prefix, part2["name"]);
  return `${[part1Text]} ${convertToIde(part2Text)}`;
};

const ionicFormula = (elements, partialEq) => {
  let [part1, part2] = orderElements(elements, partialEq);
  let part2Name = part2["name"];
  if (!isPolyatomicIon(part2)) {
    part2Name = convertToIde(part2Name);
  }
  return `${[part1["name"]]} ${part2Name}`;
};

export const findName = (partialEq) => {
  let parts = findIonsAcidsElements(partialEq);
  let length = parts.size;
  if (length === 0) {
    return;
  }
  let keys = Array.from(parts.keys());
  let part1 = keys[0];
  // single ions, acids
  if (length === 1) {
    return part1["name"];
  }

  // ionic compound
  if (length === 2) {
    let part2 = keys[1];
    if (!isMetal(part1) && !isMetal(part2)) {
      return molecularFormula(parts, partialEq);
    }
    if (isMetal(part1) || isMetal(part2)) {
      return ionicFormula(parts, partialEq);
    }
  }
  // covalent compound
  // polyatomic compound
};
