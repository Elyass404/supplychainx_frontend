import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, Sidebar,Header],
  templateUrl: './app-layout.html',
  styles: ``,
})
export class AppLayout {

}
