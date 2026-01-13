import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.html',

})
export class Login {
  private authService = inject(AuthService)

  login() {
    this.authService.login();
  }

}
