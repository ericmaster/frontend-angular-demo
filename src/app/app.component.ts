import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BankHeaderComponent } from './bank-header/bank-header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BankHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend-angular';
}
