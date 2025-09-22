import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../shared/data-access/supabase.service';
import { AuthService } from '../shared/services/auth.service';
import { Employee } from './employee.model';
import { FormsModule } from '@angular/forms';

// Type alias to represent a new employee payload (excluding auto-generated fields)
type NewEmployee = Omit<Employee, 'id' | 'created_at'>;

@Component({
  selector: 'app-employees',
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesComponent implements OnInit {
  // Signals to hold employees list, search query, loading state, and errors
  employees = signal<Employee[]>([]);
  searchQuery = signal('');
  loading = signal(true);
  error = signal<string | null>(null);

  /**
   * Computed signal to filter employees by:
   * - Active status
   * - Matching designation or employee code against search query
   */
  filteredEmployees = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const employees = this.employees();

    // Filter out inactive employees
    const activeEmployees = employees.filter((emp) => emp.status === 'active');

    if (!query) return activeEmployees;

    // Filter by designation or employee code (case-insensitive)
    return activeEmployees.filter(
      (emp) =>
        emp.designation.toLowerCase().includes(query) ||
        emp.employee_code.toLowerCase().includes(query)
    );
  });

  // Inject services
  private authService = inject(AuthService);
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  async ngOnInit() {
    // Check user authentication before loading data
    const currentUser = await this.authService.getCurrentUser();
    if (!currentUser || !(await this.authService.isAuthenticated())) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      // Fetch employees from the Supabase DB
      const employees = await this.supabaseService.getAll<Employee>(
        'employees'
      );
      this.employees.set(employees);
    } catch (err: unknown) {
      // Set error signal on failure
      this.error.set(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      // Always stop loading indicator
      this.loading.set(false);
    }

    // Trigger change detection manually (OnPush strategy safety)
    this.cdr.markForCheck();
  }

  /**
   * Soft deletes an employee by setting their status to "inactive"
   * Optionally, cascade deletes attendance records from the DB.
   */
  async deleteEmployee(id: number) {
    const confirmed = confirm('Are you sure you want to delete this employee?');
    if (!confirmed) return;

    // soft delete - Instead of actually deleting the row from the database, add a status column (e.g., "active" | "inactive") and update it
    await this.supabaseService.update('employees', id, { status: 'inactive' });

    // Update local signal state to reflect the change in the UI
    this.employees.update((emps) =>
      emps.map((emp) => (emp.id === id ? { ...emp, status: 'inactive' } : emp))
    );

    // If you're certain the attendance records can be deleted (e.g. in testing), you can delete them first
    // await this.supabaseService.deleteByFilter('attendance', { employee_id: id });
    // await this.supabaseService.delete('employees', id);

    //     set up on delete cascade in db schema
    //     ALTER TABLE attendance
    // DROP CONSTRAINT attendance_employee_id_fkey;

    // ALTER TABLE attendance
    // ADD CONSTRAINT attendance_employee_id_fkey
    // FOREIGN KEY (employee_id)
    // REFERENCES employees(id)
    // ON DELETE CASCADE;
  }

  /**
   * Updates an employee's data — hardcoded for now (could be tied to a modal).
   */
  async editEmployee(employee: Employee) {
    const updatedData = {
      ...employee,
      designation: 'Updated Hire',
      salary: 60000,
      employment_type: 'Contract',
    };

    try {
      const result = await this.supabaseService.update<Employee>(
        'employees',
        employee.id,
        updatedData
      );

      if (result) {
        // Update signal state to reflect the change in the UI
        this.employees.update((emps) =>
          emps.map((emp) => (emp.id === employee.id ? result : emp))
        );
      }
    } catch (err: unknown) {
      this.error.set(
        err instanceof Error ? err.message : 'Failed to update employee'
      );
    }
  }

  /**
   * Creates a new employee with default values
   * (In real apps, this would be tied to a form or modal input)
   */
  async addEmployee() {
    // const newEmployee: NewEmployee = {
    //   employee_code: 'EMP_NEW',
    //   date_of_joining: new Date().toISOString().split('T')[0],
    //   designation: 'New Hire',
    //   employment_type: 'Full-time',
    //   salary: 50000,
    //   department_id: 1,
    //   status: 'active',
    //   user_uuid: '431a2cef-75ea-47c2-b3ee-b7ba7dae4852',
    // };
    const newEmployee: NewEmployee = {
      employee_code: 'EMP_' + Date.now(), // or use a UUID or similar
      date_of_joining: new Date().toISOString().split('T')[0],
      designation: 'New Hire',
      employment_type: 'Full-time',
      salary: 50000,
      department_id: 1,
      status: 'active',
      user_uuid: '431a2cef-75ea-47c2-b3ee-b7ba7dae4852', // Replace with dynamic UUID in real usage
    };

    try {
      const created = await this.supabaseService.create(
        'employees',
        newEmployee
      );
      if (created) {
        this.employees.update((emps) => [...emps, created as Employee]);
      }
    } catch (err: unknown) {
      this.error.set(
        err instanceof Error ? err.message : 'Failed to add employee'
      );
    }
  }

  /**
   * Updates the search query signal.
   * Bound to input in the UI.
   */
  setSearchQuery(query: string) {
    this.searchQuery.set(query);
  }

  /**
   * Logs the user out and redirects to homepage.
   */
  logout() {
    this.authService.signOut();
    this.router.navigate(['/']);
  }
}
