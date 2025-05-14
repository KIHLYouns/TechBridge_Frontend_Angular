import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';
import { combineLatest, map, Observable, Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../features/profile/services/user.service';

// Update the interface to include showPartnerNav
interface NavState {
  isAuthenticated: boolean;
  isPartnerInterface: boolean;
}

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isAuthenticated$!: Observable<boolean>;
  public navState$!: Observable<NavState>;
  isAuthenticated = false;
  isPartnerInterface = false;
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}
  
  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.authState$;
    
    // Initialize navState$ observable
    this.navState$ = combineLatest([
      this.authService.authState$,
      this.userService.isPartnerInterface$
    ]).pipe(
      map(([isAuthenticated, isPartnerInterface]) => ({
        isAuthenticated,
        isPartnerInterface
      }))
    );
    
    // Subscribe to authentication state changes
    this.authService.authStateSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe((authState) => {
        this.isAuthenticated = authState;
        console.log('HeaderComponent: Auth state updated:', authState);
      });
      
    // Subscribe to interface mode changes
    this.userService.isPartnerInterface$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isPartnerInterface) => {
        this.isPartnerInterface = isPartnerInterface;
        console.log('HeaderComponent: Interface mode updated:', isPartnerInterface ? 'Partner' : 'Client');
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.authService.logout();
  }
  
  // Add this method to allow toggling interface from header if needed
  toggleInterface(): void {
    this.userService.switchInterface(!this.isPartnerInterface);
  }
}