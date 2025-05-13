import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';
import { combineLatest, map, Observable } from 'rxjs';
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
      this.userService.isPartnerInterface$
    ]).pipe(
      map(([isAuthenticated, isPartnerInterface]) => ({
        isAuthenticated,
        isPartnerInterface
      }))
    );
  }
  
}
