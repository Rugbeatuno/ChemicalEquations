export const init = (label) => {
  // <input type="text" class="equationInput" placeholder="Type Equation CaCO3+HCl->CaCl2+H2O+CO2">

  let container = document.createElement("div");
  container.className = "equationContainer";

  let reactants = document.createElement("input");
  reactants.type = "input";
  reactants.className = "equationInput";
  reactants.id = "reactants";
  reactants.placeholder = label;
  container.appendChild(reactants);

  document.body.appendChild(container);
};
