import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // 🟢 Import RouterOutlet so the HTML tag works
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
}