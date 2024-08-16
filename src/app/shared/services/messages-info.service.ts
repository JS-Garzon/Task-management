import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class MessagesInfoService {

  constructor(private messageService: MessageService) { }

  getTheme() {
    return localStorage.getItem('color-theme');
  }

  messageError(detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: detail,
      styleClass: this.getTheme() === 'dark' ? 'dark-toast-content-error' : 'light-toast-content'
    });
  }

  messageSuccess(detail: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: detail,
      styleClass: this.getTheme() === 'dark' ? 'dark-toast-content-success' : 'light-toast-content'
    });
  }

  messageInfo(detail: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Confirmed',
      detail: detail,
      styleClass: this.getTheme() === 'dark' ? 'dark-toast-content-info' : 'light-toast-content'
    });
  }

  messageWarning(detail: string) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warn',
      detail: detail,
      styleClass: this.getTheme() === 'dark' ? 'dark-toast-content-warning' : 'light-toast-content'
    });
  }
}
