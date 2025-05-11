import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './features/auth/services/auth.service';
import { UserService } from './features/profile/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}
  
  ngOnInit(): void {
    // Check token validity when app starts - do this with minimal delay
    // to ensure it runs before other components are fully initialized
    setTimeout(() => {
      this.restoreStateIfTokenStillValid();
    }, 0);
  }
  
  private restoreStateIfTokenStillValid(): void {
    // Check if token is valid - this will also initialize user data if token is valid
    const isAuthenticated = this.authService.checkAndRestoreAuth();
    console.log('AppComponent: Auth state after restoration:', isAuthenticated);
    
    if (isAuthenticated) {
      console.log('Valid token found, user is authenticated');
      
      // Make sure user data is properly initialized - this will ensure partner status is set
      const currentUser = this.userService.getCurrentUserFromLocalStorage();
      
      if (currentUser) {
        // User data exists - make sure partner status is initialized
        this.userService.initializePartnerStatus();
        console.log('User data found, partner status:', currentUser.is_partner);
      } else {
        // Token is valid but user data is missing - likely an inconsistent state
        console.warn('Token valid but user data missing - attempting to fetch user data');
        const userId = this.authService['tokenService'].getUserIdFromToken();
        
        if (userId) {
          this.userService.getUserById(userId).subscribe({
            next: (user) => console.log('User data fetched successfully'),
            error: (err) => console.error('Failed to fetch user data:', err)
          });
        }
      }
      
      // Redirect if on auth pages
      if (this.router.url.includes('/auth')) {
        this.router.navigate(['/listings']);
      }
    } else {
      console.log('No valid token found or token expired');
      
      // Clear user data to ensure consistency
      this.userService.reset();
      
      // Only redirect to login if on a protected route
      // This prevents redirect loops when already on auth pages

        this.router.navigate(['/auth/sign-in']);

    }
  }
}