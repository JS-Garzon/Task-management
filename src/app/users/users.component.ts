import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { User } from './../shared/models/user.model';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    FormsModule,
    ToastModule,
    TableModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    ButtonModule,
    RippleModule,
    MultiSelectModule,
    DialogModule
  ],
  providers: [MessageService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export default class UsersComponent {
  users: User[] = [];
  roleOptions!: any[];
  editVisible: boolean = false;
  createVisible: boolean = false;
  deleteVisible: boolean = false;
  editUser: any = {};
  deleteUser: any = {};
  newUser: any = {};

  constructor(private usersService: UsersService, private messageService: MessageService) {}

  ngOnInit() {
    this.loadUsers();
    this.roleOptions = [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' }
    ];
  }

  loadUsers() {
    this.usersService.getUsers().subscribe((users) => {
      this.users = users;
    });
  }

  showCreateDialog() {
    this.createVisible = true;
  }

  showDeleteDialog(user: User) {
    this.deleteUser = { ...user };
    this.deleteVisible = true;
  }

  onRowDeleteConfirm(user: User) {
    this.usersService.deleteUser(user._id);
    this.loadUsers();
    this.deleteVisible = false;
  }

  showDialog(user: User) {
      this.editUser = { ...user };
      this.editVisible = true;
  }

  onCreateUser(user: any) {
    this.usersService.createUser({password: '12345', roles: ['user'], ...user});
    this.loadUsers();
    this.createVisible = false;
  }

  onRowEditSave(user: User) {
    this.usersService.updateUser(user._id, user);
    const index = this.users.findIndex(u => u._id === user._id);
    if (index !== -1) {
      this.users[index] = { ...user };
      this.users = [...this.users];  // Actualizar referencia para que PrimeNG detecte el cambio
    }
    this.editVisible = false;
  }
}
