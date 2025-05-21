import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AsyncPipe, CommonModule, NgForOf, NgIf} from '@angular/common';
import {FitnessGroup} from '../models/fitnessGroup';
import {FitnessGroupService} from '../shared/services/fitness-group.service';
import {AuthService} from '../shared/services/auth.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {logE, logI} from '../../main';
import {Observable} from 'rxjs';
import {TrainerService} from '../shared/services/trainer.service';

@Component({
  selector: 'app-home',
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  form!: FormGroup;
  fitnessGroups?: FitnessGroup[];
  trainers?: any[];

  constructor(
    private typeService: FitnessGroupService,
    protected trainerService: TrainerService,
    protected authService: AuthService,
    private formBuilder: FormBuilder,
  ){ }

  ngOnInit() {
    this.loadFitnessGroups();
    this.loadTrainers();
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      trainer: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      description: [''],
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

  loadFitnessGroups() {
    this.typeService.getAll().subscribe({
      next: (fitnessGroups) => {
        this.fitnessGroups = fitnessGroups;
        for (let fitnessGroup of this.fitnessGroups) {
          this.trainerService.getTrainer(fitnessGroup.trainer).subscribe({
            next: (trainer:any) => {
              fitnessGroup.trainer = trainer.name;
            },
            error: (error) => {
              console.error('Error loading trainer:', error);
            }
          });
        }
      },
      error: (error) => {
        console.error('Error loading users:', error);
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

  joinGroup(id: string) {
    this.typeService.joinGroup(id).subscribe({
      next: () => {
        logI('Join successful');
        window.location.reload();
      },
      error: (err) => {
        logE('', err);
      }
    });
  }

  loadTrainers() {
    this.trainerService.getAll().subscribe({
      next: (data) => {
        this.trainers = data;
        logI('Join successful');
      },
      error: (err) => {
        logE('', err);
      }
    });
  }

}
