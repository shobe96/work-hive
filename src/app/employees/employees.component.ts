import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../shared/data-access/supabase.service';
import { AuthService } from '../shared/services/auth.service';
import { Employee } from './employee.model';
import { FormsModule } from '@angular/forms';

type NewEmployee = Omit<Employee, 'id' | 'created_at'>;

@Component({
  selector: 'app-employees',
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss',
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  loading = true;
  error: string | null = null;

  searchQuery = '';
  filteredEmployees: Employee[] = [];

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
      return;
    }

    try {
      this.employees = await this.supabaseService.getAll('employees');
      console.log('employees', this.employees);
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.error = err.message;
      } else {
        this.error = 'Unknown error';
      }
    } finally {
      this.loading = false; // ✅ Ensure loading is turned off
    }

    this.employees = await this.supabaseService.getAll('employees');
    this.filteredEmployees = [...this.employees];
  }

  async deleteEmployee(id: number) {
    const confirmed = confirm('Are you sure you want to delete this employee?');
    if (!confirmed) return;

    try {
      await this.supabaseService.delete('employees', id);
      this.employees = this.employees.filter((emp) => emp.id !== id);
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.error = err.message;
      } else {
        this.error = 'Failed to delete employee';
      }
    }
  }

  async editEmployee(employee: Employee) {
    const updatedData = {
      ...employee,
      designation: 'Updated Hire',
      salary: 60000,
      employment_type: 'Contract',
    };
    console.log('updatedData: ', updatedData);
    try {
      const result = await this.supabaseService.update<Employee>(
        'employees',
        employee.id,
        updatedData
      );

      if (result) {
        //call retrieve again
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.error = err.message;
      } else {
        this.error = 'Failed to update employee';
      }
    }
  }

  async addEmployee() {
    const newEmployee: NewEmployee = {
      employee_code: 'EMP_NEW',
      date_of_joining: new Date().toISOString().split('T')[0], // today yyyy-mm-dd
      designation: 'New Hire',
      employment_type: 'Full-time',
      salary: 50000,
      department_id: 1,
      status: 'active',
      user_uuid: '431a2cef-75ea-47c2-b3ee-b7ba7dae4852',
    };

    try {
      const createdEmployees = await this.supabaseService.create(
        'employees',
        newEmployee
      );
      if (createdEmployees) {
        this.employees.push(newEmployee as Employee);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.error = err.message;
      } else {
        this.error = 'Failed to add employee';
      }
    }
  }

  filterEmployees() {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      this.filteredEmployees = [...this.employees];
      return;
    }

    this.filteredEmployees = this.employees.filter(
      (emp) =>
        emp.designation.toLowerCase().includes(query) ||
        emp.employee_code.toLowerCase().includes(query)
    );
  }

  logout() {
    this.authService.signOut();
    this.router.navigate(['/']);
  }
}
