import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../data-access/supabase.service';
import { Employee } from 'src/app/employees/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private supabaseService = inject(SupabaseService);
  private table = 'employees';

  async getEmployees() {
    const data = await this.supabaseService.getAll<Employee>(this.table);
    return data;
  }

  async createEmployee(employee: Employee) {
    const data = await this.supabaseService.create<Employee>(
      this.table,
      employee
    );
    return data;
  }

  async updateEmployee(employee: Employee) {
    if (employee.id) {
      const data = await this.supabaseService.update<Employee>(
        this.table,
        employee.id,
        employee
      );
      return data;
    } else {
      return null;
    }
  }

  async deleteEmployee(employee: Employee) {
    if (employee.id) {
      const data = await this.supabaseService.delete<Employee>(
        this.table,
        employee.id
      );
      return data;
    } else {
      return null;
    }
  }

  async getAllByParams(employee: Employee) {
    if (employee) {
      const data = await this.supabaseService.getAllByParams<Employee>(
        this.table,
        employee
      );
      return data;
    } else {
      return null;
    }
  }
}
