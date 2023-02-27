export const LITERS_AT_STP = 22.4;
export const PREFIXES = [
  "mono",
  "di",
  "tri",
  "tetra",
  "penta",
  "hexa",
  "hepta",
  "octa",
  "nona",
  "deca",
];

export const VOWELS = ["a", "o", "i", "u", "e", "y"];
export const COMMON_POSITIVE_IONS = new Map();
COMMON_POSITIVE_IONS.set("Ni", 2);
COMMON_POSITIVE_IONS.set("Zn", 2);
COMMON_POSITIVE_IONS.set("Al", 3);
COMMON_POSITIVE_IONS.set("Ag", 1);
COMMON_POSITIVE_IONS.set("Cd", 2);

export const MULTIVALENT_METALS = new Map([
  ["Fe", [2, 3]],
  ["Co", [2, 3]],
  ["Cr", [2, 3]],
  ["Hg", [1, 2]],
  ["Cu", [1, 2]],
  ["Pb", [2, 4]],
  ["Sn", [2, 4]],
  ["Mn", [2, 4]],
  ["Pt", [2, 4]],
  ["Au", [1, 3]],
]);

export const GROUP_CHARGES = new Map();
GROUP_CHARGES.set(1, 1);
GROUP_CHARGES.set(2, 2);
GROUP_CHARGES.set(13, 3);
GROUP_CHARGES.set(15, -3);
GROUP_CHARGES.set(16, -2);
GROUP_CHARGES.set(17, -1);

export const ROMAN_NUMERALS = ["(I)", "(II)", "(III)", "(IV)", "(V)"];
