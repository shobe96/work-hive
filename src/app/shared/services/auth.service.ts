import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  async signIn(email: string, password: string) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new Error('User not found');
    }

    if (user.password !== password) {
      throw new Error('Invalid username or password');
    }

    // Return user info or your own session/token here
    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
      },
    };
  }

  async signUp(
    email: string,
    password: string,
    fullName: string,
    phone: string
  ) {
    const { data, error } = await supabase.from('users').insert([
      {
        email,
        password, // plaintext, but be aware of security concerns
        full_name: fullName,
        phone,
        is_active: true,
      },
    ]);

    if (error) throw error;

    return {
      message: 'User registered',
      user: data?.[0],
    };
  }

  async signOut() {
    // Implement this only if you're using sessions or tokens
    return { message: 'Signed out' };
  }

  getSession() {
    // Stub for session/token retrieval
    return null;
  }
}
