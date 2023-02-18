import { roundToSigFigs } from "./utils.js";
import { roundToDecimalPlaces } from "./utils.js";
import { countSigFigs } from "./utils.js";
import { initElementData, symbolToData } from "./elements.js";
import { getElementCharge, parseReactants } from "./chemicalEquation.js";
import { determineReactionType } from "./predictEquation.js";

/*
todo 
average atomic mass
percent comp
nuclear decay
isotopes (abundance)
wavelength, frequency
energy of photons
electron config
bohr model
nomenclature
half life
ionic bonds, lewis dot, charges, formulas
molecular geometry
balancing chemical equations
types of reactions
states of matter
solubility rules
net ionic equations spec
dimentional analysis temp
stoichemetry
molar mass
avogadros numebr
emperical formula
prediction chemical reactions
limiting reagents
percent yeild
*/

const init = () => {
  let reactants = document.createElement("input");
  reactants.className = "input";
  document.body.appendChild(reactants);

  let products = document.createElement("input");
  products.className = "input";
  document.body.appendChild(products);

  let displayedEquation = document.createElement("h2");
  displayedEquation.className = "equation";
  document.body.appendChild(displayedEquation);

  reactants.addEventListener("input", () => {
    displayEquation(reactants.value, displayedEquation);
    determineReactionType(reactants.value);
    // console.log(getElementCharge(symbolToData.get("Cu"), "Cu(NO3)2"));
    // parseReactants(reactants.value);
  });
};

const displayEquation = (str, equation) => {
  let allowedChars = "abcdefghijklmnopqrstuvwxyz1234567890+=-> ";
  let string = "";
  for (var i = 0; i < str.length; i++) {
    if (allowedChars.indexOf(str.charAt(i).toLowerCase()) > -1) {
      string += str.charAt(i);
    }
  }

  equation.innerHTML = string;
};

init();
initElementData();
// console.log(symbolToData);

// console.log("sigfigs");
// console.log(`${countSigFigs("700")} = 1`);
// console.log(`${countSigFigs("701")} = 3`);
// console.log(`${countSigFigs("777")} = 3`);
// console.log(`${countSigFigs("0.07")} = 1`);
// console.log(`${countSigFigs("0.7")} = 1`);
// console.log(`${countSigFigs("70")} = 1`);
// console.log(`${countSigFigs("70.")} = 2`);
// console.log(`${countSigFigs("70.0")} = 3`);
// console.log(`${countSigFigs("0.368")} = 3`);
// console.log(`${countSigFigs("3.680")} = 4`);

// console.log("rounding decimal");
// console.log(roundToDecimalPlaces("70.4321", 0));
// console.log(roundToDecimalPlaces("70.455", 1));
// console.log(roundToDecimalPlaces("70.4321", 2));
// console.log(roundToDecimalPlaces("70.4321", 3));

// console.log("rounding sigfigs");
// console.log(roundToSigFigs("70.455", 1));
// console.log(roundToSigFigs("70.4321", 2));
// console.log(roundToSigFigs("70.4321", 3));

// console.log("rounding sigfigs test");
// console.log(roundToSigFigs("57.76", 3));
// console.log(roundToSigFigs("53.93", 3));
// console.log(roundToSigFigs("3.675", 3));
// console.log(roundToSigFigs("353.9", 3));
// console.log(roundToSigFigs("3545", 3));
// console.log(roundToSigFigs("2392", 3));
// console.log(roundToSigFigs("67670", 3));
// console.log(roundToSigFigs("68350", 3));
// console.log(roundToSigFigs("137500", 3));
// console.log(roundToSigFigs("121400", 3));
// console.log(roundToSigFigs("0.5293", 3));
// console.log(roundToSigFigs("0.02939", 3));
