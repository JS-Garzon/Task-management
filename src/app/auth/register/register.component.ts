import { NgClass, NgIf } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { ThemeService } from '../../shared/theme/theme.service';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLinkWithHref, RouterLinkActive, ReactiveFormsModule, NgIf, NgClass],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  credentials!: FormGroup;
  showTooltip: boolean = false;
  constructor(private themeService: ThemeService, private fb: FormBuilder, private renderer: Renderer2, private authService: AuthService) {}


  ngOnInit() {
    setTimeout(() => {
      this.themeService.initEventsForTheme()
    }, 50);
    this.credentials = this.fb.group({
      username: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(1)]
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)]
      }),
      passwordRepeat: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)]
      })
    }, {
      validators: this.passwordMatchValidator
    });
  }

  onSubmit() {
    const emailControl = this.credentials.get('email');
    this.validateEmail(emailControl?.value);

  }

  onEmailInput() {
    const emailControl = this.credentials.get('email');
    if (emailControl?.invalid && emailControl?.touched) {
      this.showTooltip = true;
    } else {
      this.showTooltip = false;
    }
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const passwordRepeat = formGroup.get('passwordRepeat')?.value;
    return password === passwordRepeat ? null : { mismatch: true };
  }

  validateEmail(email: string) {
    const existEmail: any = this.authService.findByEmail(email, this.credentials);

  }
}
