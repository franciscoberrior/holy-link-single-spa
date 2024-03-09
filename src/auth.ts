import Keycloak, { KeycloakConfig, KeycloakInitOptions } from "keycloak-js";
import { HEFZIBAH } from "./models/tenant/tenant-info";

export const doLogin = async (keycloak: Keycloak): Promise<any> => {
  return new Promise((resolve) => {
    keycloak
      .login()
      .then(function (auth) {
        resolve("logged");
      })
      .catch((ex) => {
        const errors = parseInt(sessionStorage.getItem("counter-auth-error"));
        sessionStorage.setItem("counter-auth-error", "" + (errors + 1));
        if (errors <= 2) {
          location.reload();
        }
        throw "Keycloak Login Failed";
      });
  });
};

export const doInit = async (
  config: KeycloakConfig,
  options: KeycloakInitOptions
): Promise<Keycloak> => {
  return new Promise((resolve) => {
    const keycloak = new Keycloak(config);
    keycloak
      .init(options)
      .then(function (auth) {
        resolve(keycloak);
      })
      .catch((ex) => {
        const errors = parseInt(sessionStorage.getItem("counter-auth-error"));
        sessionStorage.setItem("counter-auth-error", "" + (errors + 1));
        if (errors <= 2) {
          location.reload();
        }
        throw "Keycloak Init Failed";
      });
  });
};
export const keycloakInitOptions: KeycloakInitOptions = {
  onLoad: "check-sso",
  checkLoginIframe: false,
};

export const REGEX = (app: string, tenant: string) => {
  return [
    `\/choose-app\/?(.)*`,
    `\/${app}\\/choose-app\/?(.)*`,
    `\/${app}\/${tenant}\/suite-header\/request-reset-password\/?(.)*`,
    `\/${app}\/${tenant}\/requests\/special-requests(\/?)(.)*`,
  ];
};

export const keycloakConfig = (clientId, tenant): KeycloakConfig => {
  const url = "http://localhost:8080/";
  switch (tenant) {
    case HEFZIBAH:
      return {
        url,
        realm: "hefzibah",
        clientId,
      };
  }
};
