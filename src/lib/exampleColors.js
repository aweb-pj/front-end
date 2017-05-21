function percentageToHsl (percentage, hue0, hue1) {
  let hue = (percentage * (hue1 - hue0)) + hue0
  return 'hsl(' + hue + ', 100%, 50%)'
}

let exampleColors = []
for (let i = 0; i < 30; i++) {
  exampleColors.push(percentageToHsl(i / 30, 0, 120))
}

export default exampleColors
