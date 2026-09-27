const yaml = require("js-yaml");

module.exports = function (eleventyConfig) {
  // Content lives in src/_data/*.yaml; Eleventy only reads JSON/JS data out of the box.
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Copied as is: src/css -> _site/css, and so on.
  for (const path of ["css", "assets", "js", "CNAME"]) {
    eleventyConfig.addPassthroughCopy(`src/${path}`);
  }

  return { dir: { input: "src", output: "_site" } };
};
