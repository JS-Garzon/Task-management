import { AuthService } from './../../../auth/auth.service';
import { ChangeDetectorRef, Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Token } from '../../models/token.model';
import { Router, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { NgIf } from '@angular/common';
import { ThemeService } from '../../theme/theme.service';
import { environment } from '../../../../environments/environment';
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
  existImg: string = '';
  private baseUrl = environment.baseUrl;
  private router = inject(Router);
  @ViewChild('dropdown', { static: false }) dropdown!: ElementRef;
  constructor(private authService: AuthService, private themeService: ThemeService, private eRef: ElementRef) {}

  ngOnInit() {

    this.authService.getUserInfo().subscribe(
      (user) => {
        this.userInfo = user;
        this.userRoles = this.userInfo.roles;
        this.existImg = this.userInfo.photo
        this.imgSrc = this.existImg ? `${this.baseUrl}/${this.existImg}` : ''
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
