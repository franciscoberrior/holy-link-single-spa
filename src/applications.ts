import { registerApplication, start } from "single-spa";
import {
  constructRoutes,
  constructApplications,
  constructLayoutEngine,
} from "single-spa-layout";

import microfrontendLayout from "./microfrontend-layout.html";

export default function buildApplications(props :any) {
  const routes = constructRoutes(microfrontendLayout);
  
  const applications = constructApplications({
    routes,
    loadApp({ name }) {
      return System.import(name);
    },
  });

  applications.map(function (app) {
    app.customProps = props;
    return app;
  });

  console.log("Applications:" + applications.toString);
  const layoutEngine = constructLayoutEngine({ routes, applications });
  applications.forEach(registerApplication);
  layoutEngine.activate();
  start();

}
