import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {User} from '../models/User';
import {UserService} from '../shared/services/user.service';

@Component({
  selector: 'app-user-management',
  imports: [
    CommonModule
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent {
  users?: User[];

  constructor(
    private userService: UserService,
  ){ }

  ngOnInit() {
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    })
  }
}
