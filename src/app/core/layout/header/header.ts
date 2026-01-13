import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth';

@Component({
  selector: 'app-header',
  imports: [],
  standalone: true, 
  templateUrl: './header.html',
  styles: ``,
})
export class Header {

public authService = inject(AuthService)

}
