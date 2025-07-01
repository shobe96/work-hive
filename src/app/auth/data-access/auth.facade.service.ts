import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  finalize,
  from,
  map,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Role } from './role.model';
import { RoleEnum } from './role.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthFacadeService {
  private userSubject$ = new BehaviorSubject<User | null>(null);
  private loadingSubject$ = new BehaviorSubject<boolean>(false);
  private roleSubject$ = new BehaviorSubject<Role>({});
  private router = inject(Router);

  private authService = inject(AuthService);

  viewModel = combineLatest({
    loading: this.loadingSubject$.asObservable(),
    user: this.userSubject$.asObservable(),
    role: this.roleSubject$.asObservable(),
  });

  login(email: string, password: string) {
    this.loadingSubject$.next(true);
    from(this.authService.signIn(email, password))
      .pipe(
        switchMap((response) => {
          const user = response.data?.user;
          if (!user) {
            return throwError(
              () => new Error('Login failed. Check credentials.')
            );
          }
          return this.getRoles(user).pipe(
            map((userRole) => {
              if (!userRole) {
                throw new Error('Failed to get Role');
              }
              const role = userRole.roles;

              return { user, role };
            })
          );
        }),
        catchError((err) => {
          console.log('ERROR', err);
          return of();
        }),
        finalize(() => this.loadingSubject$.next(false))
      )
      .subscribe({
        next: (result) => {
          const { user, role } = result;
          this.userSubject$.next(user);
          this.roleSubject$.next(role);

          this.redirectBasedOnTheRole(role.name ?? '');
        },
      });
  }

  getRoles(user: User) {
    return from(this.authService.getRoles(user.id));
  }

  private redirectBasedOnTheRole(roleName: string) {
    switch (roleName) {
      case RoleEnum.ROLE_HR:
        this.router.navigate(['/employees']);
        break;
      case RoleEnum.ROLE_ADMIN:
        this.router.navigate(['/employees']);
        break;
      case RoleEnum.ROLE_EMPLOYEE:
        this.router.navigate(['/employees']);
        break;
      default:
        break;
    }
  }

  logout() {
    this.authService.signOut();
    this.router.navigate(['/']);
  }
}
