// import { balance } from "../node_modules/reaction-balancer/index.js";

// export const balanceEquation = (equation) => {
//   equation = equation.replace(" ", "");
//   let parts = equation.split("->");
//   let reactants = parts[0].split("+");
//   let products = parts[1].split("+");
//   let reaction = {
//     reactants: reactants,
//     products: products,
//   };
//   let coefficients = balance(reaction);
//   let res = "";
//   for (let i of coefficients.keys()) {
//     res += `${i}${coefficients.get(i)}+`;
//   }
//   res = res.slice(0, -1); // remove trailing plus
//   return res;
// };
// // H2 + O2 -> H2O

// const coeffs = balance(reaction); // Map {"H2" => 2, "O2" => 1, "H2O" => 2}
import balance from "./equation-balancer/balance.js";
console.log(balance("Fe + H2SO4 -> Fe2(SO4)3 + H2")); // [2, 3, 1, 3]
console.log("here");

console.log(balanceEquation("MgO+H2O->Mg(OH)2"));
console.log(balanceEquation("Al+H2SO4->Al2(SO4)3+3H2"));
// console.log(balanceEquation("C7H16+O2->CO2+H2O"));
// console.log(balanceEquation("Pb->Au"));
