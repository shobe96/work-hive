import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../supabase.client';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  private readonly schemaName = 'work_hive';

  /*Ana TODO: 
    'work_hive' schema da postane globalna promenjiva
    napravi from() argument da bude dinamicki
  */
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
      console.log('data', data?.[0]?.user);
      return data || [];
    }
  }

  // Create a new record
  async create<T>(table: string, itemData: T): Promise<T[] | null> {
    const { data, error } = await this.supabase
      .schema(this.schemaName)
      .from(table)
      .insert([itemData])
      .select();

    if (error) {
      console.error('Error creating record:', error.message);
      return null;
    }
    return data as T[];
  }

  // Update an existing record by ID
  async update<T>(
    table: string,
    id: string,
    updateData: Partial<T>
  ): Promise<T[] | null> {
    const { data, error } = await this.supabase
      .schema(this.schemaName)
      .from(table)
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating record:', error.message);
      return null;
    }
    return data as T[];
  }

  // Delete a record by ID
  async delete<T>(table: string, employeeId: string): Promise<T[] | null> {
    const { data, error } = await this.supabase
      .schema(this.schemaName)
      .from(table)
      .delete()
      .eq('id', employeeId)
      .select();

    if (error) {
      console.error('Error deleting record:', error.message);
      return null;
    }
    return data as T[];
  }

  /*Ana TODO: 
    email i password da se proslede iz forme
  */
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

  /*Ana TODO: 
    email mora da postoji za kreiranje user-a, na email stize potvrda, 
    link koji se pritsne vodi na localhost:4200,
    proveri da li potvda mail adrese moze da se preskoci
  */
  async signUp(email: string, password: string) {
    const response = await this.supabase.auth.signUp({
      email,
      password,
      // options: {
      //   data: {
      //     email_verified: true, // this becomes user_metadata.email_verified
      //   },
      // },
    });

    return response;
  }

  async getSession() {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    console.log('session:', data?.session);
    return data?.session;
  }
}
