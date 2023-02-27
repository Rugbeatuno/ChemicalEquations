// https://tigerweb.towson.edu/ladon/react.html
import { balanceEquation } from "./balancer/balancer.js";
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
  getNonmetal,
  crissCross,
  getElementCharge,
  getPolyatomicIon,
  parseCharge,
  isPolyatomicIon,
  getAcid,
} from "./chemicalEquation.js";
import { initElementData, polyatomicIons, symbolToData } from "./elements.js";
import { findIonsAcidsElements, findIonsElements } from "./nomenclature.js";
import { ROMAN_NUMERALS } from "./constants.js";

export const SYNTHESIS_A = 0;
export const SYNTHESIS_B = 1;
export const SYNTHESIS_C = 2;
export const SYNTHESIS_D = 3;
export const SYNTHESIS_E = 20;
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
export const SINGLE_REPLACEMENT_E = 17;
export const DOUBLE_REPLACEMENT_A = 18;
export const DOUBLE_REPLACEMENT_B = 19;
export const DOUBLE_REPLACEMENT_C = 20;
export const DOUBLE_REPLACEMENT_D = 21;

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
    let crissCrossed = crissCross(
      [symbolToData.get("H"), 1],
      [
        getNonmetal(reactant2),
        getElementCharge(getNonmetal(reactant2), split[1]),
      ]
    );
    console.log(`${reactantEq}->$${crissCrossed}`);
    return [balanceEquation(`${reactantEq}->${crissCrossed}`), SYNTHESIS_A];
  }

  // metal + nonmetal
  if (
    reactant1.size === 1 &&
    hasMetal(reactant1) &&
    reactant2.size === 1 &&
    hasNonmetal(reactant2)
  ) {
    let crissCrossed = crissCross(
      [getMetal(reactant1), getElementCharge(getMetal(reactant1), split[0])],
      [
        getNonmetal(reactant2),
        getElementCharge(getNonmetal(reactant2), split[1]),
      ]
    );
    return [balanceEquation(`${reactantEq}->${crissCrossed}`), SYNTHESIS_B];
  }

  // metal oxide + water
  if (
    hasMetal(reactant1) &&
    reactant1.size == 2 &&
    reactant1.has(symbolToData.get("O")) &&
    isWater(reactant2) &&
    reactant2.size === 2
  ) {
    let crissCrossed = crissCross(
      [getMetal(reactant1), getElementCharge(getMetal(reactant1), split[0])],
      [
        polyatomicIons.get("OH"),
        getElementCharge(polyatomicIons.get("OH"), split[1]),
      ]
    );
    return [balanceEquation(`${reactantEq}->${crissCrossed}`), SYNTHESIS_C];
  }

  // nonmetal oxide + water
  if (
    hasNonmetal(reactant1) &&
    reactant1.size == 2 &&
    reactant1.has(symbolToData.get("O")) &&
    isWater(reactant2) &&
    reactant2.size === 2
  ) {
    let nonmetal = getNonmetal(reactant1);
    let coeff1 = reactant1.get(nonmetal);
    if (coeff1 === 1) {
      coeff1 = "";
    }
    let coeff2 =
      reactant1.get(symbolToData.get("O")) +
      reactant2.get(symbolToData.get("O"));
    return [
      balanceEquation(
        `${reactantEq}->H2${nonmetal["symbol"]}${coeff1}O${coeff2}`
      ),
      SYNTHESIS_D,
    ];
  }

  // nonmetal and nonmetal, covalent bond
  if (
    hasNonmetal(reactant1) &&
    reactant1.size === 1 &&
    !reactant1.has(symbolToData.get("H")) &&
    hasNonmetal(reactant2) &&
    reactant2.size === 1 &&
    !reactant2.has(symbolToData.get("H"))
  ) {
    let nonmetal1 = getNonmetal(reactant1);
    let nonmetal2 = getNonmetal(reactant2);
    let crissCrossed = crissCross(
      [nonmetal1, getElementCharge(nonmetal1, split[0])],
      [nonmetal2, getElementCharge(nonmetal2, split[1])]
    );
    console.log(`${reactantEq}->${crissCrossed}`);
    return [balanceEquation(`${reactantEq}->${crissCrossed}`), SYNTHESIS_E];
  }
};

