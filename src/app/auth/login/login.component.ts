import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { EmailValidatorPipe } from '../../shared/pipes/email-validator.pipe';
import { ThemeService } from '../../shared/theme/theme.service';
import { AuthService } from './../auth.service';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    EmailValidatorPipe,
    ToastModule,
    RouterLinkWithHref,
    RouterLinkActive
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private authService: AuthService, private themeService: ThemeService) {}

  credentials = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
  });

  loginForm() {
    const credentials = this.credentials.value;
    this.authService.login(credentials);

  }

  ngOnInit() {
    setTimeout(() => {
      this.themeService.initEventsForTheme()
    }, 50);
  }


}
