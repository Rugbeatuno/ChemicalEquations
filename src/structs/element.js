import { symbolToData, initElementData } from "../elements";

export default class Element {
  constructor(partialEq) {
    partialEq = partialEq.replace(" ", "");
    partialEq = partialEq.replace("+", "");
    this.data = symbolToData.get(partialEq);
  }

  isMetal() {
    return this.data["category"].includes(" metal");
  }
  isNonmetal() {
    return this.data["category"].includes(" nonmetal");
  }

  isHalide() {
    return ["F", "Cl", "Br", "I", "At"].includes(this.data["symbol"]);
  }

  isActiveMetal() {
    return ["Li", "Na", "K", "Rb", "Cs", "Ca", "Sr", "Ba"].includes(
      this.data["symbol"]
    );
  }
  getSymbol() {
    return this.data["symbol"];
  }
  getCharge(partialEq) {}
}

initElementData();