const isSingleReplacement = (reactantEq) => {
  let split = reactantEq.split("+");
  if (split.length !== 2) {
    return null;
  }
  let reactant1 = countElements(split[0], null);
  let reactant2 = countElements(split[1], null);
  if (reactant2.size < 2) {
    return null;
  }

  // metal + metal(polyatomic ion)
  if (
    reactant1.size === 1 &&
    hasMetal(reactant1) &&
    hasMetal(reactant2) &&
    hasPolyatomicIon(split[1])
  ) {
    let crissCrossed = crissCross(
      [getMetal(reactant1), getElementCharge(getMetal(reactant1), split[0])],
      [
        getPolyatomicIon(split[1]),
        parseCharge(getPolyatomicIon(split[1])["charge"]),
      ]
    );
    // Al+Fe(NO3)2
    console.log(
      `${reactantEq}->${crissCrossed}+${getMetal(reactant2)["symbol"]}`
    );
    return [
      balanceEquation(
        `${reactantEq}->${crissCrossed}+${getMetal(reactant2)["symbol"]}`
      ),
      SINGLE_REPLACEMENT_A,
    ];
  }

  // active metal + water
  if (
    reactant1.size === 1 &&
    isActiveMetal(Array.from(reactant1.keys())[0]) &&
    isWater(reactant2)
  ) {
    let crissCrossed = crissCross(
      [getMetal(reactant1), getElementCharge(getMetal(reactant1), split[0])],
      [
        polyatomicIons.get("OH"),
        getElementCharge(polyatomicIons.get("OH"), split[1]),
      ]
    );
    return [
      balanceEquation(`${reactantEq}->${getMetal(reactant1)["symbol"]}+H2`),
      SINGLE_REPLACEMENT_B,
    ];
  }

  // acid + metal
  if (
    hasAcid(split[0]) &&
    reactant2.size === 1 &&
    isMetal(Array.from(reactant2.keys())[0])
  ) {
    reactant1.delete(symbolToData.get("H"));
    // it will either be a polyatomic or a binary element (halide)
    let crissCrossed = null;
    if (hasPolyatomicIon(split[0])) {
      crissCrossed = crissCross(
        [getMetal(reactant2), getElementCharge(getMetal(reactant2), split[1])],
        [
          getPolyatomicIon(split[0]),
          getElementCharge(getPolyatomicIon(split[0]), split[0]),
        ]
      );
    } else {
      crissCrossed = crissCross(
        [getMetal(reactant2), getElementCharge(getMetal(reactant2), split[1])],
        [
          getNonmetal(reactant1),
          getElementCharge(getNonmetal(reactant1), split[0]),
        ]
      );
    }
    return [
      balanceEquation(`${reactantEq}->${crissCrossed}+H2`),
      SINGLE_REPLACEMENT_C,
    ];
  }

  // halide + halide
  if (hasHalide(reactant1) && reactant1.size === 1 && hasHalide(reactant2)) {
    let nonmetal = getNonmetal(reactant2);
    reactant2.delete(nonmetal);
    let crissCrossed = null;
    // acid will either be H, polyatomic ion, or metal
    let firstHalide = getElementCharge(getNonmetal(reactant1), split[0]);
    if (hasPolyatomicIon(split[1])) {
      crissCrossed = crissCross(
        [
          getPolyatomicIon(split[1]),
          getElementCharge(getPolyatomicIon(split[1]), split[1]),
        ],
        [getNonmetal(reactant1), firstHalide]
      );
    } else if (reactant2.size === 1 && reactant2.has(symbolToData.get("H"))) {
      crissCrossed = crissCross(
        [symbolToData.get("H"), 1],
        [getNonmetal(reactant1), firstHalide]
      );
    } else {
      let metal = getMetal(reactant2);
      crissCrossed = crissCross(
        [metal, getElementCharge(metal, split[1])],
        [getNonmetal(reactant1), firstHalide]
      );
    }
    return [
      balanceEquation(`${reactantEq}->${crissCrossed}+${nonmetal["symbol"]}2`),
      SINGLE_REPLACEMENT_D,
    ];
  }

  if (
    hasMetal(reactant1) &&
    reactant1.size === 1 &&
    hasMetal(reactant2) &&
    reactant2.size === 2 &&
    hasNonmetal(reactant2)
  ) {
    let crissCrossed = crissCross(
      [getMetal(reactant1), getElementCharge(getMetal(reactant1), split[0])],
      [
        getNonmetal(reactant2),
        getElementCharge(getNonmetal(reactant2), split[1]),
      ]
    );
    return [
      balanceEquation(
        `${reactantEq}->${crissCrossed}+${getMetal(reactant2)["symbol"]}`
      ),
      SINGLE_REPLACEMENT_E,
    ];
  }
};

