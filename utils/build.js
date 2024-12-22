// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";
process.env.ASSET_PATH = "/";

var webpack = require("webpack"),
  config = require("../webpack.config");

// get relevant args
const arg = process.argv.slice(2);

if (arg.includes("--watch")) {
  config.watch = true;
}

webpack(config, function (err, rest) {
  if (err) throw err;
  const date = new Date();

  console.clear();
  console.log("---------------------------------------");

  if (rest?.compilation?.warnings.length) {
    console.log("warnings:", rest.compilation.warnings);
  }

  if (rest?.compilation?.errors.length) {
    console.log("warnings:", rest.compilation.errors);
  }

  console.log("\tBuilding", config.watch ? " --watch" : "");
  console.log(`\t${date.toLocaleString()}`);
  console.log("---------------------------------------");
});
