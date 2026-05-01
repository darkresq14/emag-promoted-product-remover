const { Resvg } = require("@resvg/resvg-js");
const fs = require("fs");
const path = require("path");

const svgPath = path.resolve(__dirname, "../public/icon/shield.svg");
const iconDir = path.resolve(__dirname, "../public/icon");
const svg = fs.readFileSync(svgPath);

[16, 32, 48, 96, 128].forEach((size) => {
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: size } });
  const png = resvg.render().asPng();
  fs.writeFileSync(path.join(iconDir, `${size}.png`), png);
  console.log(`${size}.png created`);
});
