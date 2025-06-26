import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../supabase.client';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  private readonly schemaName = 'work_hive';

  // Get all records from a table
  async getAll<T>(table: string): Promise<T[]> {
    const { data, error } = await this.supabase
      .schema(this.schemaName)
      .from(table)
      .select('*');

    if (error) {
      console.error('Error in getAll:', error?.message);
      return [];
    } else {
      return data || [];
    }
  }

  // Create a new record
  async create<T>(table: string, itemData: T): Promise<T | null> {
    const { data, error } = await this.supabase
      .schema(this.schemaName)
      .from(table)
      .insert([itemData])
      .select()
      .single()
      .overrideTypes<T>();

    if (error) {
      console.error('Error creating record:', error.message);
      return null;
    }
    return data as T;
  }

  // Update an existing record by ID
  async update<T>(
    table: string,
    id: number,
    updateData: Partial<T>
  ): Promise<T | null> {
    const { data, error } = await this.supabase
      .schema(this.schemaName)
      .from(table)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
      .overrideTypes<T>();

    if (error) {
      console.error('Error updating record:', error.message);
      return null;
    }
    return data as T;
  }

  // Delete a record by ID
  async delete<T>(table: string, employeeId: number): Promise<T | null> {
    const { data, error } = await this.supabase
      .schema(this.schemaName)
      .from(table)
      .delete()
      .eq('id', employeeId)
      .select()
      .single()
      .overrideTypes<T>();

    if (error) {
      console.error('Error deleting record:', error.message);
      return null;
    }
    return data as T;
  }

  async signIn(email: string, password: string) {
    const result = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    return result;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    console.log(error);
  }

  async signUp(email: string, password: string) {
    const response = await this.supabase.auth.signUp({
      email,
      password,
    });

    return response;
  }

  async getSession() {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    return data?.session;
  }

  async getAllByParams<T>(table: string, params: object): Promise<T[]> {
    const paramsString = Object.entries(params)
      .map(([key, value]) => `${key}.eq.${value}`)
      .join(',');

    const { data, error } = await this.supabase
      .schema(this.schemaName)
      .from(table)
      .select('*')
      .or(paramsString);

    if (error) {
      console.error('Error in getAll:', error?.message);
      return [];
    } else {
      return data || [];
    }
  }
}
