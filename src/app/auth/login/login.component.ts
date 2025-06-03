import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/shared/data-access/supabase.service';

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

  /*Ana TODO: 
  koristi inject metodu za inject-ovanje dependency-ja umesto konstruktora
 */
  private authService = inject(AuthService);
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  constructor() {
    this.checkRememberedUser();
  }

  /*Ana TODO: 
   napraviti posebnu formu za signup/registraciju
   pozivas authService.signIn()
 */
  async loginOrSignup() {
    if (this.isSignup) {
      // ✅ Call the signUp method from AuthService
      const result: any = await this.authService.signUp(
        this.email,
        this.password,
        this.fullName,
        this.phone
      );

      if (result.error) {
        this.errorMessage = result.error.message || 'Signup failed';
      } else {
        this.errorMessage = '';
        // Optionally log the user in after signup
        await this.authService.signIn(this.email, this.password);
        this.router.navigate(['/home']);
      }
    } else {
      // Login flow
      const result: any = await this.authService.signIn(
        this.email,
        this.password
      );

      if (result.error) {
        this.errorMessage = result.error.message || 'Login failed';
      } else {
        this.errorMessage = '';
        if (this.rememberMe && result.user) {
          this.rememberUser(result.user);
        }
        this.router.navigate(['/home']);
      }
    }
  }

  toggleMode() {
    this.isSignup = !this.isSignup;
    this.errorMessage = '';
  }

  rememberUser(user: any) {
    localStorage.setItem('rememberedUser', JSON.stringify(user));
  }

  async checkRememberedUser() {
    const savedUser = localStorage.getItem('rememberedUser');
    if (savedUser) {
      const session = await this.authService.getSession();
      if (session && session.user) {
        console.log('Restoring session for remembered user');
        this.router.navigate(['/home']);
      } else {
        localStorage.removeItem('rememberedUser'); // session expired
      }
    }
  }
}
