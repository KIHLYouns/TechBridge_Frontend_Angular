import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';
import { combineLatest, map, Observable } from 'rxjs';
import { UserService } from '../../../features/profile/services/user.service';

// Add interface
interface NavState {
  isAuthenticated: boolean;
  isPartner: boolean;
}

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  public isAuthenticated$!: Observable<boolean>;
  public navState$!: Observable<NavState>;
  constructor(private authService: AuthService,
    private userService: UserService) {}
  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.authState$;
    // Log initial authentication state for debugging
    this.navState$ = combineLatest([
      this.authService.authState$,
      this.userService.isPartner$
    ]).pipe(
      map(([isAuthenticated, isPartner]) => ({
        isAuthenticated,
        isPartner
      }))
    );
  }
  
}
