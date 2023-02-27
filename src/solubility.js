import { initElementData, polyatomicIons, symbolToData } from "./elements.js";
import {
  countElements,
  getElementCharge,
  getMetal,
  getPolyatomicIon,
  hasHalide,
  hasMetal,
  isAcid,
  isHalide,
  isMetal,
  isPolyatomicIon,
  isWater,
} from "./chemicalEquation.js";
import { findIonsAcidsElements } from "./nomenclature.js";
initElementData();

export const SOLID = 0;
export const LIQUID = 1;
export const GAS = 2;
export const AQUEOUS = 3;

export const getState = (partialEq) => {
  let elements = findIonsAcidsElements(partialEq);

  if (elements.size === 1) {
    let state = Array.from(elements.keys())[0]["phase"];
    if (state === "Solid") {
      return SOLID;
    }
    if (state === "Liquid") {
      return LIQUID;
    }
    if (state === "Gas") {
      return GAS;
    }
  }
  // soluble
  let containsAg = elements.has(symbolToData.get("Ag"));
  let containsHg1 =
    elements.has(symbolToData.get("Hg")) &&
    getElementCharge(elements.has(symbolToData.get("Hg")), partialEq) === 1;
  let containsHg2 =
    elements.has(symbolToData.get("Hg")) &&
    getElementCharge(elements.has(symbolToData.get("Hg")), partialEq) === 2;
  let containsPb2 =
    elements.has(symbolToData.get("Pb")) &&
    getElementCharge(elements.has(symbolToData.get("Pb")), partialEq) === 2;
  let containsFe3 =
    elements.has(symbolToData.get("Fe")) &&
    getElementCharge(elements.has(symbolToData.get("Fe")), partialEq) === 3;

  for (let i of elements.keys()) {
    if (isMetal(i) && i["group"] === 1) {
      return AQUEOUS;
    }
    if (isHalide(i)) {
      if (i["symbol"] === "F") {
        if (
          !getMetal(elements)["group"] === 2 &&
          !containsPb2 &&
          !containsFe3
        ) {
          return AQUEOUS;
        }
      } else if (!containsAg && !containsHg2 && !containsPb2) {
        return AQUEOUS;
      }
    }

    if (
      isPolyatomicIon(i) &&
      i["symbol"] === "SO4" &&
      !elements.has(symbolToData.get("Ca")) &&
      !elements.has(symbolToData.get("Sr")) &&
      !elements.has(symbolToData.get("Ba")) &&
      !containsHg1 &&
      !containsPb2 &&
      !elements.has(symbolToData.get("Ag"))
    ) {
      return AQUEOUS;
    }

    if (isPolyatomicIon(i) && i["symbol"] === "HCO3") {
      let group = getMetal(elements)["group"];
      if (group <= 2 && group >= 13) {
        return AQUEOUS;
      }
    }

    if (isAcid(i)) {
      return AQUEOUS;
    }
  }
  for (let i of ["NH4", "NO3", "ClO3", "ClO4", "C2H3O2"]) {
    if (elements.has(polyatomicIons.get(i))) {
      return AQUEOUS;
    }
  }

  // insoluble

  for (let i of ["CO3", "PO4", "C2O4", "CrO4"]) {
    if (elements.has(polyatomicIons.get(i))) {
      if (hasMetal(elements) && getMetal(elements)["group"] === 1) {
        return AQUEOUS;
      }
      if (elements.has(polyatomicIons.get("NH4"))) return AQUEOUS;
    }
  }
  for (let i of ["OH", "O"]) {
    if (elements.has(polyatomicIons.get(i))) {
      if (
        (hasMetal(elements) && getMetal(elements)["group"] === 1) ||
        elements.has(polyatomicIons.get("NH4")) ||
        elements.has(symbolToData.get("Sr")) ||
        elements.has(symbolToData.get("Ba")) ||
        elements.has(symbolToData.get("Ca"))
      ) {
        return AQUEOUS;
      }
      if (elements.has(polyatomicIons.get("NH4"))) return AQUEOUS;
    }
  }

  if (elements.has(symbolToData.get("S"))) {
    if (
      hasMetal(elements) &&
      (getMetal(elements)["group"] <= 2 ||
        elements.has(polyatomicIons.get("NH4")))
    ) {
      return AQUEOUS;
    }
  }

  if (isWater(elements)) {
    return LIQUID;
  }
  for (let i of [
    "C2H2",
    "Ar",
    "CO2",
    "He",
    "H2",
    "Kr",
    "Ne",
    "N2",
    "O2",
    "C3H8",
    "C3H6",
    "SF6",
    "Xe",
  ]) {
    if (partialEq === i) {
      return GAS;
    }
  }
  return SOLID;
  //   for (let i of ['CO3', 'PO4', 'C2O4', 'CrO4']) {
  //     if (elements.has(polyatomicIons.get(i)) && getMetal(elements)['group'] !== 1 && !elements.has(polyatomicIons.get('NH4'))) {
  //       return AQUEOUS;
  //     }
  //   }
};

export const formatState = (state) => {
  if (state === SOLID) {
    return "(s)";
  }
  if (state === LIQUID) {
    return "(l)";
  }
  if (state === GAS) {
    return "(g)";
  }
  if (state === AQUEOUS) {
    return "(aq)";
  }
};
