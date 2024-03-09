const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-ts");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const dotenv = require('dotenv');
const Dotenv = require('dotenv-webpack');

module.exports = (webpackConfigEnv, argv) => {
  const orgName = "holi-link";
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: "root-config",
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
  });
  let envFile = './src/env/.env';
  console.log("Applications:" + envFile);
  if (process.env.CUSTOM_ENV && (process.env.CUSTOM_ENV == "true" || process.env.CUSTOM_ENV == true)) {
    console.log("ENTRE !!!");
    envFile = `${envFile}.${process.env.ENV}`;
  }
  dotenv.config({ path: envFile });
  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        template: "src/index.ejs",
        templateParameters: {
          json: `{
            "imports": {
              "@holi-link/root-config": "http://localhost:9000/holi-link-root-config.js",
              "@holi-link/root-config/": "http://localhost:9000/",
              "single-spa": "https://cdn.jsdelivr.net/npm/single-spa@5.9.1/lib/system/single-spa.min.js",
              "@angular/core": "https://cdn.jsdelivr.net/npm/@esm-bundle/angular__core@11.1.1/system/es2015/ivy/angular-core.min.js",
              "@angular/common": "https://cdn.jsdelivr.net/npm/@esm-bundle/angular__common@11.1.1/system/es2015/ivy/angular-common.min.js",
              "@angular/router": "https://cdn.jsdelivr.net/npm/@esm-bundle/angular__router@11.1.1/system/es2015/ivy/angular-router.min.js",
              "@angular/platform-browser": "https://cdn.jsdelivr.net/npm/@esm-bundle/angular__platform-browser@11.1.1/system/es2015/ivy/angular-platform-browser.min.js",
              "rxjs": "https://cdn.jsdelivr.net/npm/@esm-bundle/rxjs@6.6.3-fix.0/system/es2015/rxjs.min.js",
              "rxjs/operators": "https://cdn.jsdelivr.net/npm/@esm-bundle/rxjs@6.6.3-fix.0/system/es2015/rxjs-operators.min.js",
              "@holi-link/main-mf": "https://localhost:4200/main.js",
              "@holi-link/main-mf/": "http://localhost:4200/",
              "process.env.KEYCLOAK_INSTANCE": "${process.env.KEYCLOAK_INSTANCE}",
            }
          }`,
          isLocal: webpackConfigEnv && webpackConfigEnv.isLocal,
          orgName,
        },
        favicon: "src/favicon.ico",
      }),
      new CopyPlugin({
        patterns: [
          {
            from: "src/env/assets/",
            to: "./env/assets",
          }
        ],
      }),
    ],
  });
};