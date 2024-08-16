import { MessageService } from 'primeng/api';
import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../theme/theme.service';
import TasksComponent from '../../../tasks/tasks.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, RouterModule, TasksComponent, ToastModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  constructor(private themeService: ThemeService) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.themeService.initEventsForTheme();
    }, 50);
  }
}
