import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  Router, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Check if the user is authenticated
    if (this.authService.isAuthenticated()) {
      return true; // Allow access to the route
    }
    
    // Store the attempted URL for redirecting after login
    const returnUrl = state.url;
    
    // Navigate to the login page with a return URL
    return this.router.createUrlTree(
      ['/auth/sign-in'], 
      { queryParams: { returnUrl } }
    );
  }
}