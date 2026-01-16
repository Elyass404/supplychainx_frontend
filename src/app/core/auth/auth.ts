import { Injectable, signal } from '@angular/core';
import { AuthConfig, OAuthService, NullValidationHandler } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated = signal<boolean>(false);
  username = signal<string>('');

  constructor(private oauthService: OAuthService) {
    this.configure();
  }

  private configure() {
    const authConfig: AuthConfig = {
      issuer: 'http://localhost:8081/realms/supplychain-realm',
      clientId: 'supplychain-frontend',
      redirectUri: window.location.origin,
      scope: 'openid profile email offline_access',
      responseType: 'code',
      requireHttps: false,
      showDebugInformation: true,
      clearHashAfterLogin: true
    };

    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new NullValidationHandler();
    this.oauthService.setupAutomaticSilentRefresh();
  }

  // This must return a Promise so Angular can wait for it
  public runInitialLoginSequence(): Promise<void> {
    return this.oauthService.loadDiscoveryDocumentAndTryLogin()
      .then(() => {
        if (this.oauthService.hasValidAccessToken()) {
          console.log('Login Sequence Complete: User is logged in');
          this.updateState();
        } else {
          console.log('ℹ️ Login Sequence Complete: User is Guest');
          this.isAuthenticated.set(false);
          this.username.set('');
        }
      })
      .catch(err => {
        console.error("Login failed", err);
        this.isAuthenticated.set(false);
      });
  }

  public login() {
    this.oauthService.initCodeFlow();
  }

  public logout() {
    this.oauthService.logOut();
    this.isAuthenticated.set(false);
    this.username.set('');
  }

  private updateState() {
    this.isAuthenticated.set(this.oauthService.hasValidAccessToken());
    const claims = this.oauthService.getIdentityClaims();
    if (claims) {
      this.username.set((claims as any)['preferred_username']);
    }
  }
}