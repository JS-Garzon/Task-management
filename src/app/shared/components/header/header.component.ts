import { AuthService } from './../../../auth/auth.service';
import { ChangeDetectorRef, Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Token } from '../../models/token.model';
import { Router, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { NgIf } from '@angular/common';
import { ThemeService } from '../../theme/theme.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLinkWithHref, RouterLinkActive, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userInfo!: any
  isDropdownVisible: boolean = false;
  isNavbarVisible: boolean = true;
  userRoles!: string[];
  isAdminRole!: boolean;
  imgSrc: string | ArrayBuffer | null = '';
  private router = inject(Router);
  @ViewChild('dropdown', { static: false }) dropdown!: ElementRef;
  constructor(private authService: AuthService, private themeService: ThemeService, private eRef: ElementRef) {}

  ngOnInit() {
    debugger
    this.authService.getUserInfo().subscribe(
      (user) => {
        this.userInfo = user;
        this.userRoles = this.userInfo.roles;
        this.imgSrc = `http://localhost:3000/${this.userInfo.photo}`
        console.log(this.userInfo)
        this.validateIfIsAdminRole();
        this.checkScreenSize();
      },
      (error) => {
        console.error('Error fetching user info', error);
      }
    );
  }

  logout() {
    localStorage.removeItem('Authorization');
    this.router.navigate(['/login']);
  }

  validateIfIsAdminRole() {
    this.isAdminRole = this.userRoles.some((role: string) => role === 'admin');
  }

  showDropDown(event: Event) {
    event.stopPropagation(); // Detener la propagación del evento
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  showNavBar() {
    this.isNavbarVisible = !this.isNavbarVisible;
    setTimeout(() => {
      this.themeService.initEventsForTheme();
    }, 40);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    const mdBreakpoint = 768; // md breakpoint in TailwindCSS
    this.isNavbarVisible = window.innerWidth >= mdBreakpoint;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (this.isDropdownVisible && this.dropdown && !this.dropdown.nativeElement.contains(event.target)) {
      this.isDropdownVisible = false;
    }
  }
}
