import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../data-access/supabase.service';
import { UserRole } from 'src/app/auth/data-access/user-role.model';
import { Join } from '../data-access/join.model';

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

  async getRoles(userId: string) {
    const joins: Join[] = [
      {
        forignKeyName: 'role_id',
        joinTableName: 'roles',
        whereKeyName: 'user_id',
        whereValue: userId,
      },
    ];
    const result = await this.supabaseService.getWithJoins<UserRole>(
      'user_roles',
      joins
    );
    return result;
  }
}
