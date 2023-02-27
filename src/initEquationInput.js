const init = () => {
  // <input type="text" class="equationInput" placeholder="Type Equation CaCO3+HCl->CaCl2+H2O+CO2">

  let container = document.createElement("div");
  container.className = "equationContainer";

  let reactants = document.createElement("input");
  reactants.type = "input";
  reactants.className = "equationInput";
  reactants.id = "reactants";
  reactants.placeholder = "Reactants: CaCl2 + K2CO3";
  container.appendChild(reactants);

  let arrow = document.createElement("span");
  arrow.innerHTML = "→";
  container.appendChild(arrow);

  let products = document.createElement("input");
  products.type = "input";
  products.className = "equationInput";
  products.id = "products";
  products.placeholder = "Products: CaCO3 + KCl";
  container.appendChild(products);

  document.body.appendChild(container);
};

init();
