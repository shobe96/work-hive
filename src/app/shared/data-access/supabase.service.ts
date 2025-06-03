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
  async getAll(table: string): Promise<any[]> {
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

  /*Ana TODO: 
    email i password da se proslede iz forme
  */
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('error', error);
      return error;
    } else {
      console.log('data', data.user);
      return data;
    }
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
  async signUpNewUser(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          email_verified: true, // this becomes user_metadata.email_verified
        },
      },
    });
    if (error) {
      console.log('error', error);
      return error;
    } else {
      console.log('data', data.user);
      // Call signIn with same credentials
      await this.signIn(email, password);
      return data;
    }
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
