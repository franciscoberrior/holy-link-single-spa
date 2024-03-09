import { doLogin, doInit, REGEX, keycloakConfig, keycloakInitOptions } from "./auth";
import buildApplications from "./applications";
import { getTenant } from "./tenant-config";
import { AppAndTenantConfig } from "./models/tenant/tenant-info";
import { BehaviorSubject } from "rxjs";
import { BreadCrumb } from "./models/bread-crumb/bread-crumb";
import Keycloak from "keycloak-js";

async function initSingleSpa() {
  sessionStorage.setItem("counter-auth-error", "0");
  const path = window.location.pathname;
  debugger;
  const appAndTenantInfo = getTenant(path);
  console.log("Path:" + path);
  console.log("Tenant:" + appAndTenantInfo);
  const exclude = REGEX(appAndTenantInfo.app?.toLowerCase(), appAndTenantInfo.tenant).some((r) => new RegExp(r, "gm").test(path));
  const auth = !!appAndTenantInfo.client ? await doInit(keycloakConfig(appAndTenantInfo.client, appAndTenantInfo.tenant), keycloakInitOptions) : ({} as Keycloak);

  if (!auth.authenticated && !exclude && appAndTenantInfo.valid) {
    await doLogin(auth);
  }
 // redirect(appAndTenantInfo, path);

  const custom = {
    auth: auth,
    excludeAuthentication: exclude,
    appAndTenantInfo,
    breadCrumbs: new BehaviorSubject<BreadCrumb[]>([]),
  };
  buildApplications(custom);
}

initSingleSpa();

function redirect(appAndtenant: AppAndTenantConfig, path: string) {
  console.log("Path:" + path);
  console.log("Tenant:" + appAndtenant);
  console.log(new RegExp(`^\/${appAndtenant.app}\/${appAndtenant.tenant}$`).test(path));
  if (new RegExp(`^\/${appAndtenant.app}\/${appAndtenant.tenant}$`).test(path)) {
    window.location.href = `/${appAndtenant.app}\/${appAndtenant.tenant}/home`;
  }
}
