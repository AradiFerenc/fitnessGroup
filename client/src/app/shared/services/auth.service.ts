import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { logI } from '../../../main';
import { User } from '../../models/User';
import { Observable, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  _isAdminStatus$: Observable<boolean> | null = null;
  _isLoggedInStatus$: Observable<boolean> | null = null;

  headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  });

  constructor(private http: HttpClient) { }

  login(user: User) {
    const body = new URLSearchParams();
    logI('email: ', user.email);
    logI('password: ', user.password);

    body.set('email', user.email);
    body.set('password', user.password);

    return this.http.post('http://localhost:3000/login', body, {
      headers: this.headers,
      withCredentials: true
    }).pipe(
      tap(() => {
        // Reset status after login
        this.resetAuthStatus();
      })
    );
  }

  register(user: User) {
    const body = new URLSearchParams();
    body.set('email', user.email);
    body.set('password', user.password);

    return this.http.post('http://localhost:3000/register', body, {
      headers: this.headers,
      withCredentials: true
    });
  }

  logout() {
    return this.http.post('http://localhost:3000/logout', {}, {
      withCredentials: true,
      responseType: 'text'
    }).pipe(
      tap(() => {
        // Reset status after logout
        this.resetAuthStatus();
      })
    );
  }

  checkAuth(): Observable<boolean> {
    if (!this._isLoggedInStatus$) {
      this._isLoggedInStatus$ = this.http.get<boolean>('http://localhost:3000/isloggedin', {
        withCredentials: true
      }).pipe(
        shareReplay(1)
      );
    }
    return this._isLoggedInStatus$;
  }

  checkAdmin(): Observable<boolean> {
    if (!this._isAdminStatus$) {
      this._isAdminStatus$ = this.http.get<boolean>('http://localhost:3000/isadmin', {
        withCredentials: true
      }).pipe(
        shareReplay(1)
      );
    }
    return this._isAdminStatus$;
  }

  // Reset cached observables when auth state changes
  resetAuthStatus(): void {
    this._isAdminStatus$ = null;
    this._isLoggedInStatus$ = null;
  }
}
