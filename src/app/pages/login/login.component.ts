import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly router = inject(Router);

  loginObj: any = {
    userName: signal(''),
    password: signal(''),
  };

  handleLogin() {
    sessionStorage.setItem('access-token', 'abc');
    this.router.navigate(['/dashboard']);
  }
}
