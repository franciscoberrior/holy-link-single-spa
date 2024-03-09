import { AppAndTenantConfig, TENANTS, APP } from "./models/tenant/tenant-info";

export const hasValidAppAndTenantStructure = (path: string): boolean => {
  return APP.some((app) =>
    TENANTS.some((tenant) => {
      const appAndTenantRegex = `/${app.app.toLowerCase()}/${tenant}(\/.*)?`;
      return new RegExp(appAndTenantRegex, "gm").test(path);
    })
  );
};

export const hasValidAppStructure = (path: string): boolean => {
  return APP.some((app) => {
    const appAndTenantRegex = `/${app.app.toLowerCase()}/choose-tenant(\/.*)?`;
    return new RegExp(appAndTenantRegex, "gm").test(path);
  });
};

export const getTenant = (path: string): AppAndTenantConfig => {
  console.log("Get Tenant Path:" + path);
  const pathsAvailable: string[] = ["choose-app", "choose-tenant"];
  const pathSegments: string[] = path.split("/");
  if (!hasValidAppAndTenantStructure(path)) {
    if (!hasValidAppStructure(path)) {
      if (!pathsAvailable.some((p) => pathSegments.includes(p))) {
        window.location.href = "/choose-app";
      }
    }
    return { valid: false, app: null, tenant: null, client: null };
  }

  const tenant = pathSegments.find((p) => p !== "" && TENANTS.includes(p));
  const appSegment = pathSegments.find((p) => p !== "" && APP.some((a) => a.app.toLowerCase() === p.toLowerCase()));
  const { app, client } = APP.find((a) => a.app.toLowerCase() === appSegment?.toLowerCase()) || {};

  return { valid: Boolean(tenant && app && client), app, tenant, client };
};
