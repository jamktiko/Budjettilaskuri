import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor(private authService: AuthService) {}

  testConnection() {
    this.authService.testConnection();
  }
}
