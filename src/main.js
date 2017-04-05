import { OAuthService, OAuthTokenService } from 'aurelia-oauth';
 import { HttpClient } from 'aurelia-http-client';

import environment from './environment';
import authConf from './authConf';
import {AuthService} from 'aurelia-oauth';


export function configure(aurelia) {
    const httpClient = aurelia.container.get(HttpClient);
    

    aurelia.use
      .standardConfiguration()
      .plugin('aurelia-bootstrap', config => config.options.version = 4)
      .plugin('aurelia-oauth', (oauthService, oauthTokenService, configureClient) =>
          configureOauth(oauthService, oauthTokenService, configureClient, httpClient))
      .feature('resources');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

function configureOauth(oauthService: OAuthService, oauthTokenService: OAuthTokenService, configureClient: (client: any) => void, client: any) {
  oauthService.configure(
    {
      loginUrl: 'https://accounts.google.com/o/oauth2/auth',
      logoutUrl: 'https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout',
      clientId: '338047852356-2g5scdacgocut2dei6nna6o1pvsudmlp.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/userinfo.profile',
      // alwaysRequireLogin: true,
      logoutRedirectParameterName: 'continue',
      redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host
    });

  oauthTokenService.configure(
    {
      name: 'token id_token',
      urlTokenParameters: {
        idToken: 'id_token'
      }
    });

  configureClient(client);
}

  aurelia.start().then(() => aurelia.setRoot());
}
