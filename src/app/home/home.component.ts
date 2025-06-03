import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { SupabaseService } from '../shared/data-access/supabase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  employees: any[] = [];
  loading = true;
  error: string | null = null;

  private authService = inject(AuthService);
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  async ngOnInit() {
    const currentUser = await this.authService.getCurrentUser();
    if (currentUser) {
      console.log('current user:', currentUser);
    }

    const isLoggedIn = await this.authService.isAuthenticated();

    if (isLoggedIn) {
      console.log('User is logged in');
    } else {
      this.router.navigate(['/login']);
    }

    try {
      this.employees = await this.supabaseService.getAll('employees');
      console.log('employees', this.employees);
    } catch (err: any) {
      this.error = err.message || 'Failed to load employees';
    } finally {
      this.loading = false;
    }
  }

  logout() {
    this.authService.signOut();
    this.router.navigate(['/']);
  }
}
