import { Component } from '@angular/core';
import { AuthConfig, OAuthService, NullValidationHandler } from 'angular-oauth2-oidc';
import { SupplierService } from './supplier.service'; // 🟢 Import Service
import { Supplier } from './supplier.model';         // 🟢 Import Model

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [], // No modules needed for new @if syntax
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
  // 🟢 Variable to show success/error message in HTML
  apiResponse = '';

  constructor(
    private oauthService: OAuthService,
    private supplierService: SupplierService // 🟢 Inject SupplierService
  ) {
    this.configureAuth();
  }

  configureAuth() {
    const authConfig: AuthConfig = {
      issuer: 'http://localhost:8081/realms/supplychain-realm',
      clientId: 'supplychain-frontend',
      redirectUri: window.location.origin,
      scope: 'openid profile email',
      responseType: 'code',
      requireHttps: false,
      showDebugInformation: true,
    };

    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new NullValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  login() {
    this.oauthService.initCodeFlow();
  }

  logout() {
    this.oauthService.logOut();
  }

  get isLoggedIn() {
    return this.oauthService.hasValidAccessToken();
  }

  get username() {
    const claims = this.oauthService.getIdentityClaims();
    return claims ? (claims as any)['preferred_username'] : null;
  }

  //The function to create the supplier
  createTestSupplier() {
    // iam making an object so i can test the creation of the supplier (without form)
    const newSupplier: Supplier = {
      name: "tech  supplier",
      email: "ccontact@techsupplier.com",
      rating: 10.00,
      leadTime: 15
    };

    // 
    this.supplierService.createSupplier(newSupplier).subscribe({
      next: (response) => {
        console.log('Success:', response);
        // Show success message with the new ID
        this.apiResponse = '✅ Supplier Created! ID: ' + response.id;
      },
      error: (err) => {
        console.error('Error:', err);
        // Show detailed error message
        this.apiResponse = '❌ Error: ' + err.status + ' (' + err.statusText + ')';
      }
    });
  }
}