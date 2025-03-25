import { Component, OnInit, OnDestroy } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.module';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SHARED_IMPORTS] ,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  isRegistered: boolean = false;
  isDropdownOpen: boolean = false;
  private authSubscription: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Check if user is authenticated on initialization
    this.isRegistered = false // this.authService.check();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  // Redirects to the login page when the button is clicked.
  redirectToLogin(): void {
    console.log('Redirecting to login...');
    this.router.navigate(['/login']);
  }
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
