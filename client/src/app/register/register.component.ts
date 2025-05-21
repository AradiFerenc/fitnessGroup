import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {logE, logI} from '../../main';
import {NgClass} from '@angular/common';
import {RouterLink, Router} from '@angular/router';
import {AuthService} from '../shared/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
) {}
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      logI('', this.registerForm.value);
      this.authService.register(this.registerForm.value).subscribe({
        next: (data) => {
          logI('Registration successful', data);
          this.router.navigate(['/login']);
        }, error: (err) => {
          logE('', err)
        }
      });
    } else {
      logI('Form is invalid');
    }
  }
}
