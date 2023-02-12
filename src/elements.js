export const symbolToData = new Map();

export const initElementData = () => {
  // elements
  fetch("../assets/elements.json")
    .then((Response) => Response.json())
    .then((data) => {
      let elements = data.elements;
      for (let e of elements) {
        symbolToData.set(e.symbol, e);
      }
    });

  // polyatomic ions
  fetch("../assets/polyatomic_ions.json")
    .then((Response) => Response.json())
    .then((data) => {
      let elements = data.ions;
      for (let e of elements) {
        symbolToData.set(e.symbol, e);
      }
    });
};
