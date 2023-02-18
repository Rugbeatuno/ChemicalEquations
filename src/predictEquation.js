import { balanceEquation } from "./balancer/bad.js";
import {
  countElements,
  isMetal,
  isNonmetal,
  hasMetal,
  hasNonmetal,
  isWater,
  hasPolyatomicIon,
  isActiveMetal,
  hasAcid,
  hasHalide,
  getMetal,
} from "./chemicalEquation.js";
import { initElementData, symbolToData } from "./elements.js";

export const SYNTHESIS_A = 0;
export const SYNTHESIS_B = 1;
export const SYNTHESIS_C = 2;
export const SYNTHESIS_D = 3;
export const COMBUSTION = 4;
export const DECOMPOSITION_A = 5;
export const DECOMPOSITION_B = 6;
export const DECOMPOSITION_C = 7;
export const DECOMPOSITION_D = 8;
export const DECOMPOSITION_E = 9;
export const DECOMPOSITION_F = 10;
export const DECOMPOSITION_G = 11;
export const DECOMPOSITION_H = 12;
export const SINGLE_REPLACEMENT_A = 13;
export const SINGLE_REPLACEMENT_B = 14;
export const SINGLE_REPLACEMENT_C = 15;
export const SINGLE_REPLACEMENT_D = 16;
export const DOUBLE_REPLACEMENT_A = 17;
export const DOUBLE_REPLACEMENT_B = 18;
export const DOUBLE_REPLACEMENT_C = 19;

const isCombustionReaction = (reactantEq) => {
  let parts = reactantEq.split("+");
  if (parts.length == 2) {
    // check for combustion reaction
    // check for hydrocarbon
    let elements = countElements(parts[0], null);
    let containsCarbon = elements.has(symbolToData.get("C"));
    let containsHydrogen = elements.has(symbolToData.get("H"));
    // check for oxygen
    elements = countElements(parts[1], null);
    let containOxygen = elements.has(symbolToData.get("O"));

    if (containsCarbon && containsHydrogen && containOxygen) {
      return [balanceEquation(`${reactantEq}->CO2+H2O`), COMBUSTION];
    }
  }
  return null;
};

const isSynthesisReaction = (reactantEq) => {
  if (reactantEq.split("+").length !== 2) {
    return null;
  }
  let split = reactantEq.split("+");
  let reactant1 = countElements(split[0], null);
  let reactant2 = countElements(split[1], null);

  // hydrogen + nonmetal
  if (
    reactant1.size === 1 &&
    reactant1.has(symbolToData.get("H")) &&
    hasNonmetal(reactant2) &&
    reactant2.size === 1
  ) {
    return [
      balanceEquation(
        `${reactantEq}->${Array.from(reactant1.keys())[0]["symbol"]}${
          Array.from(reactant2.keys())[0]["symbol"]
        }`
      ),
      SYNTHESIS_A,
    ];
  }

  // metal + nonmetal
  if (
    reactant1.size === 1 &&
    hasMetal(reactant1) &&
    reactant2.size === 1 &&
    hasNonmetal(reactant2)
  ) {
    return [
      balanceEquation(
        `${reactantEq}->${Array.from(reactant1.keys())[0]["symbol"]}${
          Array.from(reactant2.keys())[0]["symbol"]
        }`
      ),
      SYNTHESIS_B,
    ];
  }

  // metal oxide + water
  if (
    hasMetal(reactant1) &&
    reactant1.size == 2 &&
    reactant1.has(symbolToData.get("O")) &&
    isWater(reactant2) &&
    reactant2.size === 2
  ) {
    console.log(`${getMetal(reactant1)["symbol"]}OH`);
    return [
      balanceEquation(`${reactantEq}->${getMetal(reactant1)["symbol"]}(OH)`),
      SYNTHESIS_C,
    ];
  }

  // nonmetal oxide + water
  if (
    hasNonmetal(reactant1) &&
    reactant1.size == 2 &&
    reactant1.has(symbolToData.get("O")) &&
    isWater(reactant2) &&
    reactant2.size === 2
  ) {
    return SYNTHESIS_D;
  }
};

const isSingleReplacement = (reactantEq) => {
  let split = reactantEq.split("+");
  if (split.length !== 2) {
    return null;
  }
  let reactant1 = countElements(split[0], null);
  let reactant2 = countElements(split[1], null);

  // metal + metal(polyatomic ion)
  if (
    reactant1.size === 1 &&
    hasMetal(reactant1) &&
    hasMetal(reactant2) &&
    hasPolyatomicIon(split[1])
  ) {
    return SINGLE_REPLACEMENT_A;
  }

  // active metal + water
  if (
    reactant1.size === 1 &&
    isActiveMetal(Array.from(reactant1.keys())[0]) &&
    isWater(reactant2)
  ) {
    return SINGLE_REPLACEMENT_B;
  }

  // acid + metal
  if (
    hasAcid(split[0]) &&
    reactant2.size === 1 &&
    isMetal(Array.from(reactant2.keys())[0])
  ) {
    return SINGLE_REPLACEMENT_C;
  }

  // halide + halide
  if (hasHalide(reactant1) && reactant1.size === 1 && hasHalide(reactant2)) {
    return SINGLE_REPLACEMENT_D;
  }
};

const isDoubleReplacement = (reactantEq) => {
  let split = reactantEq.split("+");
  if (split.length !== 2) {
    return null;
  }
  let reactant1 = countElements(split[0], null);
  let reactant2 = countElements(split[1], null);

  // formation of a precipitate
  if (
    hasMetal(reactant1) &&
    (hasPolyatomicIon(split[0]) || hasNonmetal(reactant1)) &&
    hasMetal(reactant2) &&
    (hasPolyatomicIon(split[1]) || hasNonmetal(reactant2))
  ) {
    return DOUBLE_REPLACEMENT_A;
  }

  // formation of a gas (acid + carbonate)
  if (hasAcid(split[0]) && split[1].includes("CO3")) {
    return DOUBLE_REPLACEMENT_B;
  }

  // acid base neutralization (acid + base)
  if (hasAcid(split[0]) && split[1].includes("OH") && hasMetal(reactant2)) {
    return DOUBLE_REPLACEMENT_C;
  }
};

export const determineReactionType = (reactantEq) => {
  reactantEq = reactantEq.replace(" ", "");
  let flippedEq = `${reactantEq.split("+")[1]}+${reactantEq.split("+")[0]}`;
  console.log("combustion", isCombustionReaction(reactantEq));
  console.log("synthesis", isSynthesisReaction(reactantEq));
  console.log("singe replacement", isSingleReplacement(reactantEq));
  console.log("double replacement", isDoubleReplacement(reactantEq));
};

export const predict = () => {};

initElementData();
