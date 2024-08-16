import { HttpClient, HttpHandler, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, NotFoundError, Observable, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private baseUrl = 'http://localhost:3000';
  userInfo!: any;
  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  messageError(detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: detail,
      styleClass:
        this.getTheme() === 'dark'
          ? 'dark-toast-content-error'
          : 'light-toast-content',
    });
  }

  messageSuccess(detail: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: detail,
      styleClass:
        this.getTheme() === 'dark'
          ? 'dark-toast-content-success'
          : 'light-toast-content',
    });
  }
  getTasks(): Observable<any> {
    this.userInfo = this.authService.getUserIdFromToken();
    const data = this.userInfo.roles.some((role: string) => role === 'admin');
    if (data) {
      return this.http.get<any>(`${this.baseUrl}/tasks`);
    }
    return this.http.get<any>(
      `${this.baseUrl}/tasks/user/${this.userInfo.sub}`
    );
  }

  getTheme() {
    return localStorage.getItem('color-theme');
  }

  updateTask(id: string, payload: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/tasks/${id}`, payload).pipe(
      catchError((error) => {
        this.messageError('Update failed');
        return throwError(error);
      })
    );
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/tasks/${id}`).pipe(
      catchError((error) => {
        this.messageError('Deletion failed');
        return throwError(error);
      })
    );
  }

  createTask(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/tasks`, payload).pipe(
      catchError((error) => {
        console.error(error);
        this.messageError('Creation failed');
        return throwError(error);
      })
    );
  }
}
