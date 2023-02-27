import {
  compareElementCounts,
  countElements,
  resolveCompounds,
} from "./utilities/runner.js";
import { solve } from "./linearSolve.js";
import { roundToDecimalPlaces } from "../utils.js";
import { ROMAN_NUMERALS } from "../constants.js";

export const balanceEquation = (equation) => {
  const equationParts = equation.split("->");

  const reactants = equationParts[0];
  const products = equationParts[1];

  const reactantsParts = reactants.split("+");
  const productParts = products.split("+");

  const reactantsCompounds = [];
  const productCompounds = [];

  // take the resolvables and resolve them into their arrays
  resolveCompounds(reactantsParts, reactantsCompounds);
  resolveCompounds(productParts, productCompounds);

  const mergedCompounds = reactantsCompounds.concat(productCompounds);

  const startTime = new Date().getTime();

  // first create a matrix with each row being a linear algebra equation
  // of the number of times an element occurs in each compound
  const matrix = [];
  const elements = countElements(mergedCompounds);

  // convert element map to an array
  const elementArray = Array.from(elements.keys());

  for (const element of elementArray) {
    const row = [];

    for (const compound of reactantsCompounds) {
      row.push(countElements([compound]).get(element) || 0);
    }

    for (const compound of productCompounds) {
      row.push((countElements([compound]).get(element) || 0) * -1);
    }

    // replace the last array element with its inverse
    row[row.length - 1] *= -1;

    matrix.push(row);
  }

  // take the last element out of each matrix row and add it to a vector
  const vector = [];

  for (const row of matrix) {
    vector.push(row.pop());
  }

  // solve the matrix
  let solution = solve(matrix, vector);

  // add 1 because we are solving for a relationship (coefficients of compounds)
  solution.push(1);

  // make sure everything is at least one
  const multiplier = 1 / Math.min(...solution.filter((n) => n !== 0));
  solution = solution.map((n) => n * multiplier);

  // multiply by two until there are no fractions
  while (solution.some((n) => n % 1 !== 0)) {
    solution = solution.map((n) => Math.round(n * 2));
  }

  if (solution.length > mergedCompounds.length) {
    solution.splice(solution.length - 2, 1);
  }
  // divide by two until everything is fully divised
  // corner case [9007199254740991, 18014398509481980, 9007199254740990, 9007199254740990, 1, 9007199254740992]

  if (Math.max(...solution) > 1000) {
    solution = solution.filter((e) => e != 1);

    let list = [];
    for (let i of solution) {
      list.push(i / Math.max(...solution));
    }
    while (Math.min(...list) < 1) {
      for (let i = 0; i < list.length; i++) {
        list[i] = list[i] * 2;
      }
    }
    for (let i = 0; i < list.length; i++) {
      list[i] = Number.parseInt(roundToDecimalPlaces(list[i], 0));
    }
    solution = list;
  }
  let newSolution = [];
  for (let i of solution) {
    if (i !== 0) {
      newSolution.push(i);
    }
  }
  solution = newSolution;

  console.log(solution);
  while (solution.every((n) => n % 2 === 0)) {
    solution = solution.map((n) => Math.round(n / 2));
  }
  // console.log(solution, mergedCompounds);
  // set the coefficients of the compounds to the solution
  for (let i = 0; i < solution.length; i++) {
    if (i >= mergedCompounds.length) {
      continue;
    }
    mergedCompounds[i].setCoefficent(solution[i]);
  }

  const { balance } = compareElementCounts(
    countElements(reactantsCompounds),
    countElements(productCompounds)
  );
  if (balance === 1 || balance === 0.5) {
    // if (balance === 1) {
    // console.log(`Success! (took ${new Date().getTime() - startTime}ms)`);

    // recreate the equation
    const equation =
      reactantsCompounds
        .map((compound) => compound.getEquationString())
        .join("+") +
      "->" +
      productCompounds
        .map((compound) => compound.getEquationString())
        .join("+");
    // console.log(equation);
    return equation;
  } else {
    console.log(
      `Failed to find a solution. (took ${new Date().getTime() - startTime}ms)`,
      "\nTry increasing the max coefficient, or the equation might not be solvable.\n"
    );
    console.log(equation);
    return null;
  }
};

// console.log(balanceEquation("Na2O+H2O->NaOH"));
// balanceEquation("CaO+H2O->Ca(OH)2");
// balanceEquation("CaCO3+HCl->CaCl2+H2O+CO2");
// balanceEquation("2H2 + O2 -> 2H2O");
// balanceEquation("2H2 + O2 -> 2H2O+Cl");
// balanceEquation("Al+Fe(NO3)2->Al(NO3)3+Fe");
