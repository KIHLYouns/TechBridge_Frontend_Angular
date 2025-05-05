import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';
import { combineLatest, map, Observable } from 'rxjs';
import { UserService } from '../../../features/profile/services/user.service';

// Update the interface to include showPartnerNav
interface NavState {
  isAuthenticated: boolean;
  isPartner: boolean;
  showPartnerNav: boolean; // Add this property
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
      
      this.navState$ = combineLatest([
        this.authService.authState$,
        this.userService.isPartner$,
        this.userService.interfaceToggleState$
      ]).pipe(
        map(([isAuthenticated, isPartner, interfaceToggleState]) => ({
          isAuthenticated,
          isPartner,
          // Only show partner nav when they're a partner AND using partner interface
          showPartnerNav: isPartner && interfaceToggleState 
        }))
      );
    }
  
}
