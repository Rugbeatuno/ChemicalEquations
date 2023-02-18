import {
  compareElementCounts,
  countElements,
  resolveCompounds,
} from "./utilities/runner.js";
import { solve } from "./linearSolve.js";

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

  // divide by two until everything is fully divised
  while (solution.every((n) => n % 2 === 0)) {
    solution = solution.map((n) => Math.round(n / 2));
  }

  console.log(solution, mergedCompounds);
  let newSolution = [];
  for (let i of solution) {
    if (i !== 0) {
      newSolution.push(i);
    }
  }
  solution = newSolution;
  // set the coefficients of the compounds to the solution
  for (let i = 0; i < solution.length; i++) {
    mergedCompounds[i].setCoefficent(solution[i]);
  }

  const { balance } = compareElementCounts(
    countElements(reactantsCompounds),
    countElements(productCompounds)
  );

  if (balance === 1) {
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
  }
};

// balanceEquation("CaO+H2O->Ca(OH)2");
// balanceEquation("2H2 + O2 -> 2H2O");