const isDoubleReplacement = (reactantEq) => {
  let split = reactantEq.split("+");
  if (split.length !== 2) {
    return null;
  }
  let reactant1 = countElements(split[0], null);
  let reactant2 = countElements(split[1], null);

  if (reactant1.size < 2 || reactant2.size < 2) {
    return null;
  }

  // formation of a precipitate
  if (
    hasMetal(reactant1) &&
    (hasPolyatomicIon(split[0]) || hasNonmetal(reactant1)) &&
    hasMetal(reactant2) &&
    (hasPolyatomicIon(split[1]) || hasNonmetal(reactant2))
  ) {
    let crissCrossed1 = null;
    let crissCrossed2 = null;
    let crissCross1Reactant = null;
    let crissCross2Reactant = null;
    if (hasPolyatomicIon(split[1])) {
      crissCross1Reactant = getPolyatomicIon(split[1]);
    } else {
      crissCross1Reactant = getNonmetal(reactant2);
    }
    if (hasPolyatomicIon(split[0])) {
      crissCross2Reactant = getPolyatomicIon(split[0]);
    } else {
      crissCross2Reactant = getNonmetal(reactant1);
    }
    console.log(
      [getMetal(reactant1), getElementCharge(getMetal(reactant1), split[0])],
      [crissCross1Reactant, getElementCharge(crissCross1Reactant, split[1])]
    );
    crissCrossed1 = crissCross(
      [getMetal(reactant1), getElementCharge(getMetal(reactant1), split[0])],
      [crissCross1Reactant, getElementCharge(crissCross1Reactant, split[1])]
    );
    crissCrossed2 = crissCross(
      [getMetal(reactant2), getElementCharge(getMetal(reactant2), split[1])],
      [crissCross2Reactant, getElementCharge(crissCross2Reactant, split[0])]
    );
    return [
      balanceEquation(`${reactantEq}->${crissCrossed1}+${crissCrossed2}`),
      DOUBLE_REPLACEMENT_A,
    ];
  }

  // formation of a gas (acid + carbonate)
  if (hasAcid(split[1]) && split[0].includes("CO3")) {
    let metal = getMetal(reactant1);
    // acids are either nonmetal or polyatomic ion
    let crissCrossed = null;
    if (hasPolyatomicIon(split[1])) {
      crissCrossed = crissCross(
        [metal, getElementCharge(metal, split[0])],
        [
          getPolyatomicIon(split[1]),
          getElementCharge(getPolyatomicIon(split[1]), split[1]),
        ]
      );
    } else {
      crissCrossed = crissCross(
        [metal, getElementCharge(metal, split[0])],
        [
          getNonmetal(reactant2),
          getElementCharge(getNonmetal(reactant2), split[1]),
        ]
      );
    }
    return [
      balanceEquation(`${reactantEq}->${crissCrossed}+H2O+CO2`),
      DOUBLE_REPLACEMENT_B,
    ];
  }

  // acid base neutralization (acid + base)
  if (
    hasAcid(split[0]) &&
    (split[1].includes("OH") || split[1].includes("NH3"))
  ) {
    if (split[1].includes("OH")) {
      let metal = getMetal(reactant2);
      // acids are either nonmetal or polyatomic ion
      let crissCrossed = null;
      if (hasPolyatomicIon(split[0])) {
        crissCrossed = crissCross(
          [metal, getElementCharge(metal, split[1])],
          [
            getPolyatomicIon(split[0]),
            getElementCharge(getPolyatomicIon(split[0]), split[0]),
          ]
        );
      } else {
        crissCrossed = crissCross(
          [metal, getElementCharge(metal, split[1])],
          [
            getNonmetal(reactant1),
            getElementCharge(getNonmetal(reactant1), split[0]),
          ]
        );
      }
      return [
        balanceEquation(`${reactantEq}->${crissCrossed}+H2O`),
        DOUBLE_REPLACEMENT_C,
      ];
    } else {
      return [
        balanceEquation(
          `${reactantEq}->NH4${getAcid(split[0])["symbol"].slice(1)}`
        ),
        DOUBLE_REPLACEMENT_C,
      ];
    }
  }

  // every other double replacement
  if (reactant1.size >= 2 && reactant2.size >= 2) {
    let elements = findIonsElements(split[0]);
    let keys = Array.from(elements.keys());

    // find cation and anion
    let reactant1Cation = null;
    let reactant1Anion = null;
    if (getElementCharge(keys[0], split[1]) < 0) {
      reactant1Anion = keys[0];
      reactant1Cation = keys[1];
    } else {
      reactant1Cation = keys[0];
      reactant1Anion = keys[1];
    }

    elements = findIonsElements(split[1]);
    keys = Array.from(elements.keys());
    // find cation and anion
    let reactant2Cation = null;
    let reactant2Anion = null;
    if (getElementCharge(keys[0], split[0]) < 0) {
      reactant2Anion = keys[0];
      reactant2Cation = keys[1];
    } else {
      reactant2Cation = keys[0];
      reactant2Anion = keys[1];
    }

    let crissedCrossed1 = crissCross(
      [reactant1Cation, getElementCharge(reactant1Cation, split[0])],
      [reactant2Anion, getElementCharge(reactant2Anion, split[1])]
    );
    let crissedCrossed2 = crissCross(
      [reactant2Cation, getElementCharge(reactant2Cation, split[0])],
      [reactant1Anion, getElementCharge(reactant1Anion, split[1])]
    );

    return [
      balanceEquation(`${reactantEq}->${crissedCrossed2}+${crissedCrossed1}`),
      DOUBLE_REPLACEMENT_D,
    ];
  }
};

