import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FitnessGroup} from '../../models/fitnessGroup';
import {logI} from '../../../main';

@Injectable({
  providedIn: 'root'
})
export class FitnessGroupService {

  headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  });


  constructor(
    private http: HttpClient,
  ) { }

  getAll() {
    return this.http.get<FitnessGroup []>('http://localhost:3000/listFitnessgroups', {withCredentials: true});
  }

  addItem(fitnessGroup: FitnessGroup) {
    const body = new URLSearchParams();
    body.set('name', fitnessGroup.name);
    body.set('description', fitnessGroup.description);
    body.set('startTime', fitnessGroup.startTime);
    body.set('endTime', fitnessGroup.endTime);
    body.set('trainer', fitnessGroup.trainer.toString());
    return this.http.post('http://localhost:3000/addFitnessGroup', body, {headers: this.headers, withCredentials: true});
  }

  deleteItem(id: string) {
    const body = new URLSearchParams();
    body.set('_id', id);
    return this.http.post('http://localhost:3000/deleteFitnessGroup', body , {headers: this.headers, withCredentials: true});
  }

  joinGroup(id: string) {
    const body = new URLSearchParams();
    body.set('_id', id);
    return this.http.post('http://localhost:3000/joinFitnessGroup', body , {headers: this.headers, withCredentials: true});
  }
}
