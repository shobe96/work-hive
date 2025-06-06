import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../data-access/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabaseService = inject(SupabaseService);

  async signIn(email: string, password: string) {
    return await this.supabaseService.signIn(email, password);
  }

  async signUp(email: string, password: string) {
    return await this.supabaseService.signUp(email, password);
  }

  async signOut() {
    return await this.supabaseService.signOut();
  }

  async getSession() {
    return await this.supabaseService.getSession();
  }

  async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession();
    return !!session?.user;
  }

  async getCurrentUser() {
    const session = await this.getSession();
    return session?.user || null;
  }
}
