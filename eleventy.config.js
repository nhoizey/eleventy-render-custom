import { assets } from "./src/_11ty/assets.js";

export default async function (eleventyConfig) {
  eleventyConfig.addPlugin(assets);

  eleventyConfig.addGlobalData("eleventyComputed.permalink", () => {
    return (data) => {
      // console.log(data.page);

      if (data.permalink !== undefined && data.permalink !== "") {
        // A permalink has been set in the content Front Matter
        return data.permalink;
      }

      if (["css", "js"].includes(data.page.outputFileExtension)) {
        return data.permalink;
      }

      return (
        data.page.filePathStem
          .replace(/^\/(pages|collections)/, "")
          .replace(/\/index$/, "") + "/index.html"
      );
    };
  });
}

export const config = {
  templateFormats: ["md", "njk"],

  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",

  dir: {
    input: "src",
  },
};
