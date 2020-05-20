"use strict";

const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const resolve = require("resolve");
const PnpWebpackPlugin = require("pnp-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const safePostCssParser = require("postcss-safe-parser");
const ManifestPlugin = require("webpack-manifest-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const WatchMissingNodeModulesPlugin = require("react-dev-utils/WatchMissingNodeModulesPlugin");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");
const paths = require("./paths");
const modules = require("./modules");
const getClientEnvironment = require("./env");
const ModuleNotFoundPlugin = require("react-dev-utils/ModuleNotFoundPlugin");
const ForkTsCheckerWebpackPlugin = require("react-dev-utils/ForkTsCheckerWebpackPlugin");
const typescriptFormatter = require("react-dev-utils/typescriptFormatter");

const postcssNormalize = require("postcss-normalize");

const appPackageJson = require(paths.appPackageJson);

//source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";
//some apps do not need the benefits of saving a web request, so not inlining the chunk
//makes for a smoother build process.
const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== "false";

const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || "10000");

//check if TypeScript is setup
const useTypeScript = fs.existsSync(paths.appTsConfig);

//style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

//this is the production and development configuration.
//it is focused on developer experience, fast rebuilds, and a minimal bundle.
module.exports = function(webpackEnv) {
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";

  //variable used for enabling profiling in Production
  //passed into alias object. Uses a flag if passed into the build command
  const isEnvProductionProfile =
    isEnvProduction && process.argv.includes("--profile");

  //we will provide `paths.publicUrlOrPath` to our app
  //as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
  //omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
  //get environment variables to inject into our app.
  const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

  //common function to get style loaders
  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      isEnvDevelopment && require.resolve("style-loader"),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
        //css is located in `static/css`, use '../../' to locate index.html folder
        //in production `paths.publicUrlOrPath` can be a relative path
        options: paths.publicUrlOrPath.startsWith(".")
          ? { publicPath: "../../" }
          : {},
      },
      {
        loader: require.resolve("css-loader"),
        options: cssOptions,
      },
      {
        //options for PostCSS as we reference these options twice
        //adds vendor prefixing based on your specified browser support in
        //package.json
        loader: require.resolve("postcss-loader"),
        options: {
          //necessary for external CSS imports to work
          //https://github.com/facebook/create-react-app/issues/2677
          ident: "postcss",
          plugins: () => {
            return [
              require("postcss-flexbugs-fixes"),
              require("postcss-preset-env")({
                autoprefixer: {
                  flexbox: "no-2009",
                },
                stage: 3,
              }),
              //adds PostCSS Normalize as the reset css with default options,
              //so that it honors browserslist config in package.json
              //which in turn let's users customize the target behavior as per their needs.
              postcssNormalize(),
            ];
          },
          sourceMap: isEnvProduction && shouldUseSourceMap,
        },
      },
    ].filter(Boolean);
    if (preProcessor) {
      loaders.push({
        loader: require.resolve("resolve-url-loader"),
        options: {
          sourceMap: isEnvProduction && shouldUseSourceMap,
        },
      },
      {
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: true,
        },
      });
    }
    return loaders;
  };

  return {
    mode: isEnvProduction ? "production" : isEnvDevelopment && "development",
    //stop compilation early in production
    bail: isEnvProduction,
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? "source-map"
        : false
      : isEnvDevelopment && "cheap-module-source-map",
    //these are the "entry points" to our application.
    //this means they will be the "root" imports that are included in JS bundle.
    entry: [
      //include an alternative client for WebpackDevServer. A client's job is to
      //connect to WebpackDevServer by a socket and get notified about changes.
      //when you save a file, the client will either apply hot updates (in case
      //of CSS changes), or refresh the page (in case of JS changes). When you
      //make a syntax error, this client will display a syntax error overlay.
      //note: instead of the default WebpackDevServer client, we use a custom one
      //to bring better experience for Create React App users. You can replace
      //the line below with these two lines if you prefer the stock client:
      //require.resolve('webpack-dev-server/client') + '?/',
      //require.resolve('webpack/hot/dev-server'),
      isEnvDevelopment &&
        require.resolve("react-dev-utils/webpackHotDevClient"),
      //finally, this is your app's code:
      paths.appIndexJs,
      //we include the app code last so that if there is a runtime error during
      //initialization, it doesn't blow up the WebpackDevServer client, and
      //changing JS code would still trigger a refresh.
    ].filter(Boolean),
    output: {
      //the build folder.
      path: isEnvProduction ? paths.appBuild : undefined,
      //add /* filename */ comments to generated require()s in the output.
      pathinfo: isEnvDevelopment,
      //there will be one main bundle, and one file per asynchronous chunk.
      //in development, it does not produce real files.
      filename: isEnvProduction
        ? "static/js/[name].[contenthash:8].js"
        : isEnvDevelopment && "static/js/bundle.js",
      //tODO: remove this when upgrading to webpack 5
      futureEmitAssets: true,
      //there are also additional JS chunk files if you use code splitting.
      chunkFilename: isEnvProduction
        ? "static/js/[name].[contenthash:8].chunk.js"
        : isEnvDevelopment && "static/js/[name].chunk.js",
      //webpack uses `publicPath` to determine where the app is being served from.
      //it requires a trailing slash, or the file assets will get an incorrect path.
      //we inferred the "public path" (such as / or /my-project) from homepage.
      publicPath: paths.publicUrlOrPath,
      //point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: isEnvProduction
        ? (info) => {
          return path
            .relative(paths.appSrc, info.absoluteResourcePath)
            .replace(/\\/g, "/");
        }
        : isEnvDevelopment &&
          ((info) => {
            return path.resolve(info.absoluteResourcePath).replace(/\\/g, "/");
          }),
      //prevents conflicts when multiple webpack runtimes (from different apps)
      //are used on the same page.
      jsonpFunction: `webpackJsonp${appPackageJson.name}`,
      //this defaults to 'window', but by setting it to 'this' then
      //module chunks which are built will work in web workers as well.
      globalObject: "this",
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        //this is only used in production mode
        new TerserPlugin({
          terserOptions: {
            parse: {
              //we want terser to parse ecma 8 code. However, we don't want it
              //to apply any minification steps that turns valid ecma 5 code
              //into invalid ecma 5 code. This is why the 'compress' and 'output'
              //sections only apply transformations that are ecma 5 safe
              //https://github.com/facebook/create-react-app/pull/4234
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              //disabled because of an issue with Uglify breaking seemingly valid code:
              //https://github.com/facebook/create-react-app/issues/2376
              //pending further investigation:
              //https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
              //disabled because of an issue with Terser breaking valid code:
              //https://github.com/facebook/create-react-app/issues/5250
              //pending further investigation:
              //https://github.com/terser-js/terser/issues/120
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            //added for profiling in devtools
            keep_classnames: isEnvProductionProfile,
            keep_fnames: isEnvProductionProfile,
            output: {
              ecma: 5,
              comments: false,
              //turned on because emoji and regex is not minified properly using default
              //https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
          },
          sourceMap: shouldUseSourceMap,
        }),
        //this is only used in production mode
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: shouldUseSourceMap
              ? {
                //`inline: false` forces the sourcemap to be output into a
                //separate file
                inline: false,
                //`annotation: true` appends the sourceMappingURL to the end of
                //the css file, helping the browser find the sourcemap
                annotation: true,
              }
              : false,
          },
          cssProcessorPluginOptions: {
            preset: ["default", { minifyFontValues: { removeQuotes: false } }],
          },
        }),
      ],
      //automatically split vendor and commons
      //https://twitter.com/wSokra/status/969633336732905474
      //https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
      splitChunks: {
        chunks: "all",
        name: false,
      },
      //keep the runtime chunk separated to enable long term caching
      //https://twitter.com/wSokra/status/969679223278505985
      //https://github.com/facebook/create-react-app/issues/5358
      runtimeChunk: {
        name: (entrypoint) => {
          return `runtime-${entrypoint.name}`;
        },
      },
    },
    resolve: {
      //this allows you to set a fallback for where webpack should look for modules.
      //we placed these paths second because we want `node_modules` to "win"
      //if there are any conflicts. This matches Node resolution mechanism.
      //https://github.com/facebook/create-react-app/issues/253
      modules: ["node_modules", paths.appNodeModules].concat(modules.additionalModulePaths || []),
      //these are the reasonable defaults supported by the Node ecosystem.
      //we also include JSX as a common component filename extension to support
      //some tools, although we do not recommend using it, see:
      //https://github.com/facebook/create-react-app/issues/290
      //`web` extension prefixes have been added for better support
      //for React Native Web.
      extensions: paths.moduleFileExtensions
        .map((ext) => {
          return `.${ext}`;
        })
        .filter((ext) => {
          return useTypeScript || !ext.includes("ts");
        }),
      alias: {
        //support React Native Web
        //https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
        "react-native": "react-native-web",
        //allows for better profiling with ReactDevTools
        ...isEnvProductionProfile && {
          "react-dom$": "react-dom/profiling",
          "scheduler/tracing": "scheduler/tracing-profiling",
        },
        ...modules.webpackAliases || {},
      },
      plugins: [
        //adds support for installing with Plug'n'Play, leading to faster installs and adding
        //guards against forgotten dependencies and such.
        PnpWebpackPlugin,
        //prevents users from importing files from outside of src/ (or node_modules/).
        //this often causes confusion because we only process files within src/ with babel.
        //to fix this, we prevent you from importing files out of src/ -- if you'd like to,
        //please link the files into your node_modules/ and let module-resolution kick in.
        //make sure your source files are compiled, as they will not be processed in any way.
        new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
      ],
    },
    resolveLoader: {
      plugins: [
        //also related to Plug'n'Play, but this time it tells webpack to load its loaders
        //from the current package.
        PnpWebpackPlugin.moduleLoader(module),
      ],
    },
    module: {
      strictExportPresence: true,
      rules: [
        //disable require.ensure as it's not a standard language feature.
        { parser: { requireEnsure: false } },

        //first, run the linter.
        //it's important to do this before Babel processes the JS.
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          enforce: "pre",
          use: [
            {
              options: {
                cache: true,
                formatter: require.resolve("react-dev-utils/eslintFormatter"),
                eslintPath: require.resolve("eslint"),
                resolvePluginsRelativeTo: __dirname,
                emitWarning: true,
                configFile: ".eslintrc.json",

              },
              loader: require.resolve("eslint-loader"),
            },
          ],
          include: paths.appSrc,
        },
        {
          //"oneOf" will traverse all following loaders until one will
          //match the requirements. When no loader matches it will fall
          //back to the "file" loader at the end of the loader list.
          oneOf: [
            //"url" loader works like "file" loader except that it embeds assets
            //smaller than specified limit in bytes as data URLs to avoid requests.
            //a missing `test` is equivalent to a match.
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve("url-loader"),
              options: {
                limit: imageInlineSizeLimit,
                name: "static/media/[name].[hash:8].[ext]",
              },
            },
            //process application JS with Babel.
            //the preset includes JSX, Flow, TypeScript, and some ESnext features.
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: paths.appSrc,
              loader: require.resolve("babel-loader"),
              options: {
                customize: require.resolve("babel-preset-react-app/webpack-overrides"),

                plugins: [
                  [
                    require.resolve("babel-plugin-named-asset-import"),
                    {
                      loaderMap: {
                        svg: {
                          ReactComponent:
                            "@svgr/webpack?-svgo,+titleProp,+ref![path]",
                        },
                      },
                    },
                  ],
                ],
                //this is a feature of `babel-loader` for webpack (not Babel itself).
                //it enables caching results in ./node_modules/.cache/babel-loader/
                //directory for faster rebuilds.
                cacheDirectory: true,
                //see #6846 for context on why cacheCompression is disabled
                cacheCompression: false,
                compact: isEnvProduction,
              },
            },
            //process any JS outside of the app with Babel.
            //unlike the application JS, we only compile the standard ES features.
            {
              test: /\.(js|mjs)$/,
              exclude: /@babel(?:\/|\\{1,2})runtime/,
              loader: require.resolve("babel-loader"),
              options: {
                babelrc: false,
                configFile: false,
                compact: false,
                presets: [[require.resolve("babel-preset-react-app/dependencies"), { helpers: true }]],
                cacheDirectory: true,
                //see #6846 for context on why cacheCompression is disabled
                cacheCompression: false,

                //babel sourcemaps are needed for debugging into node_modules
                //code.  Without the options below, debuggers like VSCode
                //show incorrect code and set breakpoints on the wrong lines.
                sourceMaps: shouldUseSourceMap,
                inputSourceMap: shouldUseSourceMap,
              },
            },
            //"postcss" loader applies autoprefixer to our CSS.
            //"css" loader resolves paths in CSS and adds assets as dependencies.
            //"style" loader turns CSS into JS modules that inject <style> tags.
            //in production, we use MiniCSSExtractPlugin to extract that CSS
            //to a file, but in development "style" loader enables hot editing
            //of CSS.
            //by default we support CSS Modules with the extension .module.css
            {
              test: cssRegex,
              exclude: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: isEnvProduction && shouldUseSourceMap,
              }),
              //don't consider CSS imports dead code even if the
              //containing package claims to have no side effects.
              //remove this when webpack adds a warning or an error for this.
              //see https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },
            //adds support for CSS Modules (https://github.com/css-modules/css-modules)
            //using the extension .module.css
            {
              test: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: isEnvProduction && shouldUseSourceMap,
                modules: {
                  getLocalIdent: getCSSModuleLocalIdent,
                },
              }),
            },
            //opt-in support for SASS (using .scss or .sass extensions).
            //by default we support SASS Modules with the
            //extensions .module.scss or .module.sass
            {
              test: sassRegex,
              exclude: sassModuleRegex,
              use: getStyleLoaders({
                importLoaders: 3,
                sourceMap: isEnvProduction && shouldUseSourceMap,
              },
              "sass-loader"),
              //don't consider CSS imports dead code even if the
              //containing package claims to have no side effects.
              //remove this when webpack adds a warning or an error for this.
              //see https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },
            //adds support for CSS Modules, but using SASS
            //using the extension .module.scss or .module.sass
            {
              test: sassModuleRegex,
              use: getStyleLoaders({
                importLoaders: 3,
                sourceMap: isEnvProduction && shouldUseSourceMap,
                modules: {
                  getLocalIdent: getCSSModuleLocalIdent,
                },
              },
              "sass-loader"),
            },
            //"file" loader makes sure those assets get served by WebpackDevServer.
            //when you `import` an asset, you get its (virtual) filename.
            //in production, they would get copied to the `build` folder.
            //this loader doesn't use a "test" so it will catch all modules
            //that fall through the other loaders.
            {
              loader: require.resolve("file-loader"),
              //exclude `js` files to keep "css" loader working as it injects
              //its runtime that would otherwise be processed through "file" loader.
              //also exclude `html` and `json` extensions so they get processed
              //by webpacks internal loaders.
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                name: "static/media/[name].[hash:8].[ext]",
              },
            },
            //** sTOP ** Are you adding a new loader?
            //make sure to add the new loader(s) before the "file" loader.
          ],
        },
      ],
    },
    plugins: [
      //generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin(Object.assign({},
        {
          inject: true,
          template: paths.appHtml,
        },
        isEnvProduction
          ? {
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          }
          : undefined)),
      //inlines the webpack runtime script. This script is too small to warrant
      //a network request.
      //https://github.com/facebook/create-react-app/issues/5358
      isEnvProduction &&
        shouldInlineRuntimeChunk &&
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
      //makes some environment variables available in index.html.
      //the public URL is available as %PUBLIC_URL% in index.html, e.g.:
      //<link rel="icon" href="%PUBLIC_URL%/favicon.ico">
      //it will be an empty string unless you specify "homepage"
      //in `package.json`, in which case it will be the pathname of that URL.
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
      //this gives some necessary context to module not found errors, such as
      //the requesting resource.
      new ModuleNotFoundPlugin(paths.appPath),
      //makes some environment variables available to the JS code, for example:
      //if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
      //it is absolutely essential that NODE_ENV is set to production
      //during a production build.
      //otherwise React will be compiled in the very slow development mode.
      new webpack.DefinePlugin(env.stringified),
      //this is necessary to emit hot updates (currently CSS only):
      isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
      //watcher doesn't work well if you mistype casing in a path so we use
      //a plugin that prints an error when you attempt to do this.
      //see https://github.com/facebook/create-react-app/issues/240
      isEnvDevelopment && new CaseSensitivePathsPlugin(),
      //if you require a missing module and then `npm install` it, you still have
      //to restart the development server for webpack to discover it. This plugin
      //makes the discovery automatic so you don't have to restart.
      //see https://github.com/facebook/create-react-app/issues/186
      isEnvDevelopment &&
        new WatchMissingNodeModulesPlugin(paths.appNodeModules),
      isEnvProduction &&
        new MiniCssExtractPlugin({
          //options similar to the same options in webpackOptions.output
          //both options are optional
          filename: "static/css/[name].[contenthash:8].css",
          chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
        }),
      //generate an asset manifest file with the following content:
      //- "files" key: Mapping of all asset filenames to their corresponding
      //output file so that tools can pick it up without having to parse
      //`index.html`
      //- "entrypoints" key: Array of files which are included in `index.html`,
      //can be used to reconstruct the HTML if necessary
      new ManifestPlugin({
        fileName: "asset-manifest.json",
        publicPath: paths.publicUrlOrPath,
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path;
            return manifest;
          }, seed);
          const entrypointFiles = entrypoints.main.filter((fileName) => {
            return !fileName.endsWith(".map");
          });

          return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
          };
        },
      }),
      //moment.js is an extremely popular library that bundles large locale files
      //by default due to how webpack interprets its code. This is a practical
      //solution that requires the user to opt into importing specific locales.
      //https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      //you can remove this if you don't use Moment.js:
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      //generate a service worker script that will precache, and keep up to date,
      //the HTML & assets that are part of the webpack build.
      isEnvProduction &&
        new WorkboxWebpackPlugin.GenerateSW({
          clientsClaim: true,
          exclude: [/\.map$/, /asset-manifest\.json$/],
          importWorkboxFrom: "cdn",
          navigateFallback: paths.publicUrlOrPath + "index.html",
          navigateFallbackBlacklist: [
            //exclude URLs starting with /_, as they're likely an API call
            new RegExp("^/_"),
            //exclude any URLs whose last part seems to be a file extension
            //as they're likely a resource and not a SPA route.
            //uRLs containing a "?" character won't be blacklisted as they're likely
            //a route with query params (e.g. auth callbacks).
            new RegExp("/[^/?]+\\.[^/]+$"),
          ],
        }),
      //typeScript type checking
      useTypeScript &&
        new ForkTsCheckerWebpackPlugin({
          typescript: resolve.sync("typescript", {
            basedir: paths.appNodeModules,
          }),
          async: isEnvDevelopment,
          useTypescriptIncrementalApi: true,
          checkSyntacticErrors: true,
          resolveModuleNameModule: process.versions.pnp
            ? `${__dirname}/pnpTs.js`
            : undefined,
          resolveTypeReferenceDirectiveModule: process.versions.pnp
            ? `${__dirname}/pnpTs.js`
            : undefined,
          tsconfig: paths.appTsConfig,
          reportFiles: ["**", "!**/__tests__/**", "!**/?(*.)(spec|test).*", "!**/src/setupProxy.*", "!**/src/setupTests.*"],
          silent: true,
          //the formatter is invoked directly in WebpackDevServerUtils during development
          formatter: isEnvProduction ? typescriptFormatter : undefined,
        }),
    ].filter(Boolean),
    //some libraries import Node modules but don't use them in the browser.
    //tell webpack to provide empty mocks for them so importing them works.
    node: {
      module: "empty",
      dgram: "empty",
      dns: "mock",
      fs: "empty",
      http2: "empty",
      net: "empty",
      tls: "empty",
      child_process: "empty",
    },
    //turn off performance processing because we utilize
    //our own hints via the FileSizeReporter
    performance: false,
  };
};
