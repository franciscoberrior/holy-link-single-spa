export interface AppAndTenantConfig {
  valid: boolean;
  app: string;
  tenant: string;
  client: string;
}

export const HolyLinkHefzibah = { app: "HOLYLINK", client: "holy-link-client" };

export const HEFZIBAH = "hefzibah";

export const TENANTS = [HEFZIBAH];
export const APP = [HolyLinkHefzibah];
