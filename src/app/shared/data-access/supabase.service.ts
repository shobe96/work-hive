import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../supabase.client';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  /*Ana TODO: 
    'work_hive' schema da postane globalna promenjiva
    napravi from() argument da bude dinamicki
  */
  async getAll() {
    const { data, error } = await this.supabase
      .schema('work_hive')
      .from('roles')
      .select('*');
    if (error) {
      console.log('error', error);
      return error;
    } else {
      console.log('data', data);
      return data;
    }
  }

  async signIn() {
    /*Ana TODO: 
    email i password da se proslede iz forme
  */
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: 'test2@gmail.com',
      password: 'test2test2',
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

  async signUpNewUser() {
    /*Ana TODO: 
    email mora da postoji za kreiranje user-a, na email stize potvrda, 
    link koji se pritsne vodi na localhost:4200,
    proveri da li potvda mail adrese moze da se preskoci
  */
    const { data, error } = await this.supabase.auth.signUp({
      email: 'test2@gmail.com',
      password: 'test2test2',
    });
    if (error) {
      console.log('error', error);
      return error;
    } else {
      console.log('data', data.user);
      this.signIn();
      return data;
    }
  }
}