const isDecompositionReaction = (reactantEq) => {
  if (reactantEq.split("+").length !== 1) {
    return null;
  }
  let reactant1 = countElements(reactantEq, null);

  // binary compounds
  // metallic carbonates
  // metallic hydrogen carbonates
  // metallic hydroxides
  // metallic chlorates decompose
  // some acids decompose to nonmetal oxides and water
  // hydrate decomposition

  // peroxide
  if (reactantEq.includes("H2O2") && reactant1.size === 2) {
    return [balanceEquation(`${reactantEq}->H2O+O2`), DECOMPOSITION_H];
  }
};

export const determineReactionType = (reactantEq) => {
  console.log(reactantEq);
  reactantEq = reactantEq.replace(" ", "");
  let flippedEq = `${reactantEq.split("+")[1]}+${reactantEq.split("+")[0]}`;

  let reaction = "";
  for (let i of [reactantEq, flippedEq]) {
    let combustionReaction = isCombustionReaction(i);
    let synthesisReaction = isSynthesisReaction(i);
    let singleReplacementReaction = isSingleReplacement(i);
    let doubleReplacementReaction = isDoubleReplacement(i);
    let decompositionReaction = isDecompositionReaction(i);
    for (let j of [
      combustionReaction,
      synthesisReaction,
      singleReplacementReaction,
      doubleReplacementReaction,
      decompositionReaction,
    ]) {
      if (j) {
        reaction = j;
      }
    }
  }
  console.log(reaction);
  return reaction;
};

export const predict = () => {};

initElementData();
