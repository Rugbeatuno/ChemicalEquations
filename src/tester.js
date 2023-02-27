import { determineReactionType } from "./predictEquation.js";

console.assert(
  determineReactionType("C2H6 + O2") === "2C2H6+7O2->4CO2+6H2O",
  determineReactionType("C2H6+O2")
);

console.log(determineReactionType("C2H6+O2"));
