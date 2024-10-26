import { MessagesInfoService } from './../shared/services/messages-info.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from './../auth/auth.service';
import { Component } from '@angular/core';
import { UsersService } from '../users/users.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export default class ProfileComponent {
  userInfo!: any;
  formUserInfo: FormGroup;
  imgSrc: string | ArrayBuffer | null = '';
  existImg: string = '';
  file!: File;
  private baseUrl = environment.baseUrl;
  input!: any;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private messageInfoService: MessagesInfoService,
    private usersService: UsersService
  ) {
    this.formUserInfo = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      photo: [''],
      roles: [''],
    });
  }

  ngOnInit() {
    this.userInfo = this.authService.getUserInfo().subscribe(
      (user) => {
        this.userInfo = user;

        this.existImg = this.userInfo.photo;
        this.imgSrc = this.existImg ? `${this.baseUrl}/${this.userInfo.photo}` : ''
        this.formUserInfo.patchValue({
          username: this.userInfo.username,
          email: this.userInfo.email,
          roles: this.userInfo.roles,
        });
      },
      (error) => {
        console.error('Error fetching user info', error);
      }
    );
  }

  updateProfile() {

    const payload = this.formUserInfo.value;
    delete payload.roles;
    delete payload.photo
    this.usersService.updateUser(this.userInfo._id, payload);
  }

  imageUploaded(event: any) {

    this.getFile(event);
    if (!this.isValidFileType()) {
      this.handleInvalidFile();
      return;
    }
    this.onFileChange();
  }

  onFileChange() {
    if (this.file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imgSrc = reader.result;
      };
      reader.readAsDataURL(this.file);

      // Append file to form data
      const formData = new FormData();
      formData.append('file', this.file, this.file.name);
      this.usersService.updateUser(this.userInfo._id, formData);
    }
  }

  getFile(event: any) {
    this.input = event.target as HTMLInputElement;
    this.file = this.input.files ? this.input.files[0] : null;
  }

  isValidFileType() {
    let imageTypes = ['image/svg', 'image/png', 'image/jpg', 'image/jpeg'];
    return this.file && imageTypes.includes(this.file.type);
  }

  handleInvalidFile() {
    this.messageInfoService.messageError("This isn't an image");
    this.formUserInfo.patchValue({
      photo: null,
    });
    this.input.value = '';
  }
}
