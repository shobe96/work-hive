import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  async getEmployees() {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        designation,
        user:users (
          full_name,
          email
        )
      `);

    if (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }

    return data;
  }
}
