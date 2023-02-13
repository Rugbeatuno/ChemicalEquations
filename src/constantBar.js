import { roundToDecimalPlaces, roundToSigFigs } from "./utils.js";

let constantRoundingDecimal = 2;
let constantRoundingSigfigs = 3;
let constantUsingSigfigs = true;
let answerRoundingDecimal = 2;
let answerRoundingSigfigs = 3;
let answerUsingSigfigs = true;

const createSlider = (label, range, callback) => {
  // rounding sliders
  let sliderSetting = document.createElement("div");
  sliderSetting.className = "sliderContainer";

  let sliderLabel = document.createElement("label");
  sliderLabel.className = "sliderLabel";
  sliderLabel.innerHTML = `${label} ${range[2]}`;
  sliderSetting.appendChild(sliderLabel);

  let slider = document.createElement("input");
  slider.className = "slider";
  slider.type = "range";
  slider.min = range[0];
  slider.max = range[1];
  slider.value = range[2];
  sliderSetting.appendChild(slider);
  slider.addEventListener("input", () => {
    sliderLabel.innerHTML = `${label} ${slider.value}`;
    callback(slider.value);
  });

  return sliderSetting;
};

const createMenu = (label, options, callback) => {
  // rounding sliders
  let sliderSetting = document.createElement("div");
  sliderSetting.className = "sliderContainer";

  let sliderLabel = document.createElement("label");
  sliderLabel.className = "sliderLabel";
  sliderLabel.innerHTML = label;
  sliderSetting.appendChild(sliderLabel);

  let slider = document.createElement("select");
  slider.className = "menu";

  for (let i of options) {
    let option = document.createElement("option");
    option.className = "option";
    option.text = i;
    option.value = i;
    slider.appendChild(option);
  }

  sliderSetting.appendChild(slider);
  slider.addEventListener("input", () => {
    callback(slider.value);
  });

  return sliderSetting;
};

export const initBar = (callbackOnUpdate) => {
  let bar = document.createElement("div");
  bar.className = "constants";
  document.body.appendChild(bar);

  bar.appendChild(
    createMenu(
      "Rounding Constants:",
      ["Significant Figures", "Decimal Places"],
      (val) => {
        if (val === "Significant Figures") {
          constantUsingSigfigs = true;
        } else {
          constantUsingSigfigs = false;
        }
        callbackOnUpdate();
      }
    )
  );
  bar.appendChild(
    createSlider("Decimal Places:", [0, 10, 2], (val) => {
      constantRoundingDecimal = val;
      callbackOnUpdate();
    })
  );
  bar.appendChild(
    createSlider("Significant Figures:", [0, 10, 3], (val) => {
      constantRoundingSigfigs = val;
      callbackOnUpdate();
    })
  );

  bar.appendChild(
    createMenu(
      "Rounding Answers:",
      ["Significant Figures", "Decimal Places"],
      (val) => {
        if (val === "Significant Figures") {
          answerUsingSigfigs = true;
        } else {
          answerUsingSigfigs = false;
        }
        callbackOnUpdate();
      }
    )
  );
  bar.appendChild(
    createSlider("Decimal Places:", [0, 10, 2], (val) => {
      answerRoundingDecimal = val;
      callbackOnUpdate();
    })
  );
  bar.appendChild(
    createSlider("Significant Figures:", [0, 10, 3], (val) => {
      answerRoundingSigfigs = val;
      callbackOnUpdate();
    })
  );
};

export const roundConstant = (num) => {
  if (constantUsingSigfigs) {
    return roundToSigFigs(num.toString(), constantRoundingSigfigs);
  }
  return roundToDecimalPlaces(num.toString(), constantRoundingDecimal);
};

export const roundAnswer = (num) => {
  if (answerUsingSigfigs) {
    return roundToSigFigs(num.toString(), answerRoundingSigfigs);
  }
  return roundToDecimalPlaces(num.toString(), answerRoundingDecimal);
};
