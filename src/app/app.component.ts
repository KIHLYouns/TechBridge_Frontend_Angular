import { Component, OnInit } from '@angular/core';
import { AuthService } from './features/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
      // Check token validity when app starts - do this with minimal delay
    // to ensure it runs before other components are fully initialized
    setTimeout(() => {
      this.restoreStateIfTokenStillValid();
    }, 0);
  }
  
  private restoreStateIfTokenStillValid(): void {
    const isAuthenticated = this.authService.checkAndRestoreAuth();
    console.log('AppComponent: Auth state after restoration:', isAuthenticated);
    
    if (isAuthenticated) {
      console.log('Valid token found, user is authenticated');
      // Redirect if on auth pages
      if (this.router.url.includes('/auth')) {
        this.router.navigate(['/listings']);
      }
    } else {
      console.log('No valid token found or token expired');
      // Only redirect to login if on a protected route
      // This prevents redirect loops when already on auth pages
      if (this.isProtectedRoute(this.router.url)) {
        this.router.navigate(['/auth/sign-in']);
      }
    }
  }

  // here we will put protected routes
  private isProtectedRoute(url: string): boolean {
    const protectedPaths = [
      '/dashboard',
      '/profile',
      '/my-space',
      '/settings'
    ];
    
    return protectedPaths.some(path => url.startsWith(path));
  }
  
}
