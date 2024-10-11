import path from "node:path";

// Builders
import * as sass from "sass";

// Official Eleventy plugins
import { EleventyRenderPlugin } from "@11ty/eleventy";

export const assets = (eleventyConfig, userOptions = {}) => {
  // https://github.com/11ty/eleventy-plugin-bundle#bundle-sass-with-the-render-plugin
  // https://www.11ty.dev/docs/languages/custom/#example-add-sass-support-to-eleventy
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addBundle("css");
  eleventyConfig.addTemplateFormats("scss");

  // https://www.11ty.dev/docs/languages/custom/#example-add-sass-support-to-eleventy
  // TODO: add sourcemap generation, see https://github.com/sass/dart-sass/issues/1594#issuecomment-1013208452
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    useLayouts: false,
    compile: async function (inputContent, inputPath) {
      console.log(`
Content of file "${inputPath}":
-------------------------------------------------------------
`);
      console.dir(inputContent);
      console.log(`
-------------------------------------------------------------
`);
      if (!inputContent) return;

      const parsed = path.parse(inputPath);
      let sassResult;

      try {
        sassResult = sass.compileString(inputContent, {
          loadPaths: [parsed.dir || ".", "src/assets/sass", "node_modules"],
          style: "expanded",
          sourceMap: false,
        });
      } catch (error) {
        console.error("☠️☠️☠️ Error! ☠️☠️☠️");
        console.dir(error);
      }

      this.addDependencies(inputPath, sassResult.loadedUrls);

      return async (data) => {
        return sassResult.css;
      };
    },
    compileOptions: {
      permalink: (contents, inputPath) => {
        // Don't convert Sass files with filenames starting with a '_'
        // https://www.11ty.dev/docs/languages/custom/#compileoptions.permalink-to-override-permalink-compilation
        let parsed = path.parse(inputPath);
        if (parsed.name.startsWith("_")) {
          return false;
        }
      },
    },
  });
};
