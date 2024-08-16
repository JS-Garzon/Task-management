import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User } from '../shared/models/user.model';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000';
  constructor(private router: Router, private messageService: MessageService) { }

  getTheme() {
    return localStorage.getItem('color-theme');
  }
  getUsers() {
    return this.http.get<any>(`${this.baseUrl}/users`);
  }

  createUser(payload: any) {
    this.http.post(`${this.baseUrl}/users`, payload).pipe(
      catchError((error) => {
        console.error('Login error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Creation failed',
          styleClass: this.getTheme() === 'dark' ? 'dark-toast-content-error' : 'light-toast-content'
        });
        return throwError(error);
      })
    )
    .subscribe(
      (config: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User created successfully',
          styleClass: this.getTheme() === 'dark' ? 'dark-toast-content-success' : 'light-toast-content'
      });
      }
    );
  }

  deleteUser(id: string) {
    this.http.delete(`${this.baseUrl}/users/${id}`)
    .pipe(
      catchError((error) => {
      console.error('Login error:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Deletion failed',
      });
      return throwError(error);
    }))
    .subscribe(
      (config: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User deleted successfully',
          styleClass: this.getTheme() === 'dark' ? 'dark-toast-content-success' : 'light-toast-content'
      });
      }
    )
  }

  updateUser(id: string, payload: any) {
    this.http
      .patch(`${this.baseUrl}/users/${id}`, payload)
      .pipe(
        catchError((error) => {
          console.error('Login error:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Update failed',
          });
          return throwError(error);
        })
      )
      .subscribe(
        (config: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User updated successfully',
            styleClass: this.getTheme() === 'dark' ? 'dark-toast-content-success' : 'light-toast-content'
        });
        }
      );
  }
}
