import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  public isAuthenticated$!: Observable<boolean>;
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.authState$;
    // Log initial authentication state for debugging
    this.authService.authState$.subscribe(state => {
      console.log('HeaderComponent received auth state update:', state);
    });
  }
}
