import {Component, OnChanges, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {AsyncPipe, NgIf} from '@angular/common';
import {AuthService} from '../shared/services/auth.service';
import {logE, logI} from '../../main';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIf,
    AsyncPipe,
  ],
  styleUrls: ['./navbar.component.scss']
})


export class NavbarComponent {

  constructor(
    private http: HttpClient,
    private router: Router,
    protected authService: AuthService,
  ) {}

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        logE('', err);
      }
    });
  }
}
