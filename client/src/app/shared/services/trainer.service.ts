import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Trainer} from '../../models/Trainer';
import {logI} from '../../../main';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {

  headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  });


  constructor(
    private http: HttpClient,
  ) { }

  getAll() {
    return this.http.get<Trainer []>('http://localhost:3000/listTrainers', {withCredentials: true});
  }

  addItem(trainer: Trainer) {
    const body = new URLSearchParams();
    body.set('name', trainer.name);
    return this.http.post('http://localhost:3000/addTrainer', body, {headers: this.headers, withCredentials: true});
  }

  deleteItem(id: string) {
    const body = new URLSearchParams();
    body.set('_id', id);
    return this.http.post('http://localhost:3000/deleteTrainer', body , {headers: this.headers, withCredentials: true});
  }

  addReview(id: string, review: any) {
    const body = new URLSearchParams();
    body.set('_id', id);
    body.set('review', review.review);
    logI('review: ', review);
    return this.http.post('http://localhost:3000/addTrainerReview', body, {headers: this.headers, withCredentials: true});
  }

  getTrainer(id: string) {
    const body = new URLSearchParams();
    body.set('_id', id);
    return this.http.post('http://localhost:3000/getTrainer', body, {headers: this.headers, withCredentials: true});
  }
}
