import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../data-access/supabase.service';

@Injectable({ providedIn: 'root' })
export class EmployeeService {

  private supabaseService = inject(SupabaseService);

  // async getEmployees() {
  //   const supabase = this.supabaseService['supabase']; // Access internal client

  //   const { data, error } = await supabase
  //     .schema('work_hive') // Match SupabaseService's use of schema
  //     .from('employees')
  //     .select(`
  //       designation,
  //       user:users (
  //         full_name,
  //         email
  //       )
  //     `);

  //   if (error) {
  //     console.error('Error fetching employees:', error);
  //     throw error;
  //   }

  //   return data;
  // }

  async getEmployees() {
    const data = await this.supabaseService.getAll('employees');
    // Optionally, filter or transform `data` here if needed
    return data;
  }
}
