import {
  symbolToData,
  initElementData,
  polyatomicIons,
  acids,
} from "../elements";
import { findIonsAcidsElements } from "../nomenclature";

class Compound {
  constructor(partialEq) {
    partialEq = partialEq.replace(" ", "");
    this.elements = [];
    this.partialEq = partialEq;
  }

  parse(partialEq) {
    this.elements = findIonsAcidsElements(partialEq);
  }

  isPolyatomicIon() {
    return polyatomicIons.has(this.partialEq);
  }
  isAcid() {
    return acids.has(this.partialEq);
  }

  hasPolyatomicIon() {
    for (let i of polyatomicIons.keys()) {
      if (this.partialEq.includes(i)) {
        return true;
      }
    }
    return false;
  }
  hasAcid() {
    for (let i of acids.keys()) {
      if (this.partialEq.includes(i)) {
        return true;
      }
    }
    return false;
  }

  hasMetal() {
    for (let i of this.elements) {
      if (i.isMetal()) {
        return true;
      }
    }
    return false;
  }
  hasNonmetal() {
    for (let i of this.elements) {
      if (i.isNonmetal()) {
        return true;
      }
    }
    return false;
  }

  //   isWater() {
  //     if (this.elements.size !== 2) {
  //       return false;
  //     }
  //     if (this.elements.has(symbolToData.get("H"))) {
  //       let hydrogens = elements.get(symbolToData.get("H"));
  //       if (elements.has(symbolToData.get("O"))) {
  //         let oxygens = elements.get(symbolToData.get("O"));
  //         if (oxygens * 2 === hydrogens) {
  //           return true;
  //         }
  //       }
  //     }
  //     return false;
  //   }

  //   isHalide() {
  //     return ["F", "Cl", "Br", "I", "At"].includes(this.data["symbol"]);
  //   }

  //   isActiveMetal() {
  //     return ["Li", "Na", "K", "Rb", "Cs", "Ca", "Sr", "Ba"].includes(
  //       this.data["symbol"]
  //     );
  //   }
  getCharge(partialEq) {}
}

initElementData();
