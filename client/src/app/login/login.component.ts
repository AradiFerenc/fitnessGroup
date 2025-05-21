import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {logI} from '../../main';
import {NgClass} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../shared/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    NgClass,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }


  onSubmit() {
    if (this.loginForm.valid) {
      logI('', this.loginForm.value);
      this.authService.login(this.loginForm.value).subscribe({
        next: (data: any) => {
          logI('Login successful', data);
          this.router.navigateByUrl('/home');
          if (data) {
            logI("",data);
          }
        },
        error: (error) => {
          logI('Login failed: ', error);
        }
      });
    } else {
      logI('Form is invalid');
    }
  }
}
