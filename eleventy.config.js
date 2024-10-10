import { assets } from "./src/_plugins/assets.js";

export default async function (eleventyConfig) {
  eleventyConfig.addPlugin(assets);
  eleventyConfig.addBundle("css");
}

export const config = {
  templateFormats: ["md", "njk"],

  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",

  dir: {
    input: "src",
  },
};
