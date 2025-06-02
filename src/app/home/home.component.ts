import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';
import { EmployeeService } from '../shared/services/employee.service';
import { Router } from '@angular/router';

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

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      this.employees = await this.employeeService.getEmployees();
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
