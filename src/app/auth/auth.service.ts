import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { catchError, Observable, throwError } from 'rxjs';
import { Token } from '../shared/models/token.model';
import { MessagesInfoService } from '../shared/services/messages-info.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'http://localhost:3000';
  errorMessage: any;
  constructor(private messagesInfoService: MessagesInfoService) {}

  getToken(): string | null {
    return localStorage.getItem('Authorization');
  }
  getUserIdFromToken(): Token | null {
    const token = this.getToken();
    if (token) {
      const decoded: Token = jwtDecode(token);
      return decoded;
    }
    return null;
  }


  getUserInfo(): Observable<any> {
    debugger
    const userId = this.getUserIdFromToken();
    if (userId) {
      return this.http.get(`${this.baseUrl}/users/${userId.sub}`);
    }
    throw new Error('User ID not found in token');
  }

  login(credentials: any): any {
    this.http
      .post(`${this.baseUrl}/auth/login`, credentials)
      .pipe(
        catchError((error) => {
          console.error('Login error:', error);
          this.messagesInfoService.messageError('Login failed');
          return throwError(error);
        })
      )
      .subscribe((config: any) => {
        localStorage.setItem('Authorization', config.access_token);
        this.messagesInfoService.messageSuccess('Login successful');
          this.router.navigate(['/']);
      });
  }

  logout() {
    localStorage.removeItem('Authorization');
    this.router.navigate(['/login']);
  }

  findByEmail(email: string, credentials: FormGroup) {
    this.http.get(`${this.baseUrl}/auth/check-email/${email}`)
    .pipe(
      catchError((error) => {
        console.error('Error with this email: ', email, error);
        return throwError(error);
      })
    )
    .subscribe((config: any) => {
      if (!config.exists) {
        const payload = credentials.value;
        Object.assign(payload, { "roles": ["user"] })
        delete payload.passwordRepeat;
        this.registerUser(payload);
      } else {
        this.messagesInfoService.messageWarning('This email already exist');
      }
    })
  }

  registerUser(payload: any) {
    this.http.post(`${this.baseUrl}/auth/register`, payload)
    .pipe(
      catchError((error) => {
        console.error('Error creating the user: ', error);
        return throwError(error);
      })
    )
    .subscribe((config: any) => {
      this.messagesInfoService.messageSuccess('Your account was created');
      this.login({ email: config.email, password: config.password});
    })
  }
}
