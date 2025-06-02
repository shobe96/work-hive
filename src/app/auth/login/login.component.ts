import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';
  fullName = '';
  phone = '';
  rememberMe = false;
  errorMessage = '';
  isSignup = false;

  constructor(private authService: AuthService, private router: Router) {
    this.checkRememberedUser();
  }

  async loginOrSignup() {
    try {
      if (this.isSignup) {
        const result = await this.authService.signUp(
          this.email,
          this.password,
          this.fullName,
          this.phone
        );
        console.log('Signup successful', result);
        if (this.rememberMe) this.rememberUser(result.user);
        this.router.navigate(['/home']);
      } else {
        const result = await this.authService.signIn(
          this.email,
          this.password
        );
        console.log('Login successful', result);
        if (this.rememberMe) this.rememberUser(result.user);
        this.router.navigate(['/home']);
      }
    } catch (error: any) {
      this.errorMessage =
        error.message || (this.isSignup ? 'Signup failed' : 'Login failed');
    }
  }

  toggleMode() {
    this.isSignup = !this.isSignup;
    this.errorMessage = '';
  }

  rememberUser(user: any) {
    localStorage.setItem('rememberedUser', JSON.stringify(user));
  }

  checkRememberedUser() {
    const savedUser = localStorage.getItem('rememberedUser');
    if (savedUser) {
      console.log('Auto-logging in from remember me');
      // You could navigate directly or load session here
      this.router.navigate(['/home']);
    }
  }
}
