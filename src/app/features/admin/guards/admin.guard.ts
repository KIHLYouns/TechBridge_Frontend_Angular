import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { AuthService } from '../../../features/auth/services/auth.service';
import { UserService } from '../../../features/profile/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/sign-in']);
      return of(false);
    }

    // Obtenir l'ID de l'utilisateur directement depuis le service
    const userId = this.userService.getCurrentUserId();
    if (!userId) {
      this.router.navigate(['/']);
      return of(false);
    }
    
    return this.userService.getUserById(userId).pipe(
      map(user => {
        if (user && user.role === 'ADMIN') {
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      })
    );
  }
}
