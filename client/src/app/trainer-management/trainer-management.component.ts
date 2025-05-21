import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AsyncPipe, CommonModule, NgForOf, NgIf} from '@angular/common';
import {FitnessGroup} from '../models/fitnessGroup';
import {FitnessGroupService} from '../shared/services/fitness-group.service';
import {AuthService} from '../shared/services/auth.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {logE, logI} from '../../main';
import {Trainer} from '../models/Trainer';
import {TrainerService} from '../shared/services/trainer.service';

@Component({
  selector: 'app-trainer-management',
  imports: [
    NgForOf,
    NgIf,
    AsyncPipe,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './trainer-management.component.html',
  styleUrl: './trainer-management.component.scss'
})
export class TrainerManagementComponent implements OnInit {
  form!: FormGroup;
  reviewForm!: FormGroup;
  trainers?: Trainer[];

  constructor(
    private typeService: TrainerService,
    protected authService: AuthService,
    private formBuilder: FormBuilder,
  ){ }

  ngOnInit() {
    this.loadAll();
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
    });

    this.reviewForm = this.formBuilder.group({
      review: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      logI('', this.form.value);
      this.typeService.addItem(this.form.value).subscribe({
        next: (data) => {
          logI('Addition successful', data);
          window.location.reload();
        }, error: (err) => {
          logE('', err)
        }
      });
    } else {
      logI('Form is invalid');
    }
  }

  loadAll() {
    this.typeService.getAll().subscribe({
      next: (trainers) => {
        this.trainers = trainers;
      },
      error: (error) => {
        console.error('Error loading trainers:', error);
      }
    })
  }

  delete(id: string) {
    this.typeService.deleteItem(id).subscribe({
      next: () => {
        logI('Deletion successful');
        window.location.reload();
      },
      error: (err) => {
        logE('', err);
      }
    });
  }

  addReview(id: string) {
    if (this.reviewForm.valid) {
      logI('', this.reviewForm.value);
      this.typeService.addReview(id, this.reviewForm.value).subscribe({
        next: (data) => {
          logI('Addition successful', data);
          window.location.reload();
        }, error: (err) => {
          logE('', err)
        }
      });
    } else {
      logI('Form is invalid');
    }
  }

}
