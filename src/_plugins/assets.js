import path from "node:path";
import fs from "node:fs";

// Builders
import * as sass from "sass";

// Official Eleventy plugins
import { EleventyRenderPlugin } from "@11ty/eleventy";

export const assets = (eleventyConfig, userOptions = {}) => {
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    useLayouts: false,
    compile: async function (inputContent, inputPath) {
      console.log("##########################################");
      console.log(`File: ${inputPath}`);
      console.log("File content from renderFile (inputContent):");
      console.dir(inputContent);

      const fileContent = fs.readFileSync(inputPath, "utf-8");
      console.log("");
      console.log("File content from fs.readFileSync:");
      console.dir(fileContent);

      if (undefined === inputContent) return;

      // Only convert Sass files from the Sass assets folder
      if (!inputPath.includes("src/assets/sass")) return;

      const parsed = path.parse(inputPath);
      let sassResult;

      try {
        sassResult = sass.compileString(inputContent, {
          loadPaths: [parsed.dir || ".", "src/assets/sass", "node_modules"],
          style: "expanded",
          sourceMap: false,
        });
      } catch (error) {
        console.error("☠☠☠ Error! ☠☠☠");
        console.dir(error);
      }

      this.addDependencies(inputPath, sassResult.loadedUrls);

      return async (data) => sassResult.css;
    },
    compileOptions: {
      permalink: (contents, inputPath) => {
        let parsed = path.parse(inputPath);
        if (parsed.name.startsWith("_")) {
          return false;
        }
      },
    },
  });
};
