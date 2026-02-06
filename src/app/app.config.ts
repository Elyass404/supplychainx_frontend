import { ApplicationConfig, importProvidersFrom, APP_INITIALIZER, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AuthService } from './core/auth/auth';
import { CustomerEffects } from './features/delivery/store/customer.effects';

//  NgRx Imports
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { customerReducer } from './features/delivery/store/customer.reducer';

// this function triggers the login check
function initializeApp(authService: AuthService): () => Promise<void> {
  return () => authService.runInitialLoginSequence();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: ['http://localhost:8080/api'],
        sendAccessToken: true
      }
    })),

    // Register the Store (Reducer)
    provideStore({
      customer: customerReducer
    }),

    // Register Effects (Currently empty, we will fill this in Block 3)
    provideEffects([CustomerEffects]),

    // Enable DevTools (Great for debugging in Chrome)
    provideStoreDevtools({
      maxAge: 25, 
      logOnly: !isDevMode()
    }),

    // PROVIDER: Auth Initializer
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService],
      multi: true
    }
  ]
};